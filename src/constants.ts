import { DocumentTypeOption, EarningTask } from './types';

export const SAMPLE_ID_IMAGE = '/src/assets/images/ethiopian_demo_id_1793349882840.jpg';
export const SAMPLE_SELFIE_IMAGE = '/src/assets/images/ethiopian_sample_selfie_1793349883592.jpg';
export const HERO_WORKSPACE_IMAGE = '/src/assets/images/ethiopian_digital_work_1793349883876.jpg';

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  {
    id: 'fayda',
    nameEn: 'Ethiopian Fayda National Digital ID',
    nameAm: 'የኢትዮጵያ ብሔራዊ የፋይዳ ዲጂታል መታወቂያ',
    nameOm: 'Waraqaa Eenyummaa Dijitaalaa Biyyoolessaa Faydaa Itoophiyaa',
    descriptionEn: 'National ID card with Fayda FIN number and QR code',
    descriptionAm: 'የፋይዳ ቁጥር እና የQR ኮድ ያለው ብሔራዊ ዲጂታል መታወቂያ',
    descriptionOm: 'Waraqaa eenyummaa biyyoolessaa lakkoofsa FIN Faydaa fi koodii QR qabu',
    issuingAuthority: 'National ID Program (NIDP)',
    issuingAuthorityOm: 'Sagantaa Eenyummaa Biyyoolessaa (NIDP)',
  },
  {
    id: 'kebele',
    nameEn: 'Kebele Resident ID Card',
    nameAm: 'የቀበሌ የነዋሪነት መታወቂያ ካርድ',
    nameOm: 'Waraqaa Eenyummaa Jiraattummaa Gandaa',
    descriptionEn: 'City administration or wereda resident identity card',
    descriptionAm: 'የክፍለ ከተማ ወይም የቀበሌ ነዋሪነት ማረጋገጫ ካርድ',
    descriptionOm: 'Waraqaa eenyummaa jiraattummaa bulchiinsa magaalaa ykn aanaatiin kennamu',
    issuingAuthority: 'City Administration / Woreda',
    issuingAuthorityOm: 'Bulchiinsa Magaalaa / Aanaa',
  },
  {
    id: 'passport',
    nameEn: 'Ethiopian Passport',
    nameAm: 'የኢትዮጵያ ፓስፖርት',
    nameOm: 'Paaspoortii Itoophiyaa',
    descriptionEn: 'Federal Democratic Republic of Ethiopia passport',
    descriptionAm: 'የኢትዮጵያ ፌዴራላዊ ዴሞክራሲያዊ ሪፐብሊክ ፓስፖርት',
    descriptionOm: 'Paaspoortii seera qabeessa Rippabiliika Dimokiraatawaa Federaalawaa Itoophiyaa',
    issuingAuthority: 'Immigration & Citizenship Service (ICS)',
    issuingAuthorityOm: 'Tajaajila Godaansaa fi Lammummaa (ICS)',
  },
  {
    id: 'license',
    nameEn: 'Driving License',
    nameAm: 'የመንጃ ፈቃድ',
    nameOm: 'Hayyama Konkolaachisummaa',
    descriptionEn: 'Federal or regional transport bureau driver license',
    descriptionAm: 'የትራንስፖርት እና ሎጂስቲክስ ሚኒስቴር የመንጃ ፈቃድ',
    descriptionOm: 'Hayyama konkolaachisummaa Biiroo Geejjibaatiin kennamu',
    issuingAuthority: 'Federal Transport Authority',
    issuingAuthorityOm: 'Abbaa Taayitaa Geejjiba Federaalaa',
  },
];

