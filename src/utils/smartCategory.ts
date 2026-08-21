import { ComplaintCategory } from '../types';

interface CategoryMatchRule {
  category: ComplaintCategory;
  keywords: string[];
}

const CATEGORY_RULES: CategoryMatchRule[] = [
  {
    category: 'plumbing',
    keywords: [
      'water', 'pipe', 'leak', 'leaking', 'tap', 'faucet', 'sink', 'drain', 'clog',
      'toilet', 'flush', 'washroom', 'shower', 'sewage', 'overflow', 'pressure'
    ]
  },
  {
    category: 'internet_wifi',
    keywords: [
      'wifi', 'wi-fi', 'internet', 'network', 'router', 'connection', 'slow', 'disconnect',
      'lan', 'cable', 'dns', 'signal', 'ethernet', 'bandwidth', 'ip address'
    ]
  },
  {
    category: 'electrical',
    keywords: [
      'fan', 'ac', 'air conditioner', 'light', 'bulb', 'power', 'plug', 'socket',
      'switch', 'short circuit', 'current', 'voltage', 'spark', 'blackout', 'trip', 'mcb', 'wiring'
    ]
  },
  {
    category: 'cleaning',
    keywords: [
      'garbage', 'trash', 'clean', 'cleaning', 'dustbin', 'sweeping', 'dirty', 'smell',
      'waste', 'litter', 'pest', 'cockroach', 'mosquito', 'hygiene', 'mop'
    ]
  },
  {
    category: 'hostel',
    keywords: [
      'hostel', 'room', 'bed', 'mattress', 'cupboard', 'lock', 'block a', 'block b',
      'block c', 'roommate', 'hostel mess', 'dorm', 'warden'
    ]
  },
  {
    category: 'classroom',
    keywords: [
      'projector', 'whiteboard', 'blackboard', 'bench', 'desk', 'podium', 'speaker',
      'mic', 'classroom', 'lecture hall', 'smartboard'
    ]
  },
  {
    category: 'laboratory',
    keywords: [
      'lab', 'laboratory', 'microscope', 'computer lab', 'os lab', 'chemistry lab',
      'physics lab', 'equipment', 'chemical', 'apparatus', 'pc', 'monitor'
    ]
  },
  {
    category: 'transport',
    keywords: [
      'bus', 'shuttle', 'transport', 'driver', 'parking', 'pickup', 'bus stop', 'vehicle'
    ]
  },
  {
    category: 'security',
    keywords: [
      'security', 'guard', 'stolen', 'theft', 'id card', 'gate', 'entry', 'visitor',
      'harassment', 'unauthorized', 'camera', 'cctv'
    ]
  },
  {
    category: 'canteen',
    keywords: [
      'canteen', 'food', 'cafeteria', 'quality', 'hygiene', 'dining', 'mess', 'meal'
    ]
  },
  {
    category: 'library',
    keywords: [
      'library', 'book', 'issue', 'fine', 'study hall', 'journal', 'catalog'
    ]
  }
];

export interface SmartSuggestionResult {
  suggestedCategory: ComplaintCategory;
  confidence: number; // 0 to 100
  matchedKeywords: string[];
}

export function predictCategory(title: string, description: string): SmartSuggestionResult {
  const combinedText = `${title} ${description}`.toLowerCase();
  
  let bestMatchCategory: ComplaintCategory = 'other';
  let maxScore = 0;
  let bestMatchedKeywords: string[] = [];

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    const matches: string[] = [];

    for (const kw of rule.keywords) {
      if (combinedText.includes(kw)) {
        score += kw.length > 4 ? 2 : 1;
        matches.push(kw);
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatchCategory = rule.category;
      bestMatchedKeywords = matches;
    }
  }

  // Calculate confidence score (0 to 100)
  const confidence = Math.min(95, maxScore * 25);

  return {
    suggestedCategory: maxScore > 0 ? bestMatchCategory : 'other',
    confidence: maxScore > 0 ? confidence : 0,
    matchedKeywords: bestMatchedKeywords
  };
}
