/**
 * Emotion & Trauma-Informed NLP Analysis Engine
 * Inspired by IEEE Paper (ICSADL 2026: 11452105):
 * "An Anonymous Complaint Reporting System using DistilBERT-based Emotional Analysis"
 * 
 * Provides fine-grained emotion recognition (Fear, Distress, Anger, Sadness, Calm),
 * high-risk crisis detection (domestic abuse, violence, immediate peril, child harm),
 * and priority escalation for vulnerable whistleblowers and victims.
 */

export interface EmotionAnalysisResult {
  primaryEmotion: 'Fear / Intimidation' | 'Distress / Trauma' | 'Anger / Violation' | 'Sadness / Despair' | 'Objective / Calibrated';
  emotionScores: {
    fear: number;
    distress: number;
    anger: number;
    sadness: number;
    calm: number;
  };
  emotionalIntensity: number; // 0 - 100
  isHighRiskCrisis: boolean;
  crisisCategory?: string | undefined;
  crisisInterventionNotes?: string | undefined;
  recommendedUrgency: number; // 0 - 100
  linguisticMarkers: string[];
}


// Lexicons calibrated for forensic abuse, harassment, and crime reporting
const FEAR_MARKERS = [
  'scared', 'terrified', 'afraid', 'threatened', 'fear', 'retaliation', 'weapon',
  'kill', 'stalking', 'watched', 'danger', 'hunting', 'unsafe', 'panic', 'hiding',
  'retaliate', 'fired', 'blackmail', 'cornered', 'intimidat'
];

const DISTRESS_MARKERS = [
  'trauma', 'crying', 'sobbing', 'pain', 'hurt', 'helpless', 'overwhelmed', 'nightmare',
  'screaming', 'abused', 'assaulted', 'touched', 'shaking', 'suffering', 'agony',
  'desperate', 'broken', 'unbearable', 'suffocating', 'violated'
];

const ANGER_MARKERS = [
  'furious', 'rage', 'disgusted', 'corrupt', 'illegal', 'theft', 'fraud', 'embezzle',
  'stealing', 'bribe', 'outrage', 'liar', 'coverup', 'conspiracy', 'scam', 'cheating',
  'exploitation', 'injustice', 'unacceptable'
];

const SADNESS_MARKERS = [
  'depressed', 'isolated', 'lonely', 'hopeless', 'giving up', 'nobody cares', 'suicide',
  'self harm', 'worthless', 'lost', 'abandoned', 'numb', 'despair'
];

const HIGH_RISK_TRIGGERS = [
  { pattern: /(kill|murder|shoot|stab|weapon|gun|knife)/i, category: 'Imminent Physical Violence' },
  { pattern: /(child|minor|kid|underage|pedophil|molest)/i, category: 'Child Protection / Vulnerable Minor Hazard' },
  { pattern: /(rape|sexual assault|forced|groped|molested)/i, category: 'Sexual Violence & Coercion' },
  { pattern: /(domestic violence|beat|hitting|strangl|chok)/i, category: 'Domestic Battery & Abuse' },
  { pattern: /(suicid|end my life|kill myself|want to die)/i, category: 'Immediate Psychological Crisis / Self-Harm' },
  { pattern: /(bolted|blocked exit|fire hazard|toxic gas|explosion)/i, category: 'Mass Community / Workplace Safety Emergency' }
];