export const EARNING_TASKS: EarningTask[] = [
  {
    id: 'task-1',
    title: 'Online Tasks',
    titleAm: 'የመስመር ላይ ተግባራት (Online Tasks)',
    titleOm: 'Hojiiwwan Marsariitii (Online Tasks)',
    category: 'Micro-Surveys & Retail Data',
    categoryAm: 'የዳሰሳ ጥናትና የገበያ መረጃ ማረጋገጫ',
    categoryOm: 'Qorannoo Gabaa fi Mirkaneessa Odeeffannoo',
    shortDescription: 'Complete simple online activities.',
    shortDescriptionAm: 'ቀላል የመስመር ላይ ተግባራትን ያጠናቅቁ።',
    shortDescriptionOm: 'Hojiiwwan salphaa marsariitii xumuraa.',
    difficulty: 'Beginner',
    rewardEtb: 250,
    estMinutes: 3,
    requirements: [
      'Basic internet literacy & phone',
      'Accurate data input',
      'Verify Ethiopian retail item availability',
    ],
    requirementsAm: [
      'መሰረታዊ የስልክና የኢንተርኔት አጠቃቀም',
      'ትክክለኛ የመረጃ ግቤት',
      'በአካባቢዎ የሚገኙ ሸቀጦች መረጃ ማረጋገጥ',
    ],
    requirementsOm: [
      'Beekumsa bu\'uuraa bilbilaa fi intarneetii',
      'Galmee odeeffannoo sirrii',
      'Gatii fi jiraachuu meeshaalee gabaa keessatti mirkaneessuu',
    ],
    simulationData: {
      question: 'Verify the retail market price survey in Addis Ababa (Merkato/Bole)',
      questionAm: 'የአዲስ አበባ (መርካቶ/ቦሌ) የገበያ ዋጋ ቅኝት መረጃ ያረጋግጡ',
      questionOm: 'Qorannoo gatii gabaa Finfinnee (Bolee/Markaatoo) mirkaneessaa',
      context: 'Review a sample price submission for Ethiopian highland roasted coffee (500g): Reported at 380 ETB. Is this within current standard retail bounds?',
      contextAm: 'የ 500 ግራም የታሸገ የሀበሻ ቡና መረጃ ዋጋ 380 ብር ተመዝግቧል። ይህ ዋጋ ከመደበኛው የገበያ ዋጋ ጋር ይጣጣማል?',
      contextOm: 'Gatii buna Itoophiyaa wakkalame 500g qoradhaa: Gatiin gabaafame 380 ETB. Gatiin kun tilmaama gabaa ammayyaa waliin wal simataa?',
      options: [
        {
          id: 'opt-1',
          text: 'Valid & consistent with standard market price',
          textAm: 'ትክክለኛ እና ከመደበኛ የገበያ ዋጋ ጋር የሚጣጣም',
          textOm: 'Sirrii fi gatii gabaa beekamaa waliin kan wal simu',
          isCorrect: true,
        },
        {
          id: 'opt-2',
          text: 'Unrealistic outlier price',
          textAm: 'ከገበያው ያፈነገጠ ልክ ያልሆነ ዋጋ',
          textOm: 'Gatii gabaa irraa kan fagaate / dogoggora',
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 'task-2',
    title: 'AI Data Tasks',
    titleAm: 'የአርቴፊሻል ኢንተለጀንስ ዳታ ተግባራት (AI Data Tasks)',
    titleOm: 'Hojiiwwan Daataa AI (AI Data Tasks)',
    category: 'Amharic & Afan Oromo NLP Annotation',
    categoryAm: 'የአማርኛና ኦሮምኛ ንግግርና የጽሑፍ ዳታ ስያሜ',
    categoryOm: 'Sagalee fi Barreeffama Afaan Oromoo fi Amaaraa NLP',
    shortDescription: 'Participate in example AI data-labeling activities.',
    shortDescriptionAm: 'በአማርኛ እና ኦሮምኛ የድምፅና የጽሑፍ ዳታ ማሰልጠኛ ስራዎች ላይ ይሳተፉ።',
    shortDescriptionOm: 'Hojiiwwan daataa leenjii AI kan afaanota biyya keenyaa keessatti hirmaadhaa.',
    difficulty: 'Intermediate',
    rewardEtb: 650,
    estMinutes: 6,
    requirements: [
      'Proficiency in Afan Oromo or Amharic',
      'Attention to grammatical detail',
      'Audio clarity evaluation',
    ],
    requirementsAm: [
      'የአማርኛ ወይም አፋን ኦሮሞ ቋንቋ ችሎታ',
      'የሰዋሰውና የፊደላት ትክክለኛነት ማረጋገጥ',
      'የድምፅ ጥራትና አነባበብ መገምገም',
    ],
    requirementsOm: [
      'Dandeettii Afaan Oromoo ykn Amaaraa qabaachuu',
      'Sirrummaa seerluga barreeffamaa ilaaluu',
      'Qulqullina sagalee fi jechootaa qorachuu',
    ],
    simulationData: {
      question: 'Audio speech transcription validation for Ethiopian FinTech voice assistant',
      questionAm: 'የፋይናንስ ረዳት ድምፅን ወደ ጽሑፍ የመቀየር ትክክለኛነት ማረጋገጫ',
      questionOm: 'Sagalee gara barreeffamaatti jijjiiruu gargaaraa tekinoolojii kaffaltii FinTech mirkaneessaa',
      context: 'Spoken request: "Gara herrega Telebirr koo qarshii dhibba shan ergi" / "ወደ ቴሌብር ሒሳቤ አምስት መቶ ብር ላክ". Verify which transcription model output accurately matches without spelling errors:',
      contextAm: 'የተነገረው ድምፅ: "ወደ ቴሌብር ሒሳቤ አምስት መቶ ብር ላክ"። የትኛው የጽሑፍ ውጤት ትክክለኛ ነው?',
      contextOm: 'Sagalee dubbatame: "Gara herrega Telebirr koo qarshii dhibba shan ergi". Bu\'aan barreeffamaa isa kamtu sirrii dha?',
      options: [
        {
          id: 'opt-1',
          text: 'Gara herrega Telebirr koo qarshii dhibba shan ergi (Accurate transcription)',
          textAm: 'ወደ ቴሌብር ሒሳቤ አምስት መቶ ብር ላክ (ሙሉ በሙሉ ትክክል)',
          textOm: 'Gara herrega Telebirr koo qarshii dhibba shan ergi (Guutummaatti sirrii)',
          isCorrect: true,
        },
        {
          id: 'opt-2',
          text: 'Gara herrega Telebirr koo qarshii shantam ergi (Mismatched amount: 50 instead of 500)',
          textAm: 'ወደ ቴሌብር ሒሳቤ ሃምሳ ብር ላክ (የቁጥር ስህተት)',
          textOm: 'Gara herrega Telebirr koo qarshii shantam ergi (Lakkoofsi sirrii miti: 50 bakka 500)',
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 'task-3',
    title: 'Freelance Projects',
    titleAm: 'የፍሪላንስ ዲጂታል ፕሮጀክቶች (Freelance Projects)',
    titleOm: 'Pirojektoota Friilaansii (Freelance Projects)',
    category: 'Localization & Quality Assurance',
    categoryAm: 'የአፕሊኬሽኖች አካባቢያዊነትና ጥራት ፍተሻ',
    categoryOm: 'Afaanitti Hiikuu fi Qulqullina Sooftiweerii',
    shortDescription: 'Explore example digital work opportunities.',
    shortDescriptionAm: 'የዲጂታል ስራ ዕድሎችን ያስሱ እና ሙያዊ አስተዋጽኦ ያበርክቱ።',
    shortDescriptionOm: 'Carraawwan hojii dijitaalaa qoradhaa, dandeettii keessan gumaachaa.',
    difficulty: 'Advanced',
    rewardEtb: 2400,
    estMinutes: 12,
    requirements: [
      'Experience in software testing or localization',
      'Detailed bug reporting',
      'UI/UX consistency feedback',
    ],
    requirementsAm: [
      'በሶፍትዌር ፍተሻ ወይም ትርጉም ልምድ',
      'ግልጽ የቴክኒክ ሪፖርት ማዘጋጀት',
      'የተጠቃሚ ምቾት (UI/UX) አስተያየት መስጠት',
    ],
    requirementsOm: [
      'Muuxannoo sooftiweerii qorachuu ykn hiikkaa afaanii',
      'Gabaasa rakkoo teeknikaa ifa ta\'e qopheessuu',
      'Yaada mijaawina fayyadamaa (UI/UX) kennuu',
    ],
    simulationData: {
      question: 'Digital Payment UI Localization Audit for Ethiopian Merchants',
      questionAm: 'ለኢትዮጵያ ነጋዴዎች የተዘጋጀ የዲጂታል ክፍያ በይነ-ገጽ የትርጉም ፍተሻ',
      questionOm: 'Gulaallii afaanii kaffaltii dijitaalaa daldaltoota Itoophiyaaf qophaa\'e qoradhaa',
      context: 'Client requires an audit of the checkout button for Ethiopian Birr transactions. Which localized string follows established Ethiopian banking convention?',
      contextAm: 'በክፍያ ገጽ ላይ ለሚታየው ቁልፍ የትኛው አማርኛ አገላለጽ የባንኮች መደበኛ አሰራርን ያሟላል?',
      contextOm: 'Qophii bittaa kaffaltii keessatti, barreeffamni qabduu (button) kamtu seerluga kaffaltii baankota Itoophiyaa guuta?',
      options: [
        {
          id: 'opt-1',
          text: 'Karaa Telebirr / Baankii amansiisaadhaan kaffalaa (Pay securely via Telebirr / Bank)',
          textAm: 'በቴሌብር / በባንክ በደህንነት ይክፈሉ (ደህንነቱ የተረጋገጠ)',
          textOm: 'Karaa Telebirr / Baankii amansiisaadhaan kaffalaa (Seera qabeessa)',
          isCorrect: true,
        },
        {
          id: 'opt-2',
          text: 'Maallaqa asitti gadi dhiisi (Informal, non-banking terminology)',
          textAm: 'ገንዘብ ወደዚህ ቦታ ላክ (መደበኛ ያልሆነ ቋንቋ)',
          textOm: 'Maallaqa asitti gadi dhiisi (Jechoota seeraan alaa)',
          isCorrect: false,
        },
      ],
    },
  },
];

// The exact 3 payment methods specified by user:
// 1. Telebirr (ቴሌብር) - Ethio Telecom - Instant transfer (Daddarbaa battalaa)
// 2. CBE Birr / Baankii Daldala Itoophiyaa - Commercial Bank of Ethiopia (የኢትዮጵያ ንግድ ባንክ)
// 3. Bank of Abyssinia (Baankii Abisiiniyaa) - BOA Apollo / Digital
export const PAYMENT_METHODS = [
  {
    id: 'telebirr',
    name: 'Telebirr (ቴሌብር)',
    provider: 'Ethio Telecom',
    speed: 'Instant transfer (Daddarbaa battalaa)',
  },
  {
    id: 'cbe',
    name: 'CBE Birr / Baankii Daldala Itoophiyaa',
    provider: 'Commercial Bank of Ethiopia (የኢትዮጵያ ንግድ ባንክ)',
    speed: 'Direct Account Credit',
  },
  {
    id: 'abyssinia',
    name: 'Bank of Abyssinia (Baankii Abisiiniyaa)',
    provider: 'BOA Apollo / Digital',
    speed: 'Instant Credit / Apollo Digital',
  },
];
