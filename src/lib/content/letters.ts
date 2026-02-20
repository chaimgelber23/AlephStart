import { Letter } from '@/types';

/**
 * Hebrew letters in RESEARCH-BACKED teaching order:
 * Phase 1: Visually distinct letters (easy to tell apart)
 * Phase 2: Confusable pairs (taught together with mnemonics)
 * Phase 3: Final forms (sofit letters)
 *
 * Each letter includes audio URL placeholder — replace with actual audio files.
 */

export const LETTERS: Letter[] = [
  // ==========================================
  // PHASE 1: VISUALLY DISTINCT LETTERS
  // Batch 1 (Lesson 1)
  // ==========================================
  {
    id: 'shin',
    hebrew: 'שׁ',
    name: 'Shin',
    sound: 'SH',
    transliteration: 'sh',
    mnemonic: 'Shin has three prongs like a crown — SH for "SHiny crown"',
    audioUrl: '/audio/letters/shin.mp3',
    isFinalForm: false,
  },
  {
    id: 'lamed',
    hebrew: 'ל',
    name: 'Lamed',
    sound: 'L',
    transliteration: 'l',
    mnemonic: 'Lamed is the tallest letter — it Leaps above the rest',
    audioUrl: '/audio/letters/lamed.mp3',
    isFinalForm: false,
  },
  {
    id: 'aleph',
    hebrew: 'א',
    name: 'Aleph',
    sound: '(silent)',
    transliteration: '',
    mnemonic: 'Aleph is silent — it carries the vowel sound. Think of it as a chair for the vowel to sit on.',
    audioUrl: '/audio/letters/aleph.mp3',
    isFinalForm: false,
  },

  // Batch 2 (Lesson 2)
  {
    id: 'mem',
    hebrew: 'מ',
    name: 'Mem',
    sound: 'M',
    transliteration: 'm',
    mnemonic: 'Mem looks like a wave of water — M for "Mayim" (water)',
    audioUrl: '/audio/letters/mem.mp3',
    isFinalForm: false,
  },
  {
    id: 'ayin',
    hebrew: 'ע',
    name: 'Ayin',
    sound: '(silent/guttural)',
    transliteration: '',
    mnemonic: 'Ayin means "eye" — it sees but makes no sound (in modern Hebrew)',
    audioUrl: '/audio/letters/ayin.mp3',
    isFinalForm: false,
  },
  {
    id: 'tav',
    hebrew: 'ת',
    name: 'Tav',
    sound: 'T',
    transliteration: 't',
    mnemonic: 'Tav is the last letter — T for "The end"',
    audioUrl: '/audio/letters/tav.mp3',
    isFinalForm: false,
  },

  // Batch 3 (Lesson 3)
  {
    id: 'yud',
    hebrew: 'י',
    name: 'Yud',
    sound: 'Y',
    transliteration: 'y',
    mnemonic: 'Yud is the smallest letter — a tiny dot with a tail. Small but mighty!',
    audioUrl: '/audio/letters/yud.mp3',
    isFinalForm: false,
  },
  {
    id: 'vav',
    hebrew: 'ו',
    name: 'Vav',
    sound: 'V',
    transliteration: 'v',
    mnemonic: 'Vav is a straight vertical line — like a hook (Vav means "hook")',
    audioUrl: '/audio/letters/vav.mp3',
    isFinalForm: false,
  },
  {
    id: 'samech',
    hebrew: 'ס',
    name: 'Samech',
    sound: 'S',
    transliteration: 's',
    mnemonic: 'Samech is a closed circle — S for "Sealed shut"',
    audioUrl: '/audio/letters/samech.mp3',
    isFinalForm: false,
  },

  // Batch 4 (Lesson 4)
  {
    id: 'nun',
    hebrew: 'נ',
    name: 'Nun',
    sound: 'N',
    transliteration: 'n',
    mnemonic: 'Nun is like a small chair — N for "Nice seat"',
    audioUrl: '/audio/letters/nun.mp3',
    isFinalForm: false,
  },
  {
    id: 'gimel',
    hebrew: 'ג',
    name: 'Gimel',
    sound: 'G',
    transliteration: 'g',
    mnemonic: 'Gimel has a foot kicking forward — G for "Going places"',
    audioUrl: '/audio/letters/gimel.mp3',
    isFinalForm: false,
  },

  // Batch 5 (Lesson 5)
  {
    id: 'kuf',
    hebrew: 'ק',
    name: 'Kuf',
    sound: 'K',
    transliteration: 'k',
    mnemonic: 'Kuf has a long leg that drops below — unique and distinctive',
    audioUrl: '/audio/letters/kuf.mp3',
    isFinalForm: false,
  },

  // ==========================================
  // PHASE 2: CONFUSABLE PAIRS
  // Each pair taught together with "spot the difference" drills
  // ==========================================

  // Pair 1: Bet vs Kaf (Lesson 6)
  {
    id: 'bet',
    hebrew: 'בּ',
    name: 'Bet',
    sound: 'B',
    transliteration: 'b',
    mnemonic: 'Bet has a Boxy square corner at the bottom right',
    confusableWith: 'kaf',
    confusableHint: 'Bet = Boxy corner. Kaf = curved/rounded.',
    audioUrl: '/audio/letters/bet.mp3',
    isFinalForm: false,
    hasDagesh: true,
    dageshSound: 'B',
  },
  {
    id: 'vet',
    hebrew: 'ב',
    name: 'Vet',
    sound: 'V',
    transliteration: 'v',
    mnemonic: 'Vet is Bet without the dot — V instead of B',
    confusableWith: 'chaf',
    audioUrl: '/audio/letters/vet.mp3',
    isFinalForm: false,
    hasDagesh: false,
  },
  {
    id: 'kaf',
    hebrew: 'כּ',
    name: 'Kaf',
    sound: 'K',
    transliteration: 'k',
    mnemonic: 'Kaf is curved and soft — no sharp corners',
    confusableWith: 'bet',
    confusableHint: 'Kaf = curved. Bet = Boxy corner.',
    audioUrl: '/audio/letters/kaf.mp3',
    isFinalForm: false,
    hasDagesh: true,
    dageshSound: 'K',
  },
  {
    id: 'chaf',
    hebrew: 'כ',
    name: 'Chaf',
    sound: 'CH',
    transliteration: 'ch',
    mnemonic: 'Chaf is Kaf without the dot — the guttural CH sound',
    confusableWith: 'vet',
    audioUrl: '/audio/letters/chaf.mp3',
    isFinalForm: false,
    hasDagesh: false,
  },

  // Pair 2: Dalet vs Resh (Lesson 7)
  {
    id: 'dalet',
    hebrew: 'ד',
    name: 'Dalet',
    sound: 'D',
    transliteration: 'd',
    mnemonic: 'Dalet has a Diving-board edge poking out at the top right',
    confusableWith: 'resh',
    confusableHint: 'Dalet = sharp corner (Diving board). Resh = Rounded and smooth.',
    audioUrl: '/audio/letters/dalet.mp3',
    isFinalForm: false,
  },
  {
    id: 'resh',
    hebrew: 'ר',
    name: 'Resh',
    sound: 'R',
    transliteration: 'r',
    mnemonic: 'Resh is Rounded — smooth curve, no sharp edges',
    confusableWith: 'dalet',
    confusableHint: 'Resh = Rounded. Dalet = Diving-board corner.',
    audioUrl: '/audio/letters/resh.mp3',
    isFinalForm: false,
  },

  // Pair 3: Hei vs Chet (Lesson 8)
  {
    id: 'hei',
    hebrew: 'ה',
    name: 'Hei',
    sound: 'H',
    transliteration: 'h',
    mnemonic: 'Hei has a gap at the top left — air escapes, like a breath "H"',
    confusableWith: 'chet',
    confusableHint: 'Hei = Has a gap (air escapes). Chet = Clamped shut.',
    audioUrl: '/audio/letters/hei.mp3',
    isFinalForm: false,
  },
  {
    id: 'chet',
    hebrew: 'ח',
    name: 'Chet',
    sound: 'CH',
    transliteration: 'ch',
    mnemonic: 'Chet is Clamped shut — no gap at the top',
    confusableWith: 'hei',
    confusableHint: 'Chet = Clamped shut. Hei = Has a gap.',
    audioUrl: '/audio/letters/chet.mp3',
    isFinalForm: false,
  },

  // Pair 4: Tet and remaining (Lesson 9)
  {
    id: 'tet',
    hebrew: 'ט',
    name: 'Tet',
    sound: 'T',
    transliteration: 't',
    mnemonic: 'Tet curls inward like a basket — T for "Tucked in"',
    audioUrl: '/audio/letters/tet.mp3',
    isFinalForm: false,
  },

  // Pair 5: Pei/Fei and Tzadi (Lesson 10)
  {
    id: 'pei',
    hebrew: 'פּ',
    name: 'Pei',
    sound: 'P',
    transliteration: 'p',
    mnemonic: 'Pei has a dot — P for "Point inside"',
    audioUrl: '/audio/letters/pei.mp3',
    isFinalForm: false,
    hasDagesh: true,
    dageshSound: 'P',
  },
  {
    id: 'fei',
    hebrew: 'פ',
    name: 'Fei',
    sound: 'F',
    transliteration: 'f',
    mnemonic: 'Fei is Pei without the dot — F for "Free of the dot"',
    audioUrl: '/audio/letters/fei.mp3',
    isFinalForm: false,
    hasDagesh: false,
  },
  {
    id: 'tzadi',
    hebrew: 'צ',
    name: 'Tzadi',
    sound: 'TZ',
    transliteration: 'tz',
    mnemonic: 'Tzadi has a tail reaching up on the right side',
    audioUrl: '/audio/letters/tzadi.mp3',
    isFinalForm: false,
  },

  // Pair 6: Zayin (compare to known Vav) (Lesson 10)
  {
    id: 'zayin',
    hebrew: 'ז',
    name: 'Zayin',
    sound: 'Z',
    transliteration: 'z',
    mnemonic: 'Zayin has a Zigzag crown on top (Vav is flat)',
    confusableWith: 'vav',
    confusableHint: 'Zayin = Zigzag crown. Vav = flat top.',
    audioUrl: '/audio/letters/zayin.mp3',
    isFinalForm: false,
  },

  // Sin (variant of Shin) (Lesson 10)
  {
    id: 'sin',
    hebrew: 'שׂ',
    name: 'Sin',
    sound: 'S',
    transliteration: 's',
    mnemonic: 'Sin is Shin\'s twin — the dot is on the LEFT for "S" (Left = Sin)',
    audioUrl: '/audio/letters/sin.mp3',
    isFinalForm: false,
  },

  // ==========================================
  // PHASE 3: FINAL FORMS (SOFIT)
  // Lesson 11
  // ==========================================
  {
    id: 'chaf_sofit',
    hebrew: 'ך',
    name: 'Chaf Sofit',
    sound: 'CH',
    transliteration: 'ch',
    mnemonic: 'Chaf stretches down at the end of a word',
    audioUrl: '/audio/letters/chaf_sofit.mp3',
    isFinalForm: true,
    baseLetterOf: 'chaf',
  },
  {
    id: 'mem_sofit',
    hebrew: 'ם',
    name: 'Mem Sofit',
    sound: 'M',
    transliteration: 'm',
    mnemonic: 'Mem closes completely — sealed at the end of a word',
    audioUrl: '/audio/letters/mem_sofit.mp3',
    isFinalForm: true,
    baseLetterOf: 'mem',
  },
  {
    id: 'nun_sofit',
    hebrew: 'ן',
    name: 'Nun Sofit',
    sound: 'N',
    transliteration: 'n',
    mnemonic: 'Nun drops below the line at the end of a word',
    audioUrl: '/audio/letters/nun_sofit.mp3',
    isFinalForm: true,
    baseLetterOf: 'nun',
  },
  {
    id: 'fei_sofit',
    hebrew: 'ף',
    name: 'Fei Sofit',
    sound: 'F',
    transliteration: 'f',
    mnemonic: 'Fei drops below the line at the end of a word',
    audioUrl: '/audio/letters/fei_sofit.mp3',
    isFinalForm: true,
    baseLetterOf: 'fei',
  },
  {
    id: 'tzadi_sofit',
    hebrew: 'ץ',
    name: 'Tzadi Sofit',
    sound: 'TZ',
    transliteration: 'tz',
    mnemonic: 'Tzadi straightens up at the end of a word',
    audioUrl: '/audio/letters/tzadi_sofit.mp3',
    isFinalForm: true,
    baseLetterOf: 'tzadi',
  },
];