export const analyzeEmotionAndRisk = (
  description: string,
  category: string,
  userSeverity?: string
): EmotionAnalysisResult => {
  const text = (description || '').toLowerCase();
  const words = text.split(/[\s,.;:!?()]+/).filter(Boolean);

  let fearScore = 0;
  let distressScore = 0;
  let angerScore = 0;
  let sadnessScore = 0;
  const matchedMarkers: string[] = [];

  // Match linguistic markers
  words.forEach(w => {
    if (FEAR_MARKERS.some(m => w.includes(m))) {
      fearScore += 12;
      matchedMarkers.push(`fear:${w}`);
    }
    if (DISTRESS_MARKERS.some(m => w.includes(m))) {
      distressScore += 14;
      matchedMarkers.push(`distress:${w}`);
    }
    if (ANGER_MARKERS.some(m => w.includes(m))) {
      angerScore += 10;
      matchedMarkers.push(`anger:${w}`);
    }
    if (SADNESS_MARKERS.some(m => w.includes(m))) {
      sadnessScore += 15;
      matchedMarkers.push(`sadness:${w}`);
    }
  });

  // Check Category Weightings
  if (category === 'Community Safety' || category === 'Physical Threat & Violence' || category === 'Environmental & Hazard Violation') {
    fearScore += 20;
  } else if (category === 'Workplace Harassment' || category === 'Bullying & Cyber Harassment' || category === 'Discrimination & Civil Rights') {
    distressScore += 18;
    angerScore += 12;
  } else if (category === 'Ragging & Student Hazing') {
    fearScore += 16;
    distressScore += 20;
  } else if (category === 'Civic/Government Fraud' || category === 'Financial Fraud & Embezzlement' || category === 'Whistleblowing') {
    angerScore += 20;
  } else if (category === 'Cybersecurity & Data Breach') {
    fearScore += 10;
    angerScore += 12;
  } else if (category === 'Healthcare & Medical Malpractice') {
    distressScore += 20;
    fearScore += 10;
  } else if (category === 'Retaliation & Extortion') {
    fearScore += 25;
    distressScore += 15;
  } else if (category === 'Campus/School Incident') {
    distressScore += 15;
  }

  // Cap raw scores to 100
  fearScore = Math.min(100, fearScore);
  distressScore = Math.min(100, distressScore);
  angerScore = Math.min(100, angerScore);
  sadnessScore = Math.min(100, sadnessScore);

  // Compute Calm / Objective residual
  const highestEmotional = Math.max(fearScore, distressScore, angerScore, sadnessScore);
  const calmScore = Math.max(5, 100 - highestEmotional);

  // Determine Primary Emotion
  let primaryEmotion: EmotionAnalysisResult['primaryEmotion'] = 'Objective / Calibrated';
  if (highestEmotional < 25) {
    primaryEmotion = 'Objective / Calibrated';
  } else if (distressScore >= fearScore && distressScore >= angerScore && distressScore >= sadnessScore) {
    primaryEmotion = 'Distress / Trauma';
  } else if (fearScore >= angerScore && fearScore >= sadnessScore) {
    primaryEmotion = 'Fear / Intimidation';
  } else if (angerScore >= sadnessScore) {
    primaryEmotion = 'Anger / Violation';
  } else {
    primaryEmotion = 'Sadness / Despair';
  }

  // High-Risk Crisis Evaluation (as formulated in IEEE 11452105)
  let isHighRiskCrisis = false;
  let crisisCategory: string | undefined;
  let crisisInterventionNotes: string | undefined;

  for (const trigger of HIGH_RISK_TRIGGERS) {
    if (trigger.pattern.test(text)) {
      isHighRiskCrisis = true;
      crisisCategory = trigger.category;
      crisisInterventionNotes = `Automated crisis flag triggered: ${trigger.category}. Immediate investigator escalation & victim trauma protection protocol active.`;
      break;
    }
  }

  // Calculate Emotional Intensity Index (0-100)
  const emotionalIntensity = Math.min(
    100,
    Math.round((fearScore * 0.3) + (distressScore * 0.35) + (angerScore * 0.2) + (sadnessScore * 0.15))
  );

  // Calculate Recommended Urgency (0-100)
  let calculatedUrgency = Math.round(
    (emotionalIntensity * 0.4) +
    (userSeverity === 'Critical' ? 45 : userSeverity === 'High' ? 30 : userSeverity === 'Medium' ? 20 : 10)
  );

  if (isHighRiskCrisis) {
    calculatedUrgency = Math.max(95, calculatedUrgency);
  }

  calculatedUrgency = Math.min(100, Math.max(15, calculatedUrgency));

  return {
    primaryEmotion,
    emotionScores: {
      fear: fearScore,
      distress: distressScore,
      anger: angerScore,
      sadness: sadnessScore,
      calm: calmScore
    },
    emotionalIntensity,
    isHighRiskCrisis,
    crisisCategory,
    crisisInterventionNotes,
    recommendedUrgency: calculatedUrgency,
    linguisticMarkers: Array.from(new Set(matchedMarkers)).slice(0, 8)
  };
};
