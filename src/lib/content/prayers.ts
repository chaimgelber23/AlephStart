import { Prayer } from '@/types';

/**
 * AlephStart Prayer & Bracha Content
 *
 * Organized into two categories:
 *   - 'tefillah' — Core parts of davening (prayer service)
 *   - 'brachot' — Blessings over food, drink, etc.
 *
 * Each entry includes Hebrew with nekudot, transliteration, English translation,
 * contextual notes, and spiritual meaning.
 */

// ==========================================
// TEFILLAH — Main Parts of Prayer
// ==========================================

const TEFILLAH_PRAYERS: Prayer[] = [
  // ---- Modeh Ani ----
  {
    id: 'modeh-ani',
    slug: 'modeh-ani',
    nameHebrew: 'מוֹדֶה אֲנִי',
    nameEnglish: 'Modeh Ani',
    category: 'tefillah',
    sortOrder: 1,
    whenSaid: 'First thing upon waking, before getting out of bed',
    whySaid: 'We thank Hashem for returning our soul — for the gift of another day of life.',
    inspirationText: 'Every morning is a gift. Before your feet touch the ground, before you check your phone, before anything — you say "thank you." This prayer is your first conversation with God each day.',
    requiredLevel: 1,
    estimatedReadSeconds: 15,
    sections: [
      {
        id: 'modeh-ani-1',
        sortOrder: 1,
        hebrewText: 'מוֹדֶה אֲנִי לְפָנֶיךָ',
        transliteration: 'Modeh ani l\'fanecha',
        translation: 'I give thanks before You',
        notes: 'מוֹדֶה = I give thanks. אֲנִי = I. לְפָנֶיךָ = before You.',
      },
      {
        id: 'modeh-ani-2',
        sortOrder: 2,
        hebrewText: 'מֶלֶךְ חַי וְקַיָּם',
        transliteration: 'Melech chai v\'kayam',
        translation: 'Living and eternal King',
        notes: 'מֶלֶךְ = King. חַי = living. וְקַיָּם = and enduring/eternal.',
      },
      {
        id: 'modeh-ani-3',
        sortOrder: 3,
        hebrewText: 'שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי',
        transliteration: 'She\'hechezarta bi nishmati',
        translation: 'For You have returned my soul within me',
        notes: 'שֶׁהֶחֱזַרְתָּ = that You returned. בִּי = within me. נִשְׁמָתִי = my soul.',
      },
      {
        id: 'modeh-ani-4',
        sortOrder: 4,
        hebrewText: 'בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ',
        transliteration: 'B\'chemla raba emunatecha',
        translation: 'With compassion — great is Your faithfulness',
        notes: 'בְּחֶמְלָה = with compassion. רַבָּה = great/abundant. אֱמוּנָתֶךָ = Your faithfulness.',
      },
    ],
  },

  // ---- Ashrei ----
  {
    id: 'ashrei',
    slug: 'ashrei',
    nameHebrew: 'אַשְׁרֵי',
    nameEnglish: 'Ashrei',
    category: 'tefillah',
    sortOrder: 2,
    whenSaid: 'Recited three times daily — twice in Shacharis (morning) and once in Mincha (afternoon)',
    whySaid: 'Ashrei is Psalm 145, an alphabetical praise of Hashem. The Talmud says that one who says Ashrei three times a day is assured a place in the World to Come.',
    inspirationText: 'This psalm covers every letter of the Hebrew aleph-bet (except Nun) — a complete, all-encompassing praise of God. It\'s a spiritual warmup before the Amidah.',
    requiredLevel: 5,
    estimatedReadSeconds: 120,
    sections: [
      {
        id: 'ashrei-intro-1',
        sortOrder: 1,
        hebrewText: 'אַשְׁרֵי יוֹשְׁבֵי בֵיתֶךָ עוֹד יְהַלְלוּךָ סֶּלָה',
        transliteration: 'Ashrei yosh\'vei veitecha, od y\'hal\'lucha selah',
        translation: 'Praiseworthy are those who dwell in Your house; they will yet praise You, Selah',
        notes: 'This opening verse (Psalm 84:5) sets the scene — those who are always in God\'s presence are the truly happy ones.',
      },
      {
        id: 'ashrei-intro-2',
        sortOrder: 2,
        hebrewText: 'אַשְׁרֵי הָעָם שֶׁכָּכָה לּוֹ אַשְׁרֵי הָעָם שֶׁה׳ אֱלֹקָיו',
        transliteration: 'Ashrei ha\'am shekachah lo, ashrei ha\'am she\'Adonai Elokav',
        translation: 'Praiseworthy is the people for whom this is so; praiseworthy is the people whose God is the Lord',
        notes: 'From Psalm 144:15. We are fortunate that Hashem is our God.',
      },
      {
        id: 'ashrei-aleph',
        sortOrder: 3,
        hebrewText: 'תְּהִלָּה לְדָוִד אֲרוֹמִמְךָ אֱלוֹקַי הַמֶּלֶךְ וַאֲבָרְכָה שִׁמְךָ לְעוֹלָם וָעֶד',
        transliteration: 'T\'hilah l\'David. Aromimcha Elokai haMelech, va\'avar\'chah shimcha l\'olam va\'ed',
        translation: 'A psalm of David. I will exalt You, my God the King, and I will bless Your Name forever and ever',
        notes: 'Psalm 145 begins. Each verse starts with a successive letter of the aleph-bet.',
      },
      {
        id: 'ashrei-bet-gimel',
        sortOrder: 4,
        hebrewText: 'בְּכָל יוֹם אֲבָרְכֶךָּ וַאֲהַלְלָה שִׁמְךָ לְעוֹלָם וָעֶד. גָּדוֹל ה׳ וּמְהֻלָּל מְאֹד וְלִגְדֻלָּתוֹ אֵין חֵקֶר',
        transliteration: 'B\'chol yom avar\'cheka, va\'ahal\'lah shimcha l\'olam va\'ed. Gadol Adonai um\'hulal m\'od, v\'ligdulato ein cheiker',
        translation: 'Every day I will bless You, and I will praise Your Name forever. Great is the Lord and much praised, and His greatness is beyond investigation',
        notes: 'ב (Bet) and ג (Gimel) verses — daily praise and acknowledging God\'s infinite greatness.',
      },
      {
        id: 'ashrei-dalet-hei',
        sortOrder: 5,
        hebrewText: 'דּוֹר לְדוֹר יְשַׁבַּח מַעֲשֶׂיךָ וּגְבוּרֹתֶיךָ יַגִּידוּ. הֲדַר כְּבוֹד הוֹדֶךָ וְדִבְרֵי נִפְלְאוֹתֶיךָ אָשִׂיחָה',
        transliteration: 'Dor l\'dor y\'shabach ma\'asecha, ug\'vurotecha yagidu. Hadar k\'vod hodecha, v\'divrei nifl\'otecha asichah',
        translation: 'Each generation will praise Your deeds to the next, and tell of Your mighty acts. The splendor of Your glorious majesty and Your wondrous deeds I will speak of',
        notes: 'ד (Dalet) and ה (Hei) verses — the chain of praise from generation to generation.',
      },
      {
        id: 'ashrei-poteach',
        sortOrder: 6,
        hebrewText: 'פּוֹתֵחַ אֶת יָדֶךָ וּמַשְׂבִּיעַ לְכָל חַי רָצוֹן',
        transliteration: 'Pote\'ach et yadecha, umasbi\'a l\'chol chai ratzon',
        translation: 'You open Your hand and satisfy the desire of every living thing',
        notes: 'This is the key verse of Ashrei — God sustains all life. We say it with extra concentration (kavanah).',
      },
      {
        id: 'ashrei-closing',
        sortOrder: 7,
        hebrewText: 'תְּהִלַּת ה׳ יְדַבֶּר פִּי וִיבָרֵךְ כָּל בָּשָׂר שֵׁם קָדְשׁוֹ לְעוֹלָם וָעֶד. וַאֲנַחְנוּ נְבָרֵךְ יָהּ מֵעַתָּה וְעַד עוֹלָם הַלְלוּיָהּ',
        transliteration: 'T\'hilat Adonai y\'daber pi, vivareich kol basar shem kodsho l\'olam va\'ed. Va\'anachnu n\'vareich Kah me\'atah v\'ad olam, Hal\'luyah',
        translation: 'My mouth will speak the praise of the Lord, and all flesh will bless His holy Name forever. And we will bless God from now until forever, Halleluyah',
        notes: 'The final verse of Psalm 145, followed by Psalm 115:18 as the closing.',
      },
    ],
  },

  // ---- Shema ----
  {
    id: 'shema',
    slug: 'shema',
    nameHebrew: 'שְׁמַע יִשְׂרָאֵל',
    nameEnglish: 'Shema',
    category: 'tefillah',
    sortOrder: 3,
    whenSaid: 'Morning and evening prayers, and before going to sleep',
    whySaid: 'The declaration of God\'s unity — the most fundamental statement of Jewish faith. Jews have said these words for over 3,000 years.',
    inspirationText: 'These six words are the heart of Judaism. They\'re the first words a Jewish child learns, the last words said before death, and every morning and evening in between. When you say Shema, you join a chain going back to Abraham.',
    requiredLevel: 3,
    estimatedReadSeconds: 60,
    sections: [
      {
        id: 'shema-1',
        sortOrder: 1,
        hebrewText: 'שְׁמַע יִשְׂרָאֵל ה׳ אֱלֹקֵינוּ ה׳ אֶחָד',
        transliteration: 'Shma Yisrael, Adonai Elokeinu, Adonai Echad',
        translation: 'Hear O Israel, the Lord is our God, the Lord is One',
        notes: 'שְׁמַע = Hear/Listen. יִשְׂרָאֵל = Israel (all of us). אֶחָד = One.',
      },
      {
        id: 'shema-2',
        sortOrder: 2,
        hebrewText: 'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד',
        transliteration: 'Baruch shem k\'vod malchuto l\'olam va\'ed',
        translation: 'Blessed is the Name of His glorious kingdom forever and ever',
        notes: 'This line is said quietly (except on Yom Kippur). It\'s a response to the declaration of God\'s unity.',
      },
      {
        id: 'shema-3',
        sortOrder: 3,
        hebrewText: 'וְאָהַבְתָּ אֵת ה׳ אֱלֹקֶיךָ',
        transliteration: 'V\'ahavta et Adonai Elokecha',
        translation: 'And you shall love the Lord your God',
        notes: 'וְאָהַבְתָּ = And you shall love. This begins the first paragraph of the Shema.',
      },
      {
        id: 'shema-4',
        sortOrder: 4,
        hebrewText: 'בְּכָל לְבָבְךָ וּבְכָל נַפְשְׁךָ וּבְכָל מְאֹדֶךָ',
        transliteration: 'B\'chol l\'vav\'cha uv\'chol nafsh\'cha uv\'chol m\'odecha',
        translation: 'With all your heart, with all your soul, and with all your might',
        notes: 'לְבָבְךָ = your heart. נַפְשְׁךָ = your soul. מְאֹדֶךָ = your might/resources.',
      },
      {
        id: 'shema-5',
        sortOrder: 5,
        hebrewText: 'וְהָיוּ הַדְּבָרִים הָאֵלֶּה אֲשֶׁר אָנֹכִי מְצַוְּךָ הַיּוֹם עַל לְבָבֶךָ',
        transliteration: 'V\'hayu had\'varim ha\'eileh asher anochi m\'tzav\'cha hayom al l\'vavecha',
        translation: 'And these words which I command you today shall be upon your heart',
        notes: 'הַדְּבָרִים = the words/things. הַיּוֹם = today (every day feels like the first time).',
      },
      {
        id: 'shema-6',
        sortOrder: 6,
        hebrewText: 'וְשִׁנַּנְתָּם לְבָנֶיךָ וְדִבַּרְתָּ בָּם',
        transliteration: 'V\'shinantam l\'vanecha v\'dibarta bam',
        translation: 'And you shall teach them to your children, and speak of them',
        notes: 'וְשִׁנַּנְתָּם = and you shall teach (sharpen). לְבָנֶיךָ = to your children.',
      },
      {
        id: 'shema-7',
        sortOrder: 7,
        hebrewText: 'בְּשִׁבְתְּךָ בְּבֵיתֶךָ וּבְלֶכְתְּךָ בַדֶּרֶךְ',
        transliteration: 'B\'shiv\'t\'cha b\'veitecha uv\'lecht\'cha vaderech',
        translation: 'When you sit in your house, and when you walk on the way',
        notes: 'בְּבֵיתֶךָ = in your house. בַדֶּרֶךְ = on the road/way.',
      },
      {
        id: 'shema-8',
        sortOrder: 8,
        hebrewText: 'וּבְשָׁכְבְּךָ וּבְקוּמֶךָ',
        transliteration: 'Uv\'shoch\'b\'cha uv\'kumecha',
        translation: 'When you lie down and when you rise up',
        notes: 'This is why we say Shema morning and evening — "when you lie down and when you rise up."',
      },
    ],
  },

  // ---- Shemoneh Esrei (Amidah) — Full 19 Brachot ----
  {
    id: 'shemoneh-esrei',
    slug: 'shemoneh-esrei',
    nameHebrew: 'שְׁמוֹנֶה עֶשְׂרֵה',
    nameEnglish: 'Shemoneh Esrei (Amidah)',
    category: 'tefillah',
    sortOrder: 4,
    whenSaid: 'Three times daily — Shacharis (morning), Mincha (afternoon), and Maariv (evening). Said standing, with feet together, facing Jerusalem.',
    whySaid: 'The Shemoneh Esrei ("Eighteen," though it actually has 19 blessings) is the central prayer of every Jewish service. It is our direct, personal conversation with Hashem — we praise Him, ask for our needs, and give thanks.',
    inspirationText: 'This is the moment you stand before the King of Kings. Take three steps forward as if approaching a throne, whisper each word, and pour out your heart. The Sages structured these 19 blessings to cover every human need — from wisdom to health to peace.',
    requiredLevel: 6,
    estimatedReadSeconds: 600,
    sections: [
      // -- Opening --
      {
        id: 'se-opening',
        sortOrder: 1,
        hebrewText: 'אֲדֹנָי שְׂפָתַי תִּפְתָּח וּפִי יַגִּיד תְּהִלָּתֶךָ',
        transliteration: 'Adonai s\'fatai tiftach, ufi yagid t\'hilatecha',
        translation: 'Lord, open my lips, that my mouth may declare Your praise',
        notes: 'Before beginning the Amidah, we ask Hashem to help us pray. Take three steps forward with feet together.',
      },

      // -- 1. Avot (Patriarchs) --
      {
        id: 'se-01-avot',
        sortOrder: 2,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ וֵאלֹקֵי אֲבוֹתֵינוּ אֱלֹקֵי אַבְרָהָם אֱלֹקֵי יִצְחָק וֵאלֹקֵי יַעֲקֹב הָאֵל הַגָּדוֹל הַגִּבּוֹר וְהַנּוֹרָא אֵל עֶלְיוֹן גּוֹמֵל חֲסָדִים טוֹבִים וְקוֹנֵה הַכֹּל וְזוֹכֵר חַסְדֵי אָבוֹת וּמֵבִיא גוֹאֵל לִבְנֵי בְנֵיהֶם לְמַעַן שְׁמוֹ בְּאַהֲבָה. מֶלֶךְ עוֹזֵר וּמוֹשִׁיעַ וּמָגֵן. בָּרוּךְ אַתָּה ה׳ מָגֵן אַבְרָהָם',
        transliteration: 'Baruch Atah Adonai, Elokeinu v\'Elokei avoteinu, Elokei Avraham, Elokei Yitzchak, v\'Elokei Ya\'akov. Ha\'Eil hagadol, hagibor v\'hanora, Eil elyon, gomeil chasadim tovim, v\'koneh hakol, v\'zocheir chasdei avot, u\'meivi go\'eil livnei v\'neihem, l\'ma\'an sh\'mo b\'ahavah. Melech ozeir u\'moshi\'a u\'magein. Baruch Atah Adonai, magein Avraham',
        translation: 'Blessed are You, Lord our God and God of our fathers, God of Abraham, God of Isaac, and God of Jacob. The great, mighty, and awesome God, God Most High, Who bestows beneficial kindnesses, Who is Master of all, Who remembers the piety of the Patriarchs, and brings a redeemer to their children\'s children for His Name\'s sake, with love. King, Helper, Savior, and Shield. Blessed are You, Lord, Shield of Abraham.',
        notes: 'Bracha 1 — Avot (Patriarchs). We invoke our forefathers to connect our prayers to their merit. Each patriarch is mentioned separately because each had a unique relationship with God.',
      },

      // -- 2. Gevurot (God's Might) --
      {
        id: 'se-02-gevurot',
        sortOrder: 3,
        hebrewText: 'אַתָּה גִּבּוֹר לְעוֹלָם אֲדֹנָי מְחַיֵּה מֵתִים אַתָּה רַב לְהוֹשִׁיעַ. מְכַלְכֵּל חַיִּים בְּחֶסֶד מְחַיֵּה מֵתִים בְּרַחֲמִים רַבִּים סוֹמֵךְ נוֹפְלִים וְרוֹפֵא חוֹלִים וּמַתִּיר אֲסוּרִים וּמְקַיֵּם אֱמוּנָתוֹ לִישֵׁנֵי עָפָר. מִי כָמוֹךָ בַּעַל גְּבוּרוֹת וּמִי דּוֹמֶה לָּךְ מֶלֶךְ מֵמִית וּמְחַיֶּה וּמַצְמִיחַ יְשׁוּעָה. וְנֶאֱמָן אַתָּה לְהַחֲיוֹת מֵתִים. בָּרוּךְ אַתָּה ה׳ מְחַיֵּה הַמֵּתִים',
        transliteration: 'Atah gibor l\'olam Adonai, m\'chayeh meitim Atah, rav l\'hoshi\'a. M\'chalkeil chayim b\'chesed, m\'chayeh meitim b\'rachamim rabim, someich noflim, v\'rofei cholim, u\'matir asurim, um\'kayeim emunato lisheinei afar. Mi chamocha ba\'al g\'vurot, umi domeh lach, Melech meimit um\'chayeh u\'matzmi\'ach y\'shuah. V\'ne\'eman Atah l\'hachayot meitim. Baruch Atah Adonai, m\'chayeh hameitim',
        translation: 'You are eternally mighty, Lord; You resurrect the dead, You are powerful to save. He sustains the living with kindness, resurrects the dead with great mercy, supports the fallen, heals the sick, releases the imprisoned, and maintains His faith to those who sleep in the dust. Who is like You, Master of mighty deeds, and who can compare to You, King Who causes death and restores life and causes salvation to sprout. And You are faithful to resurrect the dead. Blessed are You, Lord, Who resurrects the dead.',
        notes: 'Bracha 2 — Gevurot (God\'s Might). Praises God\'s power over life and death. In winter add "mashiv haruach u\'morid hageshem" (Who causes the wind to blow and rain to fall).',
      },

      // -- 3. Kedushat Hashem (Holiness of God) --
      {
        id: 'se-03-kedushah',
        sortOrder: 4,
        hebrewText: 'אַתָּה קָדוֹשׁ וְשִׁמְךָ קָדוֹשׁ וּקְדוֹשִׁים בְּכָל יוֹם יְהַלְלוּךָ סֶּלָה. בָּרוּךְ אַתָּה ה׳ הָאֵל הַקָּדוֹשׁ',
        transliteration: 'Atah kadosh v\'shimcha kadosh, uk\'doshim b\'chol yom y\'hal\'lucha selah. Baruch Atah Adonai, ha\'Eil hakadosh',
        translation: 'You are holy and Your Name is holy, and the holy ones praise You every day, Selah. Blessed are You, Lord, the holy God.',
        notes: 'Bracha 3 — Kedushat Hashem (God\'s Holiness). When davening with a minyan, the chazzan\'s repetition includes the full Kedushah here (Kadosh, kadosh, kadosh...).',
      },

      // -- 4. Binah / Da'at (Knowledge) --
      {
        id: 'se-04-daat',
        sortOrder: 5,
        hebrewText: 'אַתָּה חוֹנֵן לְאָדָם דַּעַת וּמְלַמֵּד לֶאֱנוֹשׁ בִּינָה. חָנֵּנוּ מֵאִתְּךָ דֵּעָה בִּינָה וְהַשְׂכֵּל. בָּרוּךְ אַתָּה ה׳ חוֹנֵן הַדָּעַת',
        transliteration: 'Atah chonein l\'adam da\'at, um\'lameid le\'enosh binah. Choneinu me\'it\'cha dei\'ah, binah v\'haskeil. Baruch Atah Adonai, chonein hada\'at',
        translation: 'You graciously grant man knowledge and teach mortals understanding. Grant us from You knowledge, understanding, and wisdom. Blessed are You, Lord, gracious Giver of knowledge.',
        notes: 'Bracha 4 — Da\'at (Knowledge). First of the 13 middle blessings (requests). We begin by asking for wisdom, because without understanding we cannot even know what to ask for.',
      },

      // -- 5. Teshuvah (Repentance) --
      {
        id: 'se-05-teshuvah',
        sortOrder: 6,
        hebrewText: 'הֲשִׁיבֵנוּ אָבִינוּ לְתוֹרָתֶךָ וְקָרְבֵנוּ מַלְכֵּנוּ לַעֲבוֹדָתֶךָ וְהַחֲזִירֵנוּ בִּתְשׁוּבָה שְׁלֵמָה לְפָנֶיךָ. בָּרוּךְ אַתָּה ה׳ הָרוֹצֶה בִּתְשׁוּבָה',
        transliteration: 'Hashiveinu Avinu l\'Toratecha, v\'karveinu Malkeinu la\'avodatecha, v\'hachazireinu bi\'tshuvah sh\'leimah l\'fanecha. Baruch Atah Adonai, harotzeh bi\'tshuvah',
        translation: 'Return us, our Father, to Your Torah, and draw us near, our King, to Your service, and bring us back in complete repentance before You. Blessed are You, Lord, Who desires repentance.',
        notes: 'Bracha 5 — Teshuvah (Repentance). After asking for wisdom, we ask for the ability to return to God. Note we call God both "Father" (closeness) and "King" (majesty).',
      },

      // -- 6. Selichah (Forgiveness) --
      {
        id: 'se-06-selichah',
        sortOrder: 7,
        hebrewText: 'סְלַח לָנוּ אָבִינוּ כִּי חָטָאנוּ מְחַל לָנוּ מַלְכֵּנוּ כִּי פָשָׁעְנוּ כִּי מוֹחֵל וְסוֹלֵחַ אָתָּה. בָּרוּךְ אַתָּה ה׳ חַנּוּן הַמַּרְבֶּה לִסְלוֹחַ',
        transliteration: 'S\'lach lanu Avinu ki chatanu, m\'chal lanu Malkeinu ki fashanu, ki mocheil v\'solei\'ach Atah. Baruch Atah Adonai, chanun hamarbeh lislo\'ach',
        translation: 'Forgive us, our Father, for we have sinned; pardon us, our King, for we have transgressed; for You are a pardoner and forgiver. Blessed are You, Lord, the gracious One Who pardons abundantly.',
        notes: 'Bracha 6 — Selichah (Forgiveness). חָטָאנוּ (sinned) = unintentional; פָשָׁעְנוּ (transgressed) = intentional. God forgives both.',
      },

      // -- 7. Ge'ulah (Redemption) --
      {
        id: 'se-07-geulah',
        sortOrder: 8,
        hebrewText: 'רְאֵה נָא בְעָנְיֵנוּ וְרִיבָה רִיבֵנוּ וּגְאָלֵנוּ מְהֵרָה לְמַעַן שְׁמֶךָ כִּי גּוֹאֵל חָזָק אָתָּה. בָּרוּךְ אַתָּה ה׳ גּוֹאֵל יִשְׂרָאֵל',
        transliteration: 'R\'eih na v\'on\'yeinu, v\'rivah riveinu, ug\'aleinu m\'heirah l\'ma\'an sh\'mecha, ki go\'eil chazak Atah. Baruch Atah Adonai, go\'eil Yisrael',
        translation: 'Look upon our affliction and fight our fight, and redeem us speedily for Your Name\'s sake, for You are a powerful Redeemer. Blessed are You, Lord, Redeemer of Israel.',
        notes: 'Bracha 7 — Ge\'ulah (Redemption). We ask God to see our troubles and rescue us — both individually and as a nation.',
      },

      // -- 8. Refu'ah (Healing) --
      {
        id: 'se-08-refuah',
        sortOrder: 9,
        hebrewText: 'רְפָאֵנוּ ה׳ וְנֵרָפֵא הוֹשִׁיעֵנוּ וְנִוָּשֵׁעָה כִּי תְהִלָּתֵנוּ אָתָּה וְהַעֲלֵה רְפוּאָה שְׁלֵמָה לְכָל מַכּוֹתֵינוּ כִּי אֵל מֶלֶךְ רוֹפֵא נֶאֱמָן וְרַחֲמָן אָתָּה. בָּרוּךְ אַתָּה ה׳ רוֹפֵא חוֹלֵי עַמּוֹ יִשְׂרָאֵל',
        transliteration: 'R\'fa\'einu Adonai v\'neirafei, hoshi\'einu v\'nivashei\'ah, ki t\'hilateinu Atah, v\'ha\'aleh r\'fuah sh\'leimah l\'chol makoteinu, ki Eil Melech rofei ne\'eman v\'rachaman Atah. Baruch Atah Adonai, rofei cholei amo Yisrael',
        translation: 'Heal us, Lord, and we will be healed; save us and we will be saved, for You are our praise. Bring complete healing to all our ailments, for You, God, King, are a faithful and compassionate Healer. Blessed are You, Lord, Who heals the sick of His people Israel.',
        notes: 'Bracha 8 — Refu\'ah (Healing). You can add personal prayers for sick individuals here by name. "Heal us and we will be healed" is from Jeremiah 17:14.',
      },

      // -- 9. Birkat Hashanim (Year's Blessing) --
      {
        id: 'se-09-shanim',
        sortOrder: 10,
        hebrewText: 'בָּרֵךְ עָלֵינוּ ה׳ אֱלֹקֵינוּ אֶת הַשָּׁנָה הַזֹּאת וְאֶת כָּל מִינֵי תְבוּאָתָהּ לְטוֹבָה וְתֵן בְּרָכָה עַל פְּנֵי הָאֲדָמָה וְשַׂבְּעֵנוּ מִטּוּבָהּ וּבָרֵךְ שְׁנָתֵנוּ כַּשָּׁנִים הַטּוֹבוֹת. בָּרוּךְ אַתָּה ה׳ מְבָרֵךְ הַשָּׁנִים',
        transliteration: 'Bareich aleinu Adonai Elokeinu et hashanah hazot v\'et kol minei t\'vuatah l\'tovah, v\'tein b\'rachah al p\'nei ha\'adamah, v\'sab\'einu mituvah, u\'vareich sh\'nateinu kashanim hatovot. Baruch Atah Adonai, m\'vareich hashanim',
        translation: 'Bless this year for us, Lord our God, and all its kinds of produce for good; grant blessing upon the face of the earth, satisfy us from Your goodness, and bless our year like the good years. Blessed are You, Lord, Who blesses the years.',
        notes: 'Bracha 9 — Birkat Hashanim (Prosperity). In winter (Dec 4 – Pesach), we add "v\'tein tal u\'matar livrachah" (grant dew and rain for blessing).',
      },

      // -- 10. Kibbutz Galuyot (Ingathering of Exiles) --
      {
        id: 'se-10-galuyot',
        sortOrder: 11,
        hebrewText: 'תְּקַע בְּשׁוֹפָר גָּדוֹל לְחֵרוּתֵנוּ וְשָׂא נֵס לְקַבֵּץ גָּלֻיּוֹתֵינוּ וְקַבְּצֵנוּ יַחַד מֵאַרְבַּע כַּנְפוֹת הָאָרֶץ. בָּרוּךְ אַתָּה ה׳ מְקַבֵּץ נִדְחֵי עַמּוֹ יִשְׂרָאֵל',
        transliteration: 'T\'ka b\'shofar gadol l\'cheiruteinu, v\'sa neis l\'kabeitz galuyoteinu, v\'kab\'tzeinu yachad mei\'arba kanfot ha\'aretz. Baruch Atah Adonai, m\'kabeitz nidchei amo Yisrael',
        translation: 'Sound the great shofar for our freedom, raise a banner to gather our exiles, and gather us together from the four corners of the earth. Blessed are You, Lord, Who gathers the dispersed of His people Israel.',
        notes: 'Bracha 10 — Kibbutz Galuyot (Ingathering of Exiles). We pray for all Jews scattered around the world to be gathered back to the Land of Israel.',
      },

      // -- 11. Din / Mishpat (Justice) --
      {
        id: 'se-11-mishpat',
        sortOrder: 12,
        hebrewText: 'הָשִׁיבָה שׁוֹפְטֵינוּ כְּבָרִאשׁוֹנָה וְיוֹעֲצֵינוּ כְּבַתְּחִלָּה וְהָסֵר מִמֶּנּוּ יָגוֹן וַאֲנָחָה וּמְלוֹךְ עָלֵינוּ אַתָּה ה׳ לְבַדְּךָ בְּחֶסֶד וּבְרַחֲמִים וְצַדְּקֵנוּ בַּמִּשְׁפָּט. בָּרוּךְ אַתָּה ה׳ מֶלֶךְ אוֹהֵב צְדָקָה וּמִשְׁפָּט',
        transliteration: 'Hashivah shof\'teinu k\'varishonah, v\'yo\'atzeinu k\'vat\'chilah, v\'haseir mimenu yagon va\'anachah, u\'m\'loch aleinu Atah Adonai l\'vad\'cha, b\'chesed uv\'rachamim, v\'tzad\'keinu bamishpat. Baruch Atah Adonai, Melech oheiv tz\'dakah u\'mishpat',
        translation: 'Restore our judges as of old and our counselors as at the beginning; remove from us sorrow and groaning; and reign over us, You alone, Lord, with kindness and compassion, and vindicate us in judgment. Blessed are You, Lord, King Who loves righteousness and justice.',
        notes: 'Bracha 11 — Mishpat (Justice). We pray for righteous leadership and true justice. During the Ten Days of Repentance, say "HaMelech hamishpat" instead.',
      },

      // -- 12. Birkat Haminim (Against Slanderers) --
      {
        id: 'se-12-minim',
        sortOrder: 13,
        hebrewText: 'וְלַמַּלְשִׁינִים אַל תְּהִי תִקְוָה וְכָל הָרִשְׁעָה כְּרֶגַע תֹּאבֵד וְכָל אוֹיְבֶיךָ מְהֵרָה יִכָּרֵתוּ וְהַזֵּדִים מְהֵרָה תְעַקֵּר וּתְשַׁבֵּר וּתְמַגֵּר וְתַכְנִיעַ בִּמְהֵרָה בְיָמֵינוּ. בָּרוּךְ אַתָּה ה׳ שׁוֹבֵר אוֹיְבִים וּמַכְנִיעַ זֵדִים',
        transliteration: 'V\'lamal\'shinim al t\'hi tikvah, v\'chol harishah k\'rega toveid, v\'chol oy\'vecha m\'heirah yikaritu, v\'hazeidim m\'heirah t\'aker ut\'shabeir ut\'mageir v\'tachni\'a bimheirah v\'yameinu. Baruch Atah Adonai, shoveir oy\'vim u\'machni\'a zeidim',
        translation: 'And for slanderers let there be no hope; and may all wickedness perish in an instant; and may all Your enemies be speedily cut down. And the insolent, speedily uproot, break, cast down and humble speedily in our days. Blessed are You, Lord, Who breaks enemies and humbles the insolent.',
        notes: 'Bracha 12 — Birkat Haminim. This was the 19th bracha added by Shmuel HaKatan at the request of Rabban Gamliel, making the total 19.',
      },

      // -- 13. Tzaddikim (The Righteous) --
      {
        id: 'se-13-tzaddikim',
        sortOrder: 14,
        hebrewText: 'עַל הַצַּדִּיקִים וְעַל הַחֲסִידִים וְעַל זִקְנֵי עַמְּךָ בֵּית יִשְׂרָאֵל וְעַל פְּלֵיטַת סוֹפְרֵיהֶם וְעַל גֵּרֵי הַצֶּדֶק וְעָלֵינוּ יֶהֱמוּ נָא רַחֲמֶיךָ ה׳ אֱלֹקֵינוּ וְתֵן שָׂכָר טוֹב לְכָל הַבּוֹטְחִים בְּשִׁמְךָ בֶּאֱמֶת וְשִׂים חֶלְקֵנוּ עִמָּהֶם לְעוֹלָם וְלֹא נֵבוֹשׁ כִּי בְךָ בָטָחְנוּ. בָּרוּךְ אַתָּה ה׳ מִשְׁעָן וּמִבְטָח לַצַּדִּיקִים',
        transliteration: 'Al hatzadikim v\'al hachasidim, v\'al ziknei am\'cha beit Yisrael, v\'al pleitat sof\'reihem, v\'al geirei hatzedek v\'aleinu, yehemu na rachamecha Adonai Elokeinu, v\'tein sachar tov l\'chol habot\'chim b\'shimcha be\'emet, v\'sim chelkeinu imahem l\'olam, v\'lo neivosh ki v\'cha vatachnu. Baruch Atah Adonai, mish\'an u\'mivtach latzadikim',
        translation: 'On the righteous, on the pious, on the elders of Your people the House of Israel, on the remnant of their scholars, on the righteous converts, and on us — may Your compassion be aroused, Lord our God. Grant a good reward to all who truly trust in Your Name, and place our lot among them forever, and we will not be ashamed, for in You we trust. Blessed are You, Lord, Support and Trust of the righteous.',
        notes: 'Bracha 13 — Tzaddikim (The Righteous). We pray for all who keep the faith — including righteous converts (geirei tzedek) — and ask to be counted among them.',
      },

      // -- 14. Yerushalayim (Jerusalem) --
      {
        id: 'se-14-yerushalayim',
        sortOrder: 15,
        hebrewText: 'וְלִירוּשָׁלַיִם עִירְךָ בְּרַחֲמִים תָּשׁוּב וְתִשְׁכּוֹן בְּתוֹכָהּ כַּאֲשֶׁר דִּבַּרְתָּ וּבְנֵה אוֹתָהּ בְּקָרוֹב בְּיָמֵינוּ בִּנְיַן עוֹלָם וְכִסֵּא דָוִד מְהֵרָה לְתוֹכָהּ תָּכִין. בָּרוּךְ אַתָּה ה׳ בּוֹנֵה יְרוּשָׁלָיִם',
        transliteration: 'V\'liYerushalayim ir\'cha b\'rachamim tashuv, v\'tishkon b\'tochah ka\'asher dibarta, uv\'neh otah b\'karov b\'yameinu binyan olam, v\'kisei David m\'heirah l\'tochah tachin. Baruch Atah Adonai, boneh Yerushalayim',
        translation: 'And to Jerusalem, Your city, return in mercy, and dwell within it as You have spoken; rebuild it soon in our days as an everlasting structure, and the throne of David speedily establish within it. Blessed are You, Lord, Builder of Jerusalem.',
        notes: 'Bracha 14 — Yerushalayim (Jerusalem). We pray for the rebuilding of Jerusalem and the Holy Temple — the heart of the Jewish people.',
      },

      // -- 15. Mashiach / David --
      {
        id: 'se-15-david',
        sortOrder: 16,
        hebrewText: 'אֶת צֶמַח דָּוִד עַבְדְּךָ מְהֵרָה תַצְמִיחַ וְקַרְנוֹ תָּרוּם בִּישׁוּעָתֶךָ כִּי לִישׁוּעָתְךָ קִוִּינוּ כָּל הַיּוֹם. בָּרוּךְ אַתָּה ה׳ מַצְמִיחַ קֶרֶן יְשׁוּעָה',
        transliteration: 'Et tzemach David avd\'cha m\'heirah tatzmi\'ach, v\'karno tarum bishuatecha, ki lishuatcha kivinu kol hayom. Baruch Atah Adonai, matzmi\'ach keren y\'shuah',
        translation: 'The offspring of Your servant David, speedily cause to flourish, and raise his pride through Your salvation, for we hope for Your salvation all day. Blessed are You, Lord, Who causes the pride of salvation to flourish.',
        notes: 'Bracha 15 — Malchut David (Davidic Kingdom). We pray for the coming of Mashiach (Messiah) from the line of King David.',
      },

      // -- 16. Shema Koleinu (Hear Our Prayer) --
      {
        id: 'se-16-shema-koleinu',
        sortOrder: 17,
        hebrewText: 'שְׁמַע קוֹלֵנוּ ה׳ אֱלֹקֵינוּ חוּס וְרַחֵם עָלֵינוּ וְקַבֵּל בְּרַחֲמִים וּבְרָצוֹן אֶת תְּפִלָּתֵנוּ כִּי אֵל שׁוֹמֵעַ תְּפִלּוֹת וְתַחֲנוּנִים אָתָּה וּמִלְּפָנֶיךָ מַלְכֵּנוּ רֵיקָם אַל תְּשִׁיבֵנוּ כִּי אַתָּה שׁוֹמֵעַ תְּפִלַּת כָּל פֶּה. בָּרוּךְ אַתָּה ה׳ שׁוֹמֵעַ תְּפִלָּה',
        transliteration: 'Sh\'ma koleinu Adonai Elokeinu, chus v\'racheim aleinu, v\'kabeil b\'rachamim uv\'ratzon et t\'filateinu, ki Eil shomei\'a t\'filot v\'tachanumim Atah, u\'mil\'fanecha Malkeinu reikam al t\'shiveinu, ki Atah shomei\'a t\'filat kol peh. Baruch Atah Adonai, shomei\'a t\'filah',
        translation: 'Hear our voice, Lord our God, have pity and compassion upon us, and accept our prayer with mercy and favor, for You are God Who hears prayers and supplications; and from before You, our King, do not turn us away empty-handed, for You hear the prayer of every mouth. Blessed are You, Lord, Who hears prayer.',
        notes: 'Bracha 16 — Shema Koleinu (Hear Our Voice). The last of the 13 middle requests. This is a good place to add any personal prayers in your own words.',
      },

      // -- 17. Avodah (Temple Service) --
      {
        id: 'se-17-avodah',
        sortOrder: 18,
        hebrewText: 'רְצֵה ה׳ אֱלֹקֵינוּ בְּעַמְּךָ יִשְׂרָאֵל וּבִתְפִלָּתָם וְהָשֵׁב אֶת הָעֲבוֹדָה לִדְבִיר בֵּיתֶךָ וְאִשֵּׁי יִשְׂרָאֵל וּתְפִלָּתָם בְּאַהֲבָה תְקַבֵּל בְּרָצוֹן וּתְהִי לְרָצוֹן תָּמִיד עֲבוֹדַת יִשְׂרָאֵל עַמֶּךָ. בָּרוּךְ אַתָּה ה׳ הַמַּחֲזִיר שְׁכִינָתוֹ לְצִיּוֹן',
        transliteration: 'R\'tzei Adonai Elokeinu b\'am\'cha Yisrael uvi\'t\'filatam, v\'hasheiv et ha\'avodah lidvir beitecha, v\'ishei Yisrael ut\'filatam b\'ahavah t\'kabeil b\'ratzon, us\'hi l\'ratzon tamid avodat Yisrael amecha. Baruch Atah Adonai, hamachazir sh\'chinato l\'Tzion',
        translation: 'Be favorable, Lord our God, toward Your people Israel and their prayer, and restore the service to the Holy of Holies in Your Temple; and the fire-offerings of Israel and their prayer accept with love and favor, and may the service of Your people Israel always be favorable. Blessed are You, Lord, Who restores His Presence to Zion.',
        notes: 'Bracha 17 — Avodah (Temple Service). First of the final three blessings (thanksgiving). We pray for the return of the Temple service.',
      },

      // -- 18. Hoda'ah (Thanksgiving) --
      {
        id: 'se-18-modim',
        sortOrder: 19,
        hebrewText: 'מוֹדִים אֲנַחְנוּ לָךְ שָׁאַתָּה הוּא ה׳ אֱלֹקֵינוּ וֵאלֹקֵי אֲבוֹתֵינוּ לְעוֹלָם וָעֶד צוּר חַיֵּינוּ מָגֵן יִשְׁעֵנוּ אַתָּה הוּא לְדוֹר וָדוֹר. נוֹדֶה לְּךָ וּנְסַפֵּר תְּהִלָּתֶךָ עַל חַיֵּינוּ הַמְּסוּרִים בְּיָדֶךָ וְעַל נִשְׁמוֹתֵינוּ הַפְּקוּדוֹת לָךְ וְעַל נִסֶּיךָ שֶׁבְּכָל יוֹם עִמָּנוּ וְעַל נִפְלְאוֹתֶיךָ וְטוֹבוֹתֶיךָ שֶׁבְּכָל עֵת עֶרֶב וָבֹקֶר וְצָהֳרָיִם. הַטּוֹב כִּי לֹא כָלוּ רַחֲמֶיךָ וְהַמְרַחֵם כִּי לֹא תַמּוּ חֲסָדֶיךָ מֵעוֹלָם קִוִּינוּ לָךְ',
        transliteration: 'Modim anachnu lach, sha\'Atah Hu Adonai Elokeinu v\'Elokei avoteinu l\'olam va\'ed, Tzur chayeinu, Magein yish\'einu, Atah Hu l\'dor vador. Nodeh l\'cha un\'sapeir t\'hilatecha, al chayeinu ham\'surim b\'yadecha, v\'al nishmoteinu hap\'kudot lach, v\'al nisecha sheb\'chol yom imanu, v\'al nifl\'otecha v\'tovotecha sheb\'chol eit, erev vavoker v\'tzohorayim. Hatov ki lo chalu rachamecha, v\'ham\'racheim ki lo tamu chasadecha, mei\'olam kivinu lach',
        translation: 'We give thanks to You, for You are the Lord our God and God of our fathers forever and ever. Rock of our lives, Shield of our salvation, You are He in every generation. We will thank You and tell Your praise — for our lives which are entrusted in Your hand, for our souls which are in Your charge, for Your miracles that are with us daily, and for Your wonders and goodness at all times — evening, morning, and afternoon. The Beneficent One, for Your mercies have not ended; the Compassionate One, for Your kindnesses have not ceased — we have always put our hope in You.',
        notes: 'Bracha 18 — Modim (Thanksgiving). We bow at the beginning. This is the moment to feel genuine gratitude for everything — every breath, every miracle we don\'t even notice.',
      },
      {
        id: 'se-18-modim-closing',
        sortOrder: 20,
        hebrewText: 'וְעַל כֻּלָּם יִתְבָּרַךְ וְיִתְרוֹמַם שִׁמְךָ מַלְכֵּנוּ תָּמִיד לְעוֹלָם וָעֶד. וְכֹל הַחַיִּים יוֹדוּךָ סֶּלָה וִיהַלְלוּ אֶת שִׁמְךָ בֶּאֱמֶת הָאֵל יְשׁוּעָתֵנוּ וְעֶזְרָתֵנוּ סֶלָה. בָּרוּךְ אַתָּה ה׳ הַטּוֹב שִׁמְךָ וּלְךָ נָאֶה לְהוֹדוֹת',
        transliteration: 'V\'al kulam yitbarach v\'yitromam shimcha Malkeinu tamid l\'olam va\'ed. V\'chol hachayim yoducha selah, vihal\'lu et shimcha be\'emet, ha\'Eil y\'shuateinu v\'ezrateinu selah. Baruch Atah Adonai, hatov shimcha ul\'cha na\'eh l\'hodot',
        translation: 'And for all these things may Your Name be blessed and exalted, our King, constantly, forever and ever. And all the living will thank You, Selah, and praise Your Name in truth, God of our salvation and help, Selah. Blessed are You, Lord, Whose Name is "The Beneficent One" and to Whom it is fitting to give thanks.',
        notes: 'Continuation of Modim — the closing of the thanksgiving bracha.',
      },

      // -- 19. Sim Shalom (Peace) --
      {
        id: 'se-19-shalom',
        sortOrder: 21,
        hebrewText: 'שִׂים שָׁלוֹם טוֹבָה וּבְרָכָה חֵן וָחֶסֶד וְרַחֲמִים עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל עַמֶּךָ. בָּרְכֵנוּ אָבִינוּ כֻּלָּנוּ כְּאֶחָד בְּאוֹר פָּנֶיךָ כִּי בְאוֹר פָּנֶיךָ נָתַתָּ לָּנוּ ה׳ אֱלֹקֵינוּ תּוֹרַת חַיִּים וְאַהֲבַת חֶסֶד וּצְדָקָה וּבְרָכָה וְרַחֲמִים וְחַיִּים וְשָׁלוֹם. וְטוֹב בְּעֵינֶיךָ לְבָרֵךְ אֶת עַמְּךָ יִשְׂרָאֵל בְּכָל עֵת וּבְכָל שָׁעָה בִּשְׁלוֹמֶךָ. בָּרוּךְ אַתָּה ה׳ הַמְבָרֵךְ אֶת עַמּוֹ יִשְׂרָאֵל בַּשָּׁלוֹם',
        transliteration: 'Sim shalom tovah uv\'rachah, chein vachesed v\'rachamim aleinu v\'al kol Yisrael amecha. Bar\'cheinu Avinu kulanu k\'echad b\'or panecha, ki v\'or panecha natata lanu Adonai Elokeinu Torat chayim v\'ahavat chesed, utz\'dakah uv\'rachah v\'rachamim v\'chayim v\'shalom. V\'tov b\'einecha l\'vareich et am\'cha Yisrael b\'chol eit uv\'chol sha\'ah bishlomecha. Baruch Atah Adonai, ham\'vareich et amo Yisrael bashalom',
        translation: 'Grant peace, goodness, and blessing, grace, kindness, and compassion upon us and upon all Israel Your people. Bless us, our Father, all of us as one, with the light of Your countenance, for by the light of Your countenance You gave us, Lord our God, the Torah of life and a love of kindness, righteousness, blessing, compassion, life, and peace. And may it be good in Your eyes to bless Your people Israel at every time and every hour with Your peace. Blessed are You, Lord, Who blesses His people Israel with peace.',
        notes: 'Bracha 19 — Sim Shalom (Peace). The final bracha. Peace is the vessel that holds all other blessings. At Mincha/Maariv some say "Shalom Rav" instead.',
      },

      // -- Closing --
      {
        id: 'se-closing',
        sortOrder: 22,
        hebrewText: 'אֱלֹקַי נְצוֹר לְשׁוֹנִי מֵרָע וּשְׂפָתַי מִדַּבֵּר מִרְמָה וְלִמְקַלְלַי נַפְשִׁי תִדֹּם וְנַפְשִׁי כֶּעָפָר לַכֹּל תִּהְיֶה. פְּתַח לִבִּי בְּתוֹרָתֶךָ וּבְמִצְוֹתֶיךָ תִּרְדּוֹף נַפְשִׁי',
        transliteration: 'Elokai, n\'tzor l\'shoni meira, us\'fatai midabeir mirmah, v\'limkal\'lai nafshi tidom, v\'nafshi ke\'afar lakol tih\'yeh. P\'tach libi b\'Toratecha, uv\'mitzvotecha tirdof nafshi',
        translation: 'My God, guard my tongue from evil and my lips from speaking deceitfully. To those who curse me, let my soul be silent; and let my soul be like dust to everyone. Open my heart to Your Torah, and let my soul pursue Your commandments.',
        notes: 'Personal prayer of Mar bar Ravina (Talmud Berachot 17a). A beautiful moment of personal reflection before stepping back.',
      },
      {
        id: 'se-yihyu',
        sortOrder: 23,
        hebrewText: 'יִהְיוּ לְרָצוֹן אִמְרֵי פִי וְהֶגְיוֹן לִבִּי לְפָנֶיךָ ה׳ צוּרִי וְגוֹאֲלִי',
        transliteration: 'Yih\'yu l\'ratzon imrei fi v\'hegyon libi l\'fanecha, Adonai Tzuri v\'Go\'ali',
        translation: 'May the words of my mouth and the meditation of my heart be acceptable before You, Lord, my Rock and my Redeemer',
        notes: 'From Psalm 19:15. After this, take three steps backward (left, right, left) as if departing from the King\'s presence.',
      },
      {
        id: 'se-oseh-shalom',
        sortOrder: 24,
        hebrewText: 'עֹשֶׂה שָׁלוֹם בִּמְרוֹמָיו הוּא יַעֲשֶׂה שָׁלוֹם עָלֵינוּ וְעַל כָּל יִשְׂרָאֵל וְאִמְרוּ אָמֵן',
        transliteration: 'Oseh shalom bimromav, Hu ya\'aseh shalom aleinu, v\'al kol Yisrael, v\'imru Amein',
        translation: 'He Who makes peace in His heavens, may He make peace upon us and upon all Israel, and say Amen',
        notes: 'The final words of the Amidah. Bow left, right, then forward. Take three steps back, then return to your place.',
      },
    ],
  },

  // ---- Aleinu ----
  {
    id: 'aleinu',
    slug: 'aleinu',
    nameHebrew: 'עָלֵינוּ',
    nameEnglish: 'Aleinu',
    category: 'tefillah',
    sortOrder: 5,
    whenSaid: 'At the conclusion of every prayer service (Shacharis, Mincha, and Maariv)',
    whySaid: 'Aleinu is our declaration of God\'s sovereignty over the entire world. It was originally composed by Joshua when entering the Land of Israel.',
    inspirationText: 'As you finish davening, Aleinu reminds you of the big picture — God is King over everything, and we have a unique role to play in that story.',
    requiredLevel: 6,
    estimatedReadSeconds: 60,
    sections: [
      {
        id: 'aleinu-1',
        sortOrder: 1,
        hebrewText: 'עָלֵינוּ לְשַׁבֵּחַ לַאֲדוֹן הַכֹּל לָתֵת גְּדֻלָּה לְיוֹצֵר בְּרֵאשִׁית שֶׁלֹּא עָשָׂנוּ כְּגוֹיֵי הָאֲרָצוֹת וְלֹא שָׂמָנוּ כְּמִשְׁפְּחוֹת הָאֲדָמָה שֶׁלֹּא שָׂם חֶלְקֵנוּ כָּהֶם וְגֹרָלֵנוּ כְּכָל הֲמוֹנָם',
        transliteration: 'Aleinu l\'shabei\'ach la\'Adon hakol, lateit g\'dulah l\'Yotzeir b\'reishit, shelo asanu k\'goyei ha\'aratzot, v\'lo samanu k\'mishp\'chot ha\'adamah, shelo sam chelkeinu kahem v\'goraleinu k\'chol hamonam',
        translation: 'It is upon us to praise the Master of all, to ascribe greatness to the Creator of the world, Who has not made us like the nations of the lands, and has not placed us like the families of the earth; Who has not assigned our portion like theirs, nor our lot like all their multitudes',
        notes: 'The first paragraph declares our unique relationship with Hashem.',
      },
      {
        id: 'aleinu-2',
        sortOrder: 2,
        hebrewText: 'וַאֲנַחְנוּ כּוֹרְעִים וּמִשְׁתַּחֲוִים וּמוֹדִים לִפְנֵי מֶלֶךְ מַלְכֵי הַמְּלָכִים הַקָּדוֹשׁ בָּרוּךְ הוּא',
        transliteration: 'Va\'anachnu kor\'im u\'mishtachavim u\'modim lifnei Melech Malchei Ham\'lachim, HaKadosh Baruch Hu',
        translation: 'And we bow and prostrate and give thanks before the King of Kings of Kings, the Holy One, blessed is He',
        notes: 'We bow during these words. Some communities fully bow (kneel), others bow from the waist.',
      },
      {
        id: 'aleinu-3',
        sortOrder: 3,
        hebrewText: 'שֶׁהוּא נוֹטֶה שָׁמַיִם וְיוֹסֵד אָרֶץ וּמוֹשַׁב יְקָרוֹ בַּשָּׁמַיִם מִמַּעַל וּשְׁכִינַת עֻזּוֹ בְּגָבְהֵי מְרוֹמִים. הוּא אֱלֹקֵינוּ אֵין עוֹד. אֱמֶת מַלְכֵּנוּ אֶפֶס זוּלָתוֹ',
        transliteration: 'Shehu noteh shamayim v\'yoseid aretz, u\'moshav y\'karo bashamayim mima\'al, ush\'chinat uzo b\'govhei m\'romim. Hu Elokeinu ein od. Emet Malkeinu efes zulato',
        translation: 'Who stretches out the heavens and establishes the earth, Whose seat of glory is in the heavens above, and Whose powerful Presence is in the loftiest heights. He is our God, there is no other. True is our King, there is nothing besides Him.',
        notes: 'A powerful affirmation that Hashem alone is God.',
      },
      {
        id: 'aleinu-4',
        sortOrder: 4,
        hebrewText: 'עַל כֵּן נְקַוֶּה לְּךָ ה׳ אֱלֹקֵינוּ לִרְאוֹת מְהֵרָה בְּתִפְאֶרֶת עֻזֶּךָ לְהַעֲבִיר גִּלּוּלִים מִן הָאָרֶץ וְהָאֱלִילִים כָּרוֹת יִכָּרֵתוּן לְתַקֵּן עוֹלָם בְּמַלְכוּת שַׁדַּי וְכָל בְּנֵי בָשָׂר יִקְרְאוּ בִשְׁמֶךָ',
        transliteration: 'Al kein n\'kaveh l\'cha Adonai Elokeinu lirot m\'heirah b\'tiferet uzecha, l\'ha\'avir gilulim min ha\'aretz, v\'ha\'elilim karot yikareitun, l\'takein olam b\'malchut Shakai, v\'chol b\'nei vasar yikr\'u vishmecha',
        translation: 'Therefore we put our hope in You, Lord our God, to soon see the glory of Your strength, to remove idols from the earth and false gods will be utterly cut off; to perfect the world through the Almighty\'s kingdom, and all humanity will call upon Your Name',
        notes: 'The second paragraph — our hope for the future. "L\'takein olam" (to perfect the world) is the source of the concept of "Tikkun Olam."',
      },
      {
        id: 'aleinu-5',
        sortOrder: 5,
        hebrewText: 'כִּי לְךָ תִּכְרַע כָּל בֶּרֶךְ תִּשָּׁבַע כָּל לָשׁוֹן. לְפָנֶיךָ ה׳ אֱלֹקֵינוּ יִכְרְעוּ וְיִפֹּלוּ וְלִכְבוֹד שִׁמְךָ יְקָר יִתֵּנוּ. וִיקַבְּלוּ כֻלָּם אֶת עֹל מַלְכוּתֶךָ וְתִמְלוֹךְ עֲלֵיהֶם מְהֵרָה לְעוֹלָם וָעֶד. כִּי הַמַּלְכוּת שֶׁלְּךָ הִיא וּלְעוֹלְמֵי עַד תִּמְלוֹךְ בְּכָבוֹד',
        transliteration: 'Ki l\'cha tichra kol berech, tishava kol lashon. L\'fanecha Adonai Elokeinu yichr\'u v\'yipolu, v\'lichvod shimcha y\'kar yiteinu. Vikab\'lu chulam et ol malchutecha, v\'timloch aleihem m\'heirah l\'olam va\'ed. Ki hamalchut shel\'cha hi, ul\'olmei ad timloch b\'chavod',
        translation: 'For to You every knee will bow, every tongue will swear. Before You, Lord our God, they will bow and fall, and to the glory of Your Name give honor. And they will all accept the yoke of Your kingdom, and You will reign over them speedily forever. For the kingdom is Yours, and for eternity You will reign in glory.',
        notes: 'The conclusion of Aleinu — a vision of universal recognition of God\'s sovereignty.',
      },
    ],
  },
];

