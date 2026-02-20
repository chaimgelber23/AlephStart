import { Vowel } from '@/types';

/**
 * Hebrew vowels (nekudot) in teaching order:
 * AH (most common) → EH → EE → OH → OO → Shva → Chataf
 *
 * Each vowel includes a color for visual grouping.
 */

// Vowel color constants (used throughout the app)
export const VOWEL_COLORS = {
  ah: '#3B82F6', // blue
  eh: '#10B981', // green
  ee: '#F59E0B', // amber
  oh: '#8B5CF6', // purple
  oo: '#EF4444', // red
  shva: '#9CA3AF', // gray
  chataf: '#6B7280', // dark gray
} as const;

export const VOWELS: Vowel[] = [
  // ==========================================
  // GROUP 1: AH vowels (taught first — most common)
  // ==========================================
  {
    id: 'patach',
    hebrew: 'ַ',
    name: 'Patach',
    sound: 'AH',
    soundGroup: 'ah',
    color: VOWEL_COLORS.ah,
    transliteration: 'a',
    audioUrl: '/audio/vowels/patach.mp3',
    description: 'A horizontal line under the letter. Makes the "AH" sound (like "father").',
  },
  {
    id: 'kamatz',
    hebrew: 'ָ',
    name: 'Kamatz',
    sound: 'AH',
    soundGroup: 'ah',
    color: VOWEL_COLORS.ah,
    transliteration: 'a',
    audioUrl: '/audio/vowels/kamatz.mp3',
    description: 'A T-shape under the letter. Also makes "AH" — looks like Patach with a line below it.',
  },

  // ==========================================
  // GROUP 2: EH vowels
  // ==========================================
  {
    id: 'segol',
    hebrew: 'ֶ',
    name: 'Segol',
    sound: 'EH',
    soundGroup: 'eh',
    color: VOWEL_COLORS.eh,
    transliteration: 'e',
    audioUrl: '/audio/vowels/segol.mp3',
    description: 'Three dots in a triangle under the letter. Makes "EH" (like "bed").',
  },
  {
    id: 'tzere',
    hebrew: 'ֵ',
    name: 'Tzere',
    sound: 'EH',
    soundGroup: 'eh',
    color: VOWEL_COLORS.eh,
    transliteration: 'ei',
    audioUrl: '/audio/vowels/tzere.mp3',
    description: 'Two dots side by side under the letter. Also makes "EH" (some say closer to "AY").',
  },

  // ==========================================
  // GROUP 3: EE vowel
  // ==========================================
  {
    id: 'chirik',
    hebrew: 'ִ',
    name: 'Chirik',
    sound: 'EE',
    soundGroup: 'ee',
    color: VOWEL_COLORS.ee,
    transliteration: 'i',
    audioUrl: '/audio/vowels/chirik.mp3',
    description: 'A single dot under the letter. Makes "EE" (like "see").',
  },

  // ==========================================
  // GROUP 4: OH vowels
  // ==========================================
  {
    id: 'cholam',
    hebrew: 'ֹ',
    name: 'Cholam',
    sound: 'OH',
    soundGroup: 'oh',
    color: VOWEL_COLORS.oh,
    transliteration: 'o',
    audioUrl: '/audio/vowels/cholam.mp3',
    description: 'A dot above and to the left of the letter. Makes "OH" (like "go").',
  },
  {
    id: 'cholam_vav',
    hebrew: 'וֹ',
    name: 'Cholam Vav',
    sound: 'OH',
    soundGroup: 'oh',
    color: VOWEL_COLORS.oh,
    transliteration: 'o',
    audioUrl: '/audio/vowels/cholam_vav.mp3',
    description: 'A Vav with a dot on top. Makes "OH" — the Vav becomes part of the vowel.',
  },

  // ==========================================
  // GROUP 5: OO vowels
  // ==========================================
  {
    id: 'kubutz',
    hebrew: 'ֻ',
    name: 'Kubutz',
    sound: 'OO',
    soundGroup: 'oo',
    color: VOWEL_COLORS.oo,
    transliteration: 'u',
    audioUrl: '/audio/vowels/kubutz.mp3',
    description: 'Three diagonal dots under the letter. Makes "OO" (like "blue").',
  },
  {
    id: 'shuruk',
    hebrew: 'וּ',
    name: 'Shuruk',
    sound: 'OO',
    soundGroup: 'oo',
    color: VOWEL_COLORS.oo,
    transliteration: 'u',
    audioUrl: '/audio/vowels/shuruk.mp3',
    description: 'A Vav with a dot in the middle. Makes "OO" — the Vav becomes part of the vowel.',
  },

  // ==========================================
  // GROUP 6: Shva
  // ==========================================
  {
    id: 'shva',
    hebrew: 'ְ',
    name: 'Shva',
    sound: '(silent or quick "uh")',
    soundGroup: 'shva',
    color: VOWEL_COLORS.shva,
    transliteration: "'",
    audioUrl: '/audio/vowels/shva.mp3',
    description: 'Two vertical dots under the letter. Usually silent, sometimes a quick "uh" sound. Don\'t worry about the rules yet — we\'ll learn them step by step.',
  },

  // ==========================================
  // GROUP 7: Chataf (compound/reduced vowels)
  // ==========================================
  {
    id: 'chataf_patach',
    hebrew: 'ֲ',
    name: 'Chataf Patach',
    sound: 'AH (quick)',
    soundGroup: 'chataf',
    color: VOWEL_COLORS.chataf,
    transliteration: 'a',
    audioUrl: '/audio/vowels/chataf_patach.mp3',
    description: 'Shva + Patach combined. A quick "AH" sound, usually under guttural letters (א, ה, ח, ע).',
  },
  {
    id: 'chataf_segol',
    hebrew: 'ֱ',
    name: 'Chataf Segol',
    sound: 'EH (quick)',
    soundGroup: 'chataf',
    color: VOWEL_COLORS.chataf,
    transliteration: 'e',
    audioUrl: '/audio/vowels/chataf_segol.mp3',
    description: 'Shva + Segol combined. A quick "EH" sound, under guttural letters.',
  },
  {
    id: 'chataf_kamatz',
    hebrew: 'ֳ',
    name: 'Chataf Kamatz',
    sound: 'OH (quick)',
    soundGroup: 'chataf',
    color: VOWEL_COLORS.chataf,
    transliteration: 'o',
    audioUrl: '/audio/vowels/chataf_kamatz.mp3',
    description: 'Shva + Kamatz combined. A quick "OH" sound, under guttural letters.',
  },
];

// Helpers
export const CORE_VOWELS = VOWELS.filter(v => v.soundGroup !== 'chataf');
export const CHATAF_VOWELS = VOWELS.filter(v => v.soundGroup === 'chataf');

export function getVowelById(id: string): Vowel | undefined {
  return VOWELS.find(v => v.id === id);
}

export function getVowelsByGroup(group: Vowel['soundGroup']): Vowel[] {
  return VOWELS.filter(v => v.soundGroup === group);
}
