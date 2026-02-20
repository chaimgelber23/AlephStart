export interface StreakEncouragement {
  hebrew: string;
  english: string;
}

export interface DailyInspiration {
  hebrew: string;
  english: string;
  source: string;
}

// Short, warm messages for the streak banner.
// Use {name} as a placeholder — formatWithName() handles it.
export const STREAK_ENCOURAGEMENTS: StreakEncouragement[] = [
  {
    hebrew: 'כָּל הַתְחָלוֹת קָשׁוֹת',
    english: 'All beginnings are hard — but {name}, you are doing it!',
  },
  {
    hebrew: 'חֲזַק חֲזַק וְנִתְחַזֵּק',
    english: 'Be strong, be strong, and we will be strengthened!',
  },
  {
    hebrew: 'צַעַד אַחַר צַעַד',
    english: 'Step by step, {name}. Every letter matters.',
  },
  {
    hebrew: 'הַיּוֹם יוֹם חָדָשׁ',
    english: 'Today is a new day, {name}. Make it count!',
  },
  {
    hebrew: 'אַל תִּסְתַּכֵּל בַּקַּנְקַן',
    english: "Don't look at the container, but at what's inside.",
  },
  {
    hebrew: 'גַּם זוּ לְטוֹבָה',
    english: 'This too is for the good. Keep going, {name}!',
  },
  {
    hebrew: 'לֹא הַבַּיְשָׁן לָמֵד',
    english: 'The shy person does not learn — and you are here, {name}!',
  },
  {
    hebrew: 'אוֹר חָדָשׁ עַל צִיּוֹן תָּאִיר',
    english: 'A new light shines — you are growing every day.',
  },
  {
    hebrew: 'הַמַּתְחִיל בְּמִצְוָה אוֹמְרִים לוֹ גְּמֹר',
    english: 'One who begins a good deed is told: finish it!',
  },
  {
    hebrew: 'יָגַעְתָּ וּמָצָאתָ תַּאֲמִין',
    english: 'If you toiled and found success — believe it, {name}!',
  },
  {
    hebrew: 'דַּע מֵאַיִן בָּאתָ וּלְאָן אַתָּה הוֹלֵךְ',
    english: 'Know where you came from and where you are going.',
  },
  {
    hebrew: 'טוֹב אַחֲרִית דָּבָר מֵרֵאשִׁיתוֹ',
    english: 'The end of a matter is better than its beginning.',
  },
  {
    hebrew: 'מַיִם רַבִּים לֹא יוּכְלוּ לְכַבּוֹת אֶת הָאַהֲבָה',
    english: 'Many waters cannot extinguish love — your dedication is beautiful, {name}.',
  },
  {
    hebrew: 'רֵאשִׁית חָכְמָה קְנֵה חָכְמָה',
    english: 'The beginning of wisdom is: acquire wisdom!',
  },
  {
    hebrew: 'עֵת לַעֲשׂוֹת',
    english: 'It is time to act. {name}, you are making it happen!',
  },
];

