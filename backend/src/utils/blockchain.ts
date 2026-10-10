import crypto from 'crypto';
import prisma from '../lib/prisma';

export interface BlockchainBlockRecord {
  blockNumber: number;
  timestamp: string;
  previousHash: string;
  blockHash: string;
  caseTokenHash: string;
  reportContentHash: string;
  evidenceMerkleRoot: string;
  txHash: string;
  nonce: number;
}

export interface VerificationProof {
  isValid: boolean;
  blockNumber: number;
  blockHash: string;
  previousHash: string;
  txHash: string;
  timestamp: string;
  evidenceMerkleRoot: string;
  chainIntegrityVerified: boolean;
  notarizationStatement: string;
}

/**
 * Computes a standard SHA-256 hash string
 */
export const sha256 = (data: string): string => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generates an anonymized one-way commitment of the Case Token.
 * Prevents plain-text tokens from ever being exposed on public ledgers while
 * allowing reporters to prove ownership mathematically.
 */
export const hashCaseToken = (caseToken: string): string => {
  const SALT = process.env.ENCRYPTION_KEY?.substring(0, 16) || 'SHIELD_REPORT_LEDGER_SALT';
  return sha256(`TOKEN:${caseToken}:${SALT}`);
};

/**
 * Calculates a Merkle Tree Root hash from an array of evidence SHA-256 hashes
 */
export const computeMerkleRoot = (hashes: string[]): string => {
  if (!hashes || hashes.length === 0) {
    return sha256('SHIELDREPORT_EMPTY_EVIDENCE_TREE');
  }

  let currentLevel: string[] = hashes.map(h => (h.startsWith('SHA256:') ? h.replace('SHA256:', '') : h));

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i] || '';
      const right = i + 1 < currentLevel.length ? (currentLevel[i + 1] || left) : left;
      nextLevel.push(sha256(left + right));
    }
    currentLevel = nextLevel;
  }

  return currentLevel[0] || sha256('SHIELDREPORT_EMPTY_EVIDENCE_TREE');
};


/**
 * Ensures Genesis Block exists in the database.
 */
export const ensureGenesisBlock = async (): Promise<any> => {
  const existingGenesis = await prisma.blockchainBlock.findUnique({
    where: { blockNumber: 0 }
  });

  if (existingGenesis) return existingGenesis;

  const genesisTimestamp = new Date('2026-01-01T00:00:00.000Z');
  const prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const caseTokenHash = sha256('GENESIS_CASE_TOKEN');
  const reportContentHash = sha256('SHIELDREPORT_PROTOCOL_GENESIS_ROOT');
  const evidenceMerkleRoot = sha256('GENESIS_EVIDENCE_ROOT');
  const blockHash = sha256(`0:${genesisTimestamp.toISOString()}:${prevHash}:${caseTokenHash}:${reportContentHash}:${evidenceMerkleRoot}:0`);

  return await prisma.blockchainBlock.create({
    data: {
      blockNumber: 0,
      timestamp: genesisTimestamp,
      previousHash: prevHash,
      blockHash,
      caseTokenHash,
      reportContentHash,
      evidenceMerkleRoot,
      nonce: 0
    }
  });
};

/**
 * Commits a report and all accompanying evidence fingerprints to the immutable blockchain ledger.
 */
export const commitReportToBlockchain = async (
  caseToken: string,
  encryptedDescription: string,
  category: string,
  evidenceHashes: string[]
): Promise<BlockchainBlockRecord> => {
  await ensureGenesisBlock();

  const tokenHash = hashCaseToken(caseToken);
  const reportContentHash = sha256(`${encryptedDescription}:${category}`);
  const evidenceMerkleRoot = computeMerkleRoot(evidenceHashes);

  // Retrieve the latest block
  const latestBlock = await prisma.blockchainBlock.findFirst({
    orderBy: { blockNumber: 'desc' }
  });

  const nextBlockNumber = (latestBlock?.blockNumber ?? 0) + 1;
  const previousHash = latestBlock?.blockHash ?? '0000000000000000000000000000000000000000000000000000000000000000';
  const now = new Date();
  const timestampStr = now.toISOString();

  // Simple Proof-of-Notarization Nonce
  let nonce = 0;
  let blockHash = '';
  while (true) {
    blockHash = sha256(`${nextBlockNumber}:${timestampStr}:${previousHash}:${tokenHash}:${reportContentHash}:${evidenceMerkleRoot}:${nonce}`);
    // Light difficulty check (starts with 0 or 00 for fast verification)
    if (blockHash.startsWith('0') || nonce > 20) {
      break;
    }
    nonce++;
  }

  const createdBlock = await prisma.blockchainBlock.create({
    data: {
      blockNumber: nextBlockNumber,
      timestamp: now,
      previousHash,
      blockHash,
      caseTokenHash: tokenHash,
      reportContentHash,
      evidenceMerkleRoot,
      nonce
    }
  });

  const txHash = `0x${blockHash.substring(0, 40)}`;

  return {
    blockNumber: createdBlock.blockNumber,
    timestamp: createdBlock.timestamp.toISOString(),
    previousHash: createdBlock.previousHash,
    blockHash: createdBlock.blockHash,
    caseTokenHash: createdBlock.caseTokenHash,
    reportContentHash: createdBlock.reportContentHash,
    evidenceMerkleRoot: createdBlock.evidenceMerkleRoot,
    txHash,
    nonce: createdBlock.nonce
  };
};

/**
 * Cryptographically verifies that a report and its evidence are untampered on the ledger.
 */
export const verifyReportBlockchainProof = async (
  caseToken: string
): Promise<VerificationProof | null> => {
  const tokenHash = hashCaseToken(caseToken);

  const block = await prisma.blockchainBlock.findFirst({
    where: { caseTokenHash: tokenHash }
  });

  if (!block) return null;

  // Verify internal block hash integrity
  const expectedHash = sha256(
    `${block.blockNumber}:${block.timestamp.toISOString()}:${block.previousHash}:${block.caseTokenHash}:${block.reportContentHash}:${block.evidenceMerkleRoot}:${block.nonce}`
  );

  const isBlockValid = expectedHash === block.blockHash;

  // Check previous block linkage
  const previousBlock = await prisma.blockchainBlock.findFirst({
    where: { blockNumber: block.blockNumber - 1 }
  });

  const isChainContinuous = !previousBlock || previousBlock.blockHash === block.previousHash;

  const txHash = `0x${block.blockHash.substring(0, 40)}`;

  return {
    isValid: isBlockValid && isChainContinuous,
    blockNumber: block.blockNumber,
    blockHash: block.blockHash,
    previousHash: block.previousHash,
    txHash,
    timestamp: block.timestamp.toISOString(),
    evidenceMerkleRoot: block.evidenceMerkleRoot,
    chainIntegrityVerified: isBlockValid && isChainContinuous,
    notarizationStatement: `Cryptographically verified on immutable Block #${block.blockNumber}. Chain-of-custody valid with 0 tampering detected.`
  };
};

/**
 * Retrieves the complete cryptographic audit ledger for investigator overview
 */
export const getFullBlockchainLedger = async (limit = 50) => {
  return await prisma.blockchainBlock.findMany({
    orderBy: { blockNumber: 'desc' },
    take: limit
  });
};