// ==========================================
// BRACHOS — Blessings Over Food & Drink
// ==========================================

const BRACHOS: Prayer[] = [
  {
    id: 'hamotzi',
    slug: 'hamotzi',
    nameHebrew: 'הַמּוֹצִיא',
    nameEnglish: 'Hamotzi',
    category: 'brachot',
    sortOrder: 1,
    whenSaid: 'Before eating bread',
    whySaid: 'We acknowledge that everything we have — even our daily bread — comes from Hashem.',
    inspirationText: 'Before you take that first bite, pause. Recognize that this food traveled an incredible journey to reach your table — and behind it all is God\'s kindness.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'hamotzi-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
        notes: 'This is the standard bracha formula. You\'ll see it in almost every blessing!',
      },
      {
        id: 'hamotzi-2',
        sortOrder: 2,
        hebrewText: 'הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ',
        transliteration: 'Hamotzi lechem min ha\'aretz',
        translation: 'Who brings forth bread from the earth',
        notes: 'הַמּוֹצִיא = Who brings forth. לֶחֶם = bread. מִן הָאָרֶץ = from the earth.',
      },
    ],
  },
  {
    id: 'mezonot',
    slug: 'mezonot',
    nameHebrew: 'בּוֹרֵא מִינֵי מְזוֹנוֹת',
    nameEnglish: 'Mezonot',
    category: 'brachot',
    sortOrder: 2,
    whenSaid: 'Before eating baked goods, cake, cookies, pasta, cereal, and other grain products that are not bread',
    whySaid: 'We thank Hashem for creating various types of nourishing food from grain.',
    inspirationText: 'Cake, cookies, crackers, pretzels, pasta — anything made from grain that isn\'t bread gets this bracha. Grain is one of the most basic forms of sustenance.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'mezonot-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
      },
      {
        id: 'mezonot-2',
        sortOrder: 2,
        hebrewText: 'בּוֹרֵא מִינֵי מְזוֹנוֹת',
        transliteration: 'Borei minei m\'zonot',
        translation: 'Who creates various kinds of nourishment',
        notes: 'בּוֹרֵא = Who creates. מִינֵי = kinds/types of. מְזוֹנוֹת = nourishment/sustenance.',
      },
    ],
  },
  {
    id: 'hagafen',
    slug: 'hagafen',
    nameHebrew: 'בּוֹרֵא פְּרִי הַגָּפֶן',
    nameEnglish: 'Hagafen',
    category: 'brachot',
    sortOrder: 3,
    whenSaid: 'Before drinking wine or grape juice — including Kiddush on Shabbat and holidays',
    whySaid: 'Wine holds a special status in Judaism. It is used for Kiddush, Havdalah, weddings, and the Pesach Seder. We give it its own bracha.',
    inspirationText: 'Wine gladdens the heart (Psalm 104:15). From Kiddush to the Seder\'s four cups, wine marks our most sacred moments.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'hagafen-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
      },
      {
        id: 'hagafen-2',
        sortOrder: 2,
        hebrewText: 'בּוֹרֵא פְּרִי הַגָּפֶן',
        transliteration: 'Borei pri hagafen',
        translation: 'Who creates the fruit of the vine',
        notes: 'הַגָּפֶן = the vine (grapevine). This bracha covers wine and grape juice.',
      },
    ],
  },
  {
    id: 'ha-eitz',
    slug: 'ha-eitz',
    nameHebrew: 'בּוֹרֵא פְּרִי הָעֵץ',
    nameEnglish: 'Borei Pri Ha\'Eitz',
    category: 'brachot',
    sortOrder: 4,
    whenSaid: 'Before eating fruit that grows on trees (apples, oranges, grapes, etc.)',
    whySaid: 'We thank Hashem for creating the fruit of the tree.',
    inspirationText: 'Next time you bite into an apple, pause and say these words. You\'re acknowledging the incredible process — from seed to tree to fruit to your hand.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'ha-eitz-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
      },
      {
        id: 'ha-eitz-2',
        sortOrder: 2,
        hebrewText: 'בּוֹרֵא פְּרִי הָעֵץ',
        transliteration: 'Borei pri ha\'eitz',
        translation: 'Who creates the fruit of the tree',
        notes: 'בּוֹרֵא = Who creates. פְּרִי = fruit. הָעֵץ = the tree.',
      },
    ],
  },
  {
    id: 'ha-adamah',
    slug: 'ha-adamah',
    nameHebrew: 'בּוֹרֵא פְּרִי הָאֲדָמָה',
    nameEnglish: 'Borei Pri Ha\'Adamah',
    category: 'brachot',
    sortOrder: 5,
    whenSaid: 'Before eating vegetables and produce that grows from the ground',
    whySaid: 'We thank Hashem for creating the fruit of the earth.',
    inspirationText: 'Carrots, potatoes, tomatoes, lettuce — everything that grows from the ground gets this bracha.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'ha-adamah-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
      },
      {
        id: 'ha-adamah-2',
        sortOrder: 2,
        hebrewText: 'בּוֹרֵא פְּרִי הָאֲדָמָה',
        transliteration: 'Borei pri ha\'adamah',
        translation: 'Who creates the fruit of the earth',
        notes: 'הָאֲדָמָה = the earth/ground. Same formula as Ha\'Eitz but for ground-growing produce.',
      },
    ],
  },
  {
    id: 'shehakol',
    slug: 'shehakol',
    nameHebrew: 'שֶׁהַכֹּל',
    nameEnglish: 'Shehakol',
    category: 'brachot',
    sortOrder: 6,
    whenSaid: 'Before eating/drinking items like water, meat, eggs, candy, juice',
    whySaid: 'We recognize that everything in the world came into being through God\'s word.',
    inspirationText: 'This blessing covers almost everything — water, juice, meat, candy, eggs. When in doubt about which bracha to say, Shehakol has you covered.',
    requiredLevel: 2,
    estimatedReadSeconds: 8,
    sections: [
      {
        id: 'shehakol-1',
        sortOrder: 1,
        hebrewText: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם',
        transliteration: 'Baruch Atah Adonai Elokeinu Melech ha\'olam',
        translation: 'Blessed are You, Lord our God, King of the universe',
      },
      {
        id: 'shehakol-2',
        sortOrder: 2,
        hebrewText: 'שֶׁהַכֹּל נִהְיָה בִּדְבָרוֹ',
        transliteration: 'Shehakol nihyah bidvaro',
        translation: 'That everything came to be through His word',
        notes: 'שֶׁהַכֹּל = that everything. נִהְיָה = came to be. בִּדְבָרוֹ = through His word.',
      },
    ],
  },
];

// ==========================================
// Combined Export
// ==========================================

export const PRAYERS: Prayer[] = [...TEFILLAH_PRAYERS, ...BRACHOS];

export function getPrayerBySlug(slug: string): Prayer | undefined {
  return PRAYERS.find(p => p.slug === slug);
}

export function getPrayersByCategory(category: string): Prayer[] {
  return PRAYERS.filter(p => p.category === category).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getTefillahPrayers(): Prayer[] {
  return getPrayersByCategory('tefillah');
}

export function getBrachotPrayers(): Prayer[] {
  return getPrayersByCategory('brachot');
}