// Longer contemplative quotes for the Daily Inspiration section.
export const DAILY_INSPIRATIONS: DailyInspiration[] = [
  {
    hebrew: 'לֹא עָלֶיךָ הַמְּלָאכָה לִגְמֹר וְלֹא אַתָּה בֶן חוֹרִין לְהִבָּטֵל מִמֶּנָּה',
    english: 'You are not required to finish the work, but neither are you free to stop trying.',
    source: 'Pirkei Avot 2:16',
  },
  {
    hebrew: 'אִם אֵין אֲנִי לִי מִי לִי וּכְשֶׁאֲנִי לְעַצְמִי מָה אֲנִי וְאִם לֹא עַכְשָׁיו אֵימָתַי',
    english: 'If I am not for myself, who will be for me? And if I am only for myself, what am I? And if not now, when?',
    source: 'Pirkei Avot 1:14',
  },
  {
    hebrew: 'אֵיזֶהוּ חָכָם הַלּוֹמֵד מִכָּל אָדָם',
    english: 'Who is wise? One who learns from every person.',
    source: 'Pirkei Avot 4:1',
  },
  {
    hebrew: 'הַפֹּךְ בָּהּ וַהֲפֹךְ בָּהּ דְּכֹלָּא בָהּ',
    english: 'Turn it over and turn it over, for everything is in it.',
    source: 'Pirkei Avot 5:22',
  },
  {
    hebrew: 'בִּמְקוֹם שֶׁאֵין אֲנָשִׁים הִשְׁתַּדֵּל לִהְיוֹת אִישׁ',
    english: 'In a place where there are no leaders, strive to be one.',
    source: 'Pirkei Avot 2:5',
  },
  {
    hebrew: 'יָפָה שָׁעָה אַחַת שֶׁל תְּשׁוּבָה וּמַעֲשִׂים טוֹבִים בָּעוֹלָם הַזֶּה מִכָּל חַיֵּי הָעוֹלָם הַבָּא',
    english: 'One hour of repentance and good deeds in this world is worth more than all of the World to Come.',
    source: 'Pirkei Avot 4:17',
  },
  {
    hebrew: 'אַל תִּסְתַּכֵּל בַּקַּנְקַן אֶלָּא בְּמַה שֶׁיֵּשׁ בּוֹ',
    english: 'Do not look at the container, but rather at what is in it.',
    source: 'Pirkei Avot 4:20',
  },
  {
    hebrew: 'דַּע מֵאַיִן בָּאתָ וּלְאָן אַתָּה הוֹלֵךְ וְלִפְנֵי מִי אַתָּה עָתִיד לִתֵּן דִּין וְחֶשְׁבּוֹן',
    english: 'Know from where you came, where you are going, and before whom you will give an accounting.',
    source: 'Pirkei Avot 3:1',
  },
  {
    hebrew: 'עֲשֵׂה תוֹרָתְךָ קֶבַע',
    english: 'Make your Torah study a fixed practice.',
    source: 'Pirkei Avot 1:15',
  },
  {
    hebrew: 'שָׁמַיִם וָאָרֶץ בָּרָא אֱלֹהִים',
    english: 'In the beginning God created the heavens and the earth — every journey starts with a first step.',
    source: 'Bereishit 1:1',
  },
  {
    hebrew: 'כִּי נֵר מִצְוָה וְתוֹרָה אוֹר',
    english: 'For a mitzvah is a candle, and Torah is light.',
    source: 'Mishlei 6:23',
  },
  {
    hebrew: 'טַעֲמוּ וּרְאוּ כִּי טוֹב ה׳',
    english: 'Taste and see that God is good.',
    source: 'Tehillim 34:9',
  },
  {
    hebrew: 'חֲנֹךְ לַנַּעַר עַל פִּי דַרְכּוֹ גַּם כִּי יַזְקִין לֹא יָסוּר מִמֶּנָּה',
    english: 'Educate a child according to their way; even when old, they will not depart from it.',
    source: 'Mishlei 22:6',
  },
  {
    hebrew: 'מַה טֹּבוּ אֹהָלֶיךָ יַעֲקֹב מִשְׁכְּנֹתֶיךָ יִשְׂרָאֵל',
    english: 'How good are your tents, Jacob; your dwelling places, Israel.',
    source: 'Bamidbar 24:5',
  },
  {
    hebrew: 'רַבִּי חֲנַנְיָה בֶּן עֲקַשְׁיָא אוֹמֵר רָצָה הַקָּדוֹשׁ בָּרוּךְ הוּא לְזַכּוֹת אֶת יִשְׂרָאֵל',
    english: 'The Holy One wished to give merit to Israel — therefore He gave them much Torah and many mitzvot.',
    source: 'Makkot 3:16',
  },
  {
    hebrew: 'תּוֹרָה צִוָּה לָנוּ מֹשֶׁה מוֹרָשָׁה קְהִלַּת יַעֲקֹב',
    english: 'The Torah that Moshe commanded us is the inheritance of the congregation of Yaakov.',
    source: 'Devarim 33:4',
  },
  {
    hebrew: 'יָגַעְתִּי וְלֹא מָצָאתִי אַל תַּאֲמִין יָגַעְתִּי וּמָצָאתִי תַּאֲמִין',
    english: 'If someone says "I toiled and did not find" — do not believe them. "I toiled and found" — believe them.',
    source: 'Megillah 6b',
  },
  {
    hebrew: 'הֱוֵי מִתְלַמִּידָיו שֶׁל אַהֲרֹן אוֹהֵב שָׁלוֹם וְרוֹדֵף שָׁלוֹם',
    english: 'Be among the students of Aharon — loving peace and pursuing peace.',
    source: 'Pirkei Avot 1:12',
  },
  {
    hebrew: 'גָּדוֹל הַתַּלְמוּד שֶׁמֵּבִיא לִידֵי מַעֲשֶׂה',
    english: 'Great is study, for it leads to action.',
    source: 'Kiddushin 40b',
  },
  {
    hebrew: 'אֵין הַדָּבָר תָּלוּי אֶלָּא בִּי',
    english: 'The matter depends on no one but me.',
    source: 'Bereishit Rabbah 21:5',
  },
];

/** Pick a random streak encouragement (changes each page load). */
export function getRandomStreakEncouragement(): StreakEncouragement {
  return STREAK_ENCOURAGEMENTS[Math.floor(Math.random() * STREAK_ENCOURAGEMENTS.length)];
}

/** Get the daily inspiration quote (consistent throughout the day, changes daily). */
export function getDailyInspiration(): DailyInspiration {
  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_INSPIRATIONS.length;
  return DAILY_INSPIRATIONS[dayIndex];
}

/**
 * Replace {name} placeholders in a template string.
 * If name is empty/undefined, gracefully removes the placeholder and surrounding punctuation.
 */
export function formatWithName(template: string, name?: string | null): string {
  if (!name || name.trim() === '') {
    return template
      .replace(/,?\s*\{name\}/g, '')
      .replace(/\{name\},?\s*/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return template.replace(/\{name\}/g, name);
}
