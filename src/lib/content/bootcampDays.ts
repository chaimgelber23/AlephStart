import { BootcampDay } from '@/types';
import { VOWEL_COLORS } from './vowels';

/**
 * Hebrew Reading Bootcamp — 5-Day Curriculum
 *
 * Pedagogical principles (inspired by NJOP, all original content):
 * 1. Vowels from Day 1 — students read real syllables and words immediately
 * 2. Twin letters taught as explicit pairs (Bet/Vet, Kaf/Chaf, Pei/Fei, Shin/Sin)
 * 3. Cultural mnemonics connecting each letter to a Jewish concept
 * 4. Progressive complexity: letters → syllables → words → phrases → prayers
 * 5. Intensive pacing: all 22 letters + vowels in 5 sessions
 * 6. Prayer words used as reading practice from the start
 */

export const BOOTCAMP_DAYS: BootcampDay[] = [
  // ==========================================
  // DAY 1: "First Sounds"
  // Letters: Shin, Lamed, Mem, Aleph, Tav (5 letters)
  // Vowels: Kamatz (AH), Patach (AH)
  // Goal: Read real syllables and 5+ real words
  // ==========================================
  {
    day: 1,
    title: 'First Sounds',
    subtitle: 'Your first letters, vowels, and real Hebrew words',
    estimatedMinutes: 18,
    letterGroups: [
      {
        letterIds: ['shin', 'lamed', 'mem', 'aleph', 'tav'],
        culturalMnemonics: {
          shin: 'The letter on every mezuzah and on tefillin. Shin stands for one of G-d\'s names — "Shaddai."',
          lamed: 'The tallest letter in the aleph-bet. Lamed stands for "lev" (heart) and "limud" (learning) — learning with heart.',
          mem: '"Mayim" — water, the source of all life. The Torah itself is compared to water.',
          aleph: 'The first letter — yet it\'s silent. G-d spoke and creation began, but the Aleph waited quietly. Humility comes first.',
          tav: 'The last letter — from Aleph to Tav means "everything." Together they encompass all of creation.',
        },
      },
    ],
    vowelGroups: [
      {
        vowelIds: ['kamatz', 'patach'],
        soundLabel: 'AH',
        color: VOWEL_COLORS.ah,
        teachingNote: 'The "AH" twins — the most common vowel sound in Hebrew. Kamatz has a T-shape, Patach is a flat line. Both sound the same!',
      },
    ],
    syllables: [
      { hebrew: 'שָׁ', transliteration: 'sha', letterId: 'shin', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/sha.mp3' },
      { hebrew: 'שַׁ', transliteration: 'sha', letterId: 'shin', vowelId: 'patach', audioUrl: '/audio/bootcamp/syllables/sha2.mp3' },
      { hebrew: 'לָ', transliteration: 'la', letterId: 'lamed', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/la.mp3' },
      { hebrew: 'לַ', transliteration: 'la', letterId: 'lamed', vowelId: 'patach', audioUrl: '/audio/bootcamp/syllables/la2.mp3' },
      { hebrew: 'מָ', transliteration: 'ma', letterId: 'mem', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ma.mp3' },
      { hebrew: 'מַ', transliteration: 'ma', letterId: 'mem', vowelId: 'patach', audioUrl: '/audio/bootcamp/syllables/ma2.mp3' },
      { hebrew: 'אָ', transliteration: 'a', letterId: 'aleph', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/a.mp3' },
      { hebrew: 'תָּ', transliteration: 'ta', letterId: 'tav', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ta.mp3' },
      { hebrew: 'תַּ', transliteration: 'ta', letterId: 'tav', vowelId: 'patach', audioUrl: '/audio/bootcamp/syllables/ta2.mp3' },
    ],
    vocabWordIds: ['vocab_shalom', 'vocab_atah', 'vocab_emet'],
    practiceWords: [
      { hebrew: 'שָׁם', transliteration: 'sham', translation: 'there', audioUrl: '/audio/bootcamp/words/sham.mp3' },
      { hebrew: 'מָה', transliteration: 'mah', translation: 'what', audioUrl: '/audio/bootcamp/words/mah.mp3' },
      { hebrew: 'אָם', transliteration: 'am', translation: 'mother', audioUrl: '/audio/bootcamp/words/am.mp3' },
      { hebrew: 'שָׁלַם', transliteration: 'shalam', translation: 'complete / whole', audioUrl: '/audio/bootcamp/words/shalam.mp3' },
      { hebrew: 'אַתָּה', transliteration: 'atah', translation: 'You', audioUrl: '/audio/bootcamp/words/atah.mp3', source: 'Bracha formula' },
    ],
    culminatingReading: {
      title: 'Your First Bracha Words',
      description: 'You can already read words from the bracha formula — words Jews have been saying for thousands of years.',
      lines: [
        {
          hebrew: 'אַתָּה',
          transliteration: 'atah',
          translation: 'You (addressing G-d)',
          audioUrl: '/audio/bootcamp/readings/day1_atah.mp3',
        },
      ],
    },
  },

  // ==========================================
  // DAY 2: "Building Blocks"
  // Letters: Bet/Vet (twin!), Resh, Yud, Nun, Vav (6 letters)
  // Vowels: Segol (EH), Tzere (EH), Chirik (EE)
  // Goal: Read bracha formula, 10+ new words
  // ==========================================
  {
    day: 2,
    title: 'Building Blocks',
    subtitle: 'Your first twin letters, new vowels, and the bracha formula',
    estimatedMinutes: 18,
    reviewLetterIds: ['shin', 'lamed', 'mem', 'aleph', 'tav'],
    reviewVowelIds: ['kamatz', 'patach'],
    letterGroups: [
      {
        letterIds: ['bet', 'vet'],
        twinPair: {
          withDagesh: 'bet',
          withoutDagesh: 'vet',
          hint: 'The dot gives it a punch — B! Without the dot, it\'s soft — V. Think: "dot = strong."',
        },
        culturalMnemonics: {
          bet: 'The first letter of the Torah: "Bereishit" (In the beginning). The Torah starts with Bet, not Aleph — a mystery the sages contemplate.',
          vet: 'Without its dot, Bet becomes Vet — same shape, softer sound. Like how kindness (chesed) softens strength (gevurah).',
        },
      },
      {
        letterIds: ['resh', 'yud', 'nun', 'vav'],
        culturalMnemonics: {
          resh: '"Rosh" — head. As in Rosh Hashana (Head of the Year). Resh leads, like a head leads the body.',
          yud: 'The smallest letter, yet it\'s the first letter of G-d\'s four-letter Name. Small but infinitely powerful.',
          nun: '"Neshama" — soul. Every person carries a divine spark, a piece of the infinite.',
          vav: 'The "hook" letter — Vav literally means "hook." It connects words in Torah, just as we connect to each other.',
        },
      },
    ],
    vowelGroups: [
      {
        vowelIds: ['segol', 'tzere'],
        soundLabel: 'EH',
        color: VOWEL_COLORS.eh,
        teachingNote: 'The "EH" pair — Segol has three dots in a triangle, Tzere has two dots side by side. Both sound like "EH" (as in "bed").',
      },
      {
        vowelIds: ['chirik'],
        soundLabel: 'EE',
        color: VOWEL_COLORS.ee,
        teachingNote: 'Just one dot under the letter — the simplest vowel! Makes the "EE" sound (as in "see").',
      },
    ],
    syllables: [
      { hebrew: 'בָּ', transliteration: 'ba', letterId: 'bet', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ba.mp3' },
      { hebrew: 'בִּ', transliteration: 'bi', letterId: 'bet', vowelId: 'chirik', audioUrl: '/audio/bootcamp/syllables/bi.mp3' },
      { hebrew: 'רָ', transliteration: 'ra', letterId: 'resh', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ra.mp3' },
      { hebrew: 'רֶ', transliteration: 're', letterId: 'resh', vowelId: 'segol', audioUrl: '/audio/bootcamp/syllables/re.mp3' },
      { hebrew: 'יָ', transliteration: 'ya', letterId: 'yud', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ya.mp3' },
      { hebrew: 'נָ', transliteration: 'na', letterId: 'nun', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/na.mp3' },
      { hebrew: 'נֵ', transliteration: 'nei', letterId: 'nun', vowelId: 'tzere', audioUrl: '/audio/bootcamp/syllables/nei.mp3' },
      { hebrew: 'בֵּ', transliteration: 'bei', letterId: 'bet', vowelId: 'tzere', audioUrl: '/audio/bootcamp/syllables/bei.mp3' },
    ],
    vocabWordIds: ['vocab_baruch', 'vocab_amen', 'vocab_shabbat', 'vocab_ner', 'vocab_bayit', 'vocab_mayim'],
    practiceWords: [
      { hebrew: 'בָּרוּךְ', transliteration: 'baruch', translation: 'blessed', audioUrl: '/audio/bootcamp/words/baruch.mp3', source: 'Bracha formula' },
      { hebrew: 'אָמֵן', transliteration: 'amen', translation: 'so be it', audioUrl: '/audio/bootcamp/words/amen.mp3' },
      { hebrew: 'בֵּן', transliteration: 'ben', translation: 'son', audioUrl: '/audio/bootcamp/words/ben.mp3' },
      { hebrew: 'בַּת', transliteration: 'bat', translation: 'daughter', audioUrl: '/audio/bootcamp/words/bat.mp3' },
      { hebrew: 'רַב', transliteration: 'rav', translation: 'rabbi / great', audioUrl: '/audio/bootcamp/words/rav.mp3' },
      { hebrew: 'נֵר', transliteration: 'ner', translation: 'candle', audioUrl: '/audio/bootcamp/words/ner.mp3' },
      { hebrew: 'לֵב', transliteration: 'lev', translation: 'heart', audioUrl: '/audio/bootcamp/words/lev.mp3' },
      { hebrew: 'שַׁבָּת', transliteration: 'shabbat', translation: 'Sabbath', audioUrl: '/audio/bootcamp/words/shabbat.mp3' },
    ],
    culminatingReading: {
      title: 'The Bracha Formula',
      description: 'Every bracha in Judaism begins with these words. You can now read the opening of a bracha!',
      lines: [
        {
          hebrew: 'בָּרוּךְ אַתָּה',
          transliteration: 'baruch atah',
          translation: 'Blessed are You',
          audioUrl: '/audio/bootcamp/readings/day2_baruch_atah.mp3',
        },
      ],
    },
  },

  // ==========================================
  // DAY 3: "Unlocking Words"
  // Letters: Kaf/Chaf (twin!), Dalet, Hei, Chet, Ayin (6 letters)
  // Vowels: Cholam (OH), Cholam Vav (OH), Kubutz (OO), Shuruk (OO)
  // Goal: Read complete bracha formula
  // ==========================================
  {
    day: 3,
    title: 'Unlocking Words',
    subtitle: 'Twin letters, new vowels, and the complete bracha formula',
    estimatedMinutes: 20,
    reviewLetterIds: ['shin', 'lamed', 'mem', 'aleph', 'tav', 'bet', 'resh', 'yud', 'nun', 'vav'],
    reviewVowelIds: ['kamatz', 'patach', 'segol', 'tzere', 'chirik'],
    letterGroups: [
      {
        letterIds: ['kaf', 'chaf'],
        twinPair: {
          withDagesh: 'kaf',
          withoutDagesh: 'chaf',
          hint: 'Same pattern as Bet/Vet: dot = hard K sound, no dot = guttural CH. Also watch out: Kaf and Bet look similar — Kaf is curved, Bet has a boxy corner.',
        },
        culturalMnemonics: {
          kaf: '"Keter" — crown, the highest level. The letter Kaf is shaped like a cupped palm (kaf also means palm).',
          chaf: 'Without the dot, the king\'s crown becomes a humble palm — strength softened to openness.',
        },
      },
      {
        letterIds: ['dalet', 'hei', 'chet', 'ayin'],
        culturalMnemonics: {
          dalet: '"Delet" — door. Every letter you learn opens another door to understanding.',
          hei: 'The letter Hashem added to Avram\'s name to make "Avraham." A tiny letter that changed everything.',
          chet: '"Chayim" — life! L\'chayim! The first letter of the most celebrated word in Judaism.',
          ayin: 'Means "eye." To see the world through Jewish eyes — with gratitude, wonder, and justice.',
        },
      },
    ],
    vowelGroups: [
      {
        vowelIds: ['cholam', 'cholam_vav'],
        soundLabel: 'OH',
        color: VOWEL_COLORS.oh,
        teachingNote: 'The "OH" family — a dot above the letter (Cholam) or a Vav with a dot on top (Cholam Vav). Both say "OH" as in "go."',
      },
      {
        vowelIds: ['kubutz', 'shuruk'],
        soundLabel: 'OO',
        color: VOWEL_COLORS.oo,
        teachingNote: 'The "OO" family — three diagonal dots (Kubutz) or a Vav with a dot in its middle (Shuruk). Both say "OO" as in "blue."',
      },
    ],
    syllables: [
      { hebrew: 'כָּ', transliteration: 'ka', letterId: 'kaf', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ka.mp3' },
      { hebrew: 'כֹ', transliteration: 'cho', letterId: 'chaf', vowelId: 'cholam', audioUrl: '/audio/bootcamp/syllables/cho.mp3' },
      { hebrew: 'דָ', transliteration: 'da', letterId: 'dalet', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/da.mp3' },
      { hebrew: 'הָ', transliteration: 'ha', letterId: 'hei', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ha.mp3' },
      { hebrew: 'הוֹ', transliteration: 'ho', letterId: 'hei', vowelId: 'cholam_vav', audioUrl: '/audio/bootcamp/syllables/ho.mp3' },
      { hebrew: 'חָ', transliteration: 'cha', letterId: 'chet', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/cha.mp3' },
      { hebrew: 'עוֹ', transliteration: 'o', letterId: 'ayin', vowelId: 'cholam_vav', audioUrl: '/audio/bootcamp/syllables/o.mp3' },
      { hebrew: 'לוּ', transliteration: 'lu', letterId: 'lamed', vowelId: 'shuruk', audioUrl: '/audio/bootcamp/syllables/lu.mp3' },
    ],
    vocabWordIds: ['vocab_melech', 'vocab_haolam', 'vocab_borei', 'vocab_lechem', 'vocab_challah', 'vocab_lechayim', 'vocab_echad', 'vocab_todah', 'vocab_modeh', 'vocab_chai', 'vocab_derech'],
    practiceWords: [
      { hebrew: 'מֶלֶךְ', transliteration: 'melech', translation: 'king', audioUrl: '/audio/bootcamp/words/melech.mp3', source: 'Bracha formula' },
      { hebrew: 'הָעוֹלָם', transliteration: "ha'olam", translation: 'the world', audioUrl: '/audio/bootcamp/words/haolam.mp3', source: 'Bracha formula' },
      { hebrew: 'כֹּל', transliteration: 'kol', translation: 'all / every', audioUrl: '/audio/bootcamp/words/kol.mp3' },
      { hebrew: 'חַי', transliteration: 'chai', translation: 'life', audioUrl: '/audio/bootcamp/words/chai.mp3' },
      { hebrew: 'אֶחָד', transliteration: 'echad', translation: 'one', audioUrl: '/audio/bootcamp/words/echad.mp3', source: 'Shema' },
      { hebrew: 'דָּוִד', transliteration: 'david', translation: 'David', audioUrl: '/audio/bootcamp/words/david.mp3' },
      { hebrew: 'עוֹלָם', transliteration: 'olam', translation: 'world / eternity', audioUrl: '/audio/bootcamp/words/olam.mp3' },
      { hebrew: 'חָכָם', transliteration: 'chacham', translation: 'wise', audioUrl: '/audio/bootcamp/words/chacham.mp3' },
    ],
    culminatingReading: {
      title: 'The Complete Bracha Formula',
      description: 'This is the opening of every bracha in Judaism. You just read it. Let that sink in.',
      lines: [
        {
          hebrew: 'בָּרוּךְ אַתָּה',
          transliteration: 'baruch atah',
          translation: 'Blessed are You,',
          audioUrl: '/audio/bootcamp/readings/day3_line1.mp3',
        },
        {
          hebrew: 'ה׳ אֱלֹקֵינוּ',
          transliteration: "Hashem Elokeinu",
          translation: 'Hashem our G-d,',
          audioUrl: '/audio/bootcamp/readings/day3_line2.mp3',
        },
        {
          hebrew: 'מֶלֶךְ הָעוֹלָם',
          transliteration: "melech ha'olam",
          translation: 'King of the universe',
          audioUrl: '/audio/bootcamp/readings/day3_line3.mp3',
        },
      ],
    },
  },

  // ==========================================
  // DAY 4: "The Full Aleph-Bet"
  // Letters: Pei/Fei (twin!), Shin/Sin (twin!), Gimel, Samech, Tet,
  //          Tzadi, Zayin, Kuf + 5 sofit forms (13 new letter forms)
  // Vowels: Shva
  // Goal: Know every letter. Read Modeh Ani.
  // ==========================================
  {
    day: 4,
    title: 'The Full Aleph-Bet',
    subtitle: 'Every remaining letter, final forms, and your first complete prayer',
    estimatedMinutes: 20,
    reviewLetterIds: ['shin', 'bet', 'vet', 'kaf', 'chaf', 'hei', 'chet', 'dalet'],
    reviewVowelIds: ['kamatz', 'segol', 'chirik', 'cholam', 'shuruk'],
    letterGroups: [
      {
        letterIds: ['pei', 'fei'],
        twinPair: {
          withDagesh: 'pei',
          withoutDagesh: 'fei',
          hint: 'Same rule: dot = hard P, no dot = soft F. Remember: "Point inside = P."',
        },
        culturalMnemonics: {
          pei: '"Peh" — mouth. Through our mouths we pray, bless, and speak words of Torah.',
          fei: 'Without the dot, the mouth softens. A reminder: the same mouth can build or destroy — choose wisely.',
        },
      },
      {
        letterIds: ['sin'],
        twinPair: {
          withDagesh: 'shin',
          withoutDagesh: 'sin',
          hint: 'Same three prongs! Dot on the RIGHT = SH (Shin). Dot on the LEFT = S (Sin). Right = SH-in, Left = S-in.',
        },
        culturalMnemonics: {
          sin: 'Sin and Shin share a shape but differ in sound. One shape, two possibilities — like every moment holds potential for good.',
        },
      },
      {
        letterIds: ['gimel', 'samech', 'tet', 'tzadi', 'zayin', 'kuf'],
        culturalMnemonics: {
          gimel: '"Gemilut chasadim" — acts of lovingkindness. The Talmud says the world stands on three things, and chesed is one.',
          samech: 'A perfect circle — like G-d\'s protection surrounding us. "Somech noflim" — G-d supports those who fall.',
          tet: 'The first letter of "Tov" (good). It first appears in Torah when G-d saw the light and said "ki tov" — it is good.',
          tzadi: '"Tzaddik" — a righteous person. The letter itself looks like a person bending in prayer.',
          zayin: 'The spiritual "weapon" of Torah study. Also the number seven — Shabbat, the seventh day.',
          kuf: '"Kedusha" — holiness. To be holy means to be set apart for a higher purpose.',
        },
      },
      {
        letterIds: ['chaf_sofit', 'mem_sofit', 'nun_sofit', 'fei_sofit', 'tzadi_sofit'],
        culturalMnemonics: {
          chaf_sofit: 'Five letters change shape at the end of a word — they stretch out, like a person relaxing at the finish line.',
          mem_sofit: 'Open Mem becomes closed Mem Sofit. Some say it represents hidden wisdom — sealed until the end.',
          nun_sofit: 'Nun drops below the line — reaching deeper, like faith that extends beyond what we can see.',
          fei_sofit: 'Fei Sofit curves downward — the soft sound settling at the end of a word.',
          tzadi_sofit: 'Tzadi Sofit stands tall and straight — the righteous person at journey\'s end, upright and true.',
        },
      },
    ],
    vowelGroups: [
      {
        vowelIds: ['shva'],
        soundLabel: 'Shva',
        color: VOWEL_COLORS.shva,
        teachingNote: 'Two vertical dots. At the start of a word, it\'s a quick "uh." In the middle or end, it\'s usually silent. Don\'t overthink it — you\'ll get the feel naturally.',
      },
    ],
    syllables: [
      { hebrew: 'פָּ', transliteration: 'pa', letterId: 'pei', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/pa.mp3' },
      { hebrew: 'פֶ', transliteration: 'fe', letterId: 'fei', vowelId: 'segol', audioUrl: '/audio/bootcamp/syllables/fe.mp3' },
      { hebrew: 'שְׂ', transliteration: 's', letterId: 'sin', vowelId: 'shva', audioUrl: '/audio/bootcamp/syllables/s_shva.mp3' },
      { hebrew: 'גָּ', transliteration: 'ga', letterId: 'gimel', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ga.mp3' },
      { hebrew: 'סָ', transliteration: 'sa', letterId: 'samech', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/sa.mp3' },
      { hebrew: 'טָ', transliteration: 'ta', letterId: 'tet', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ta_tet.mp3' },
      { hebrew: 'צָ', transliteration: 'tza', letterId: 'tzadi', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/tza.mp3' },
      { hebrew: 'זָ', transliteration: 'za', letterId: 'zayin', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/za.mp3' },
      { hebrew: 'קָ', transliteration: 'ka', letterId: 'kuf', vowelId: 'kamatz', audioUrl: '/audio/bootcamp/syllables/ka_kuf.mp3' },
    ],
    vocabWordIds: [
      'vocab_shema', 'vocab_mitzvah', 'vocab_chesed', 'vocab_tzedek', 'vocab_kadosh', 'vocab_siddur',
      'vocab_pri', 'vocab_pesach', 'vocab_sukkah', 'vocab_purim', 'vocab_kiddush',
      'vocab_boker_tov', 'vocab_mazel_tov', 'vocab_bevakasha', 'vocab_havdalah', 'vocab_oneg',
      'vocab_sefer', 'vocab_eretz', 'vocab_yisrael',
    ],
    practiceWords: [
      { hebrew: 'שְׁמַע', transliteration: 'shma', translation: 'hear / listen', audioUrl: '/audio/bootcamp/words/shma.mp3', source: 'Shema' },
      { hebrew: 'צֶדֶק', transliteration: 'tzedek', translation: 'justice', audioUrl: '/audio/bootcamp/words/tzedek.mp3' },
      { hebrew: 'מִצְוָה', transliteration: 'mitzvah', translation: 'commandment', audioUrl: '/audio/bootcamp/words/mitzvah.mp3' },
      { hebrew: 'סִדּוּר', transliteration: 'siddur', translation: 'prayer book', audioUrl: '/audio/bootcamp/words/siddur.mp3' },
      { hebrew: 'קָדוֹשׁ', transliteration: 'kadosh', translation: 'holy', audioUrl: '/audio/bootcamp/words/kadosh.mp3' },
      { hebrew: 'גָּדוֹל', transliteration: 'gadol', translation: 'great', audioUrl: '/audio/bootcamp/words/gadol.mp3' },
      { hebrew: 'פֶּסַח', transliteration: 'pesach', translation: 'Passover', audioUrl: '/audio/bootcamp/words/pesach.mp3' },
      { hebrew: 'זְמַן', transliteration: 'zman', translation: 'time', audioUrl: '/audio/bootcamp/words/zman.mp3' },
    ],
    culminatingReading: {
      title: 'Modeh Ani — Your First Complete Prayer',
      description: 'The very first prayer a Jew says each morning, before even getting out of bed. You know every letter now — read the whole thing.',
      lines: [
        {
          hebrew: 'מוֹדֶה אֲנִי לְפָנֶיךָ',
          transliteration: 'modeh ani lefanecha',
          translation: 'I give thanks before You,',
          audioUrl: '/audio/bootcamp/readings/day4_line1.mp3',
        },
        {
          hebrew: 'מֶלֶךְ חַי וְקַיָּם',
          transliteration: 'melech chai v\'kayam',
          translation: 'living and enduring King,',
          audioUrl: '/audio/bootcamp/readings/day4_line2.mp3',
        },
        {
          hebrew: 'שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי',
          transliteration: "shehechezarta bi nishmati",
          translation: 'for You have returned my soul to me',
          audioUrl: '/audio/bootcamp/readings/day4_line3.mp3',
        },
        {
          hebrew: 'בְּחֶמְלָה, רַבָּה אֱמוּנָתֶךָ',
          transliteration: "b'chemlah, rabbah emunatecha",
          translation: 'with compassion — great is Your faithfulness',
          audioUrl: '/audio/bootcamp/readings/day4_line4.mp3',
        },
      ],
    },
  },

  // ==========================================
  // DAY 5: "Reading Fluency"
  // Letters: Review all. No new base letters.
  // Vowels: Chataf Patach, Chataf Segol, Chataf Kamatz
  // Goal: Read Shema, Hamotzi, build speed and confidence
  // ==========================================
  {
    day: 5,
    title: 'Reading Fluency',
    subtitle: 'Chataf vowels, speed drills, and reading real prayers',
    estimatedMinutes: 20,
    reviewLetterIds: [
      'shin', 'lamed', 'mem', 'aleph', 'tav',
      'bet', 'vet', 'resh', 'yud', 'nun', 'vav',
      'kaf', 'chaf', 'dalet', 'hei', 'chet', 'ayin',
      'pei', 'fei', 'sin', 'gimel', 'samech', 'tet', 'tzadi', 'zayin', 'kuf',
    ],
    reviewVowelIds: ['kamatz', 'patach', 'segol', 'tzere', 'chirik', 'cholam', 'kubutz', 'shva'],
    letterGroups: [],
    vowelGroups: [
      {
        vowelIds: ['chataf_patach', 'chataf_segol', 'chataf_kamatz'],
        soundLabel: 'Chataf',
        color: VOWEL_COLORS.chataf,
        teachingNote: 'Quick compound vowels — a Shva combined with a vowel you already know. They appear under guttural letters (Aleph, Hei, Chet, Ayin). Chataf Patach = quick "AH", Chataf Segol = quick "EH", Chataf Kamatz = quick "OH".',
      },
    ],
    syllables: [
      { hebrew: 'אֲ', transliteration: 'a', letterId: 'aleph', vowelId: 'chataf_patach', audioUrl: '/audio/bootcamp/syllables/a_chataf.mp3' },
      { hebrew: 'אֱ', transliteration: 'e', letterId: 'aleph', vowelId: 'chataf_segol', audioUrl: '/audio/bootcamp/syllables/e_chataf.mp3' },
      { hebrew: 'אֳ', transliteration: 'o', letterId: 'aleph', vowelId: 'chataf_kamatz', audioUrl: '/audio/bootcamp/syllables/o_chataf.mp3' },
      { hebrew: 'חֲ', transliteration: 'cha', letterId: 'chet', vowelId: 'chataf_patach', audioUrl: '/audio/bootcamp/syllables/cha_chataf.mp3' },
      { hebrew: 'עֲ', transliteration: 'a', letterId: 'ayin', vowelId: 'chataf_patach', audioUrl: '/audio/bootcamp/syllables/ayin_chataf.mp3' },
    ],
    vocabWordIds: [
      'vocab_adonai', 'vocab_torah', 'vocab_tefillah', 'vocab_halleluyah', 'vocab_neshama',
      'vocab_chanukah', 'vocab_mezuzah', 'vocab_bereishit', 'vocab_rosh_hashana', 'vocab_yom_kippur',
      'vocab_shavuot', 'vocab_simcha', 'vocab_brit', 'vocab_bar_mitzvah', 'vocab_chuppah',
    ],
    practiceWords: [
      { hebrew: 'אֲדֹנָי', transliteration: 'Adonai', translation: 'my Lord', audioUrl: '/audio/bootcamp/words/adonai.mp3' },
      { hebrew: 'תּוֹרָה', transliteration: 'Torah', translation: 'Torah', audioUrl: '/audio/bootcamp/words/torah.mp3' },
      { hebrew: 'תְּפִלָּה', transliteration: 'tefillah', translation: 'prayer', audioUrl: '/audio/bootcamp/words/tefillah.mp3' },
      { hebrew: 'נְשָׁמָה', transliteration: 'neshama', translation: 'soul', audioUrl: '/audio/bootcamp/words/neshama.mp3' },
      { hebrew: 'חֲנֻכָּה', transliteration: 'chanukah', translation: 'Chanukah', audioUrl: '/audio/bootcamp/words/chanukah.mp3' },
      { hebrew: 'מְזוּזָה', transliteration: 'mezuzah', translation: 'doorpost scroll', audioUrl: '/audio/bootcamp/words/mezuzah.mp3' },
      { hebrew: 'הַלְּלוּיָהּ', transliteration: 'halleluyah', translation: 'praise G-d', audioUrl: '/audio/bootcamp/words/halleluyah.mp3' },
      { hebrew: 'בְּרֵאשִׁית', transliteration: 'bereishit', translation: 'in the beginning', audioUrl: '/audio/bootcamp/words/bereishit.mp3' },
    ],
    culminatingReading: {
      title: 'Graduation Reading',
      description: 'You started with zero Hebrew. Now read the Shema — the most important declaration in Judaism — and the Hamotzi blessing.',
      lines: [
        {
          hebrew: 'שְׁמַע יִשְׂרָאֵל',
          transliteration: 'shma yisrael',
          translation: 'Hear, O Israel,',
          audioUrl: '/audio/bootcamp/readings/day5_shema1.mp3',
        },
        {
          hebrew: 'ה׳ אֱלֹקֵינוּ ה׳ אֶחָד',
          transliteration: 'Hashem Elokeinu Hashem echad',
          translation: 'Hashem is our G-d, Hashem is One',
          audioUrl: '/audio/bootcamp/readings/day5_shema2.mp3',
        },
        {
          hebrew: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
          transliteration: "baruch atah Hashem Elokeinu melech ha'olam",
          translation: 'Blessed are You, Hashem our G-d, King of the universe,',
          audioUrl: '/audio/bootcamp/readings/day5_hamotzi1.mp3',
        },
        {
          hebrew: 'הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ',
          transliteration: "hamotzi lechem min ha'aretz",
          translation: 'who brings forth bread from the earth',
          audioUrl: '/audio/bootcamp/readings/day5_hamotzi2.mp3',
        },
      ],
    },
  },
];

// Helpers
export function getBootcampDay(day: number): BootcampDay | undefined {
  return BOOTCAMP_DAYS.find(d => d.day === day);
}

/**
 * Get all unique letter IDs taught across bootcamp days up to (and including) the given day.
 */
export function getBootcampLettersThroughDay(day: number): string[] {
  const ids = new Set<string>();
  for (const d of BOOTCAMP_DAYS) {
    if (d.day > day) break;
    for (const group of d.letterGroups) {
      for (const id of group.letterIds) {
        ids.add(id);
      }
    }
  }
  return Array.from(ids);
}

/**
 * Get all unique vowel IDs taught across bootcamp days up to (and including) the given day.
 */
export function getBootcampVowelsThroughDay(day: number): string[] {
  const ids = new Set<string>();
  for (const d of BOOTCAMP_DAYS) {
    if (d.day > day) break;
    for (const group of d.vowelGroups) {
      for (const id of group.vowelIds) {
        ids.add(id);
      }
    }
  }
  return Array.from(ids);
}