// Helper: get letters by phase
export const PHASE_1_LETTERS = LETTERS.filter(
  l => !l.isFinalForm && !l.confusableWith && l.id !== 'sin'
);
export const PHASE_2_LETTERS = LETTERS.filter(
  l => !l.isFinalForm && (l.confusableWith || l.id === 'tet' || l.id === 'sin')
);
export const PHASE_3_LETTERS = LETTERS.filter(l => l.isFinalForm);

// Helper: get confusable pairs
export const CONFUSABLE_PAIRS = [
  { a: 'bet', b: 'kaf', hint: 'Bet = Boxy corner. Kaf = curved.' },
  { a: 'dalet', b: 'resh', hint: 'Dalet = Diving-board edge. Resh = Rounded.' },
  { a: 'hei', b: 'chet', hint: 'Hei = Has a gap. Chet = Clamped shut.' },
  { a: 'vav', b: 'zayin', hint: 'Vav = flat top. Zayin = Zigzag crown.' },
  { a: 'vet', b: 'chaf', hint: 'Same shape! Check the context.' },
  { a: 'pei', b: 'fei', hint: 'Pei has a dot (Point). Fei is Free of the dot.' },
];

export function getLetterById(id: string): Letter | undefined {
  return LETTERS.find(l => l.id === id);
}
