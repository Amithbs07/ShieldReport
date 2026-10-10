// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ShieldReportLedger
 * @dev Immutable Decentralized Chain-of-Custody Smart Contract for ShieldReport.
 * Stores cryptographically hashed incident reports, zero-knowledge token commitments,
 * and evidence Merkle roots to guarantee tamper-proof auditability.
 */
contract ShieldReportLedger {
    struct ReportNotarization {
        bytes32 caseTokenHash;       // SHA256(caseToken + salt)
        bytes32 reportContentHash;   // SHA256(encryptedDescription + category)
        bytes32 evidenceMerkleRoot;  // Merkle root of evidence hashes
        uint256 timestamp;           // Block timestamp
        uint256 blockNumber;         // Block number
        address notary;              // Relayer or submitter address
    }

    // Mapping from caseTokenHash to Notarization Record
    mapping(bytes32 => ReportNotarization) private _records;
    
    // Array of all notarized case token hashes
    bytes32[] private _registeredCases;

    address public owner;

    event ReportNotarized(
        bytes32 indexed caseTokenHash,
        bytes32 indexed reportContentHash,
        bytes32 evidenceMerkleRoot,
        uint256 timestamp,
        uint256 blockNumber
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Commits an anonymous report notarization record to the blockchain.
     * @param caseTokenHash One-way cryptographic hash of the 12-char case token
     * @param reportContentHash Hash of the encrypted narrative and category
     * @param evidenceMerkleRoot Merkle tree root of evidence file fingerprints
     */
    function notarizeReport(
        bytes32 caseTokenHash,
        bytes32 reportContentHash,
        bytes32 evidenceMerkleRoot
    ) external returns (bool) {
        require(_records[caseTokenHash].timestamp == 0, "Record already notarized");

        _records[caseTokenHash] = ReportNotarization({
            caseTokenHash: caseTokenHash,
            reportContentHash: reportContentHash,
            evidenceMerkleRoot: evidenceMerkleRoot,
            timestamp: block.timestamp,
            blockNumber: block.number,
            notary: msg.sender
        });

        _registeredCases.push(caseTokenHash);

        emit ReportNotarized(
            caseTokenHash,
            reportContentHash,
            evidenceMerkleRoot,
            block.timestamp,
            block.number
        );

        return true;
    }

    /**
     * @notice Verifies if a report hash matches the immutable on-chain record.
     */
    function verifyReport(
        bytes32 caseTokenHash,
        bytes32 reportContentHash,
        bytes32 evidenceMerkleRoot
    ) external view returns (bool isValid, uint256 timestamp, uint256 blockNumber) {
        ReportNotarization memory record = _records[caseTokenHash];
        if (record.timestamp == 0) {
            return (false, 0, 0);
        }

        bool matchContent = (record.reportContentHash == reportContentHash);
        bool matchMerkle = (record.evidenceMerkleRoot == evidenceMerkleRoot);

        return (matchContent && matchMerkle, record.timestamp, record.blockNumber);
    }

    /**
     * @notice Returns total notarized cases count.
     */
    function getTotalNotarizedCount() external view returns (uint256) {
        return _registeredCases.length;
    }
}
