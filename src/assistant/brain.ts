import { PROFILE } from "./knowledge.js";

/* ============================================================
   INSTANT ANSWERS (AI key chara-o kaj kore)
   ------------------------------------------------------------
   Visitor er prosno bujhe English / বাংলা / Banglish e uttor dey.
   Shob uttor knowledge.js er shotti tottho theke — fake kichu na.
   ============================================================ */

export type Lang = "en" | "bn" | "bl";
export type ActionId = "contact" | "email" | "services" | "projects" | "skills" | "about" | "music";

type Intent =
  | "phone" | "pricing" | "payment" | "timeline" | "revisions" | "hire" | "projects" | "reviews"
  | "website" | "services" | "tools" | "education" | "experience" | "availability" | "location"
  | "music" | "siteHelp" | "about" | "identity" | "thanks" | "bye" | "greeting" | "fallback";

/** Order also breaks ties (earlier wins). */
const PRIORITY: Intent[] = [
  "phone", "pricing", "payment", "timeline", "revisions", "hire", "projects", "reviews", "website",
  "services", "tools", "education", "experience", "availability", "location", "music", "siteHelp",
  "about", "identity", "thanks", "bye", "greeting",
];
const SOCIAL: Intent[] = ["thanks", "bye", "greeting"];

const PATTERNS: Record<Exclude<Intent, "fallback">, RegExp[]> = {
  phone: [/\b(phone|number|whatsapp|whats app|imo|call|mobile|nombor|nambar)\b/, /ফোন|নম্বর|নাম্বার|হোয়াটসঅ্যাপ/],
  pricing: [/\b(price|prices|pricing|cost|costs|rate|rates|charge|charges|fee|fees|budget|how much|quote|quotation|cheap|expensive|afford|dam|daam|koto taka|koto nen|koto niben|koto lagbe|taka)\b/, /দাম|খরচ|কত টাকা|টাকা|রেট|বাজেট|চার্জ/],
  payment: [/\b(pay|payment|payments|bkash|bikash|nagad|rocket|paypal|bank|advance|invoice)\b/, /পেমেন্ট|বিকাশ|নগদ|রকেট|অগ্রিম|ব্যাংক/],
  timeline: [/\b(how long|deadline|deliver|delivery|turnaround|urgent|urgently|asap|how fast|how quick|koto din|kotodin|koydin|koy din|kobe|somoy lagbe|taratari)\b/, /কত দিন|কতদিন|সময় লাগ|ডেলিভারি|কবে|জরুরি|তাড়াতাড়ি/],
  revisions: [/\b(revision|revisions|revise|edit|edits|modify|correction|corrections|bodlate|change korte|change kora)\b/, /রিভিশন|পরিবর্তন|এডিট|সংশোধন/],
  hire: [/\b(hire|hiring|contact|reach|message|msg|inbox|email|e mail|mail|talk|book|work with|get in touch|order|start a project|jogajog|kaj dite|kaj dibo|kaj korate)\b/, /যোগাযোগ|মেসেজ|ইমেইল|কাজ দিতে|কাজ দেব|অর্ডার|হায়ার|কথা বলতে/],
  projects: [/\b(projects?|portfolio|samples?|examples?|previous work|past work|your work|his work|show me|nomuna|ager kaj)\b/, /প্রজেক্ট|নমুনা|স্যাম্পল|আগের কাজ|কাজ দেখ/],
  reviews: [/\b(reviews?|testimonials?|feedback|ratings?|trusted|trust)\b/, /রিভিউ|ফিডব্যাক|রেটিং/],
  website: [/\b(website|websites|web site|web page|webpage|landing page|web design|web development|coding|code|developer|develop|react|html|css|javascript|programming|wordpress|site banate|website banaben|app banate)\b/, /ওয়েবসাইট|ওয়েব সাইট|কোডিং|ডেভেলপ|প্রোগ্রামিং|সাইট বানা|অ্যাপ বানা/],
  services: [/\b(services?|offer|what (do|can|does) (you|he|nadim) (do|design|make|offer)|posters?|flyers?|banners?|logos?|brand|branding|social media|facebook post|instagram post|thumbnails?|ki ki|ki design|design koren|design korte paren|kaj koren)\b/, /সার্ভিস|কী কী|কি কি|ডিজাইন কর|পোস্টার|লোগো|ব্যানার|থাম্বনেইল|সোশ্যাল মিডিয়া|ফ্লায়ার/],
  tools: [/\b(tools?|software|softwares|photoshop|illustrator|figma|canva|adobe|corel|skills?)\b/, /সফটওয়্যার|টুল|ফটোশপ|ইলাস্ট্রেটর|ফিগমা|ক্যানভা|স্কিল/],
  education: [/\b(education|degree|university|college|school|study|studied|course|courses|certificate|certified|qualification|porashona|pora shona)\b/, /পড়াশোনা|ডিগ্রি|বিশ্ববিদ্যালয়|কলেজ|কোর্স|সার্টিফিকেট/],
  experience: [/\b(experience|experienced|how many years|years of|beginner|fresher|professional|expert|obhiggota|obhigota)\b/, /অভিজ্ঞতা|কত বছর|পেশাদার/],
  availability: [/\b(available|availability|free now|busy|open for work|taking new|accepting|start now|start today|free achen|kaj nicchen)\b/, /ফ্রি আছ|ব্যস্ত|কাজ নিচ্ছ|অ্যাভেইলেবল/],
  location: [/\b(where is he|where are you|location|located|country|bangladesh|dhaka|based|time ?zone|languages?|english|bangla|bengali|kothay thaken|kon desh)\b/, /কোথায় থাক|কোন দেশ|ভাষা|বাংলাদেশ|ঢাকা/],
  music: [/\b(music|songs?|gaan|gan|samar|jafri|player|soundtrack|audio)\b/, /গান|মিউজিক|সামার|জাফরি/],
  siteHelp: [/\b(how (do i|to|can i) use|navigate|navigation|this site|this website|this page|ei site|site ta|menu|themes?|colou?rs?|dark mode|buttons?|not working|where can i find|kivabe use|bujhi na|bujhtesi na|bujhte parchi na|bujhte parsi na|help)\b/, /ব্যবহার কর|বুঝতে পারছি না|বুঝি না|থিম|রং|রঙ|মেনু|সাহায্য|কাজ করছে না/],
  about: [/\b(who is (nadim|he)|about (nadim|him)|tell me about|introduce|introduction|biography|bio|background|nadim ke|nadim somporke|porichoy|unar somporke)\b/, /নাদিম কে|কে নাদিম|পরিচয়|সম্পর্কে/],
  identity: [/\b(are you (a |an )?(bot|ai|robot|human|real|nadim)|is this (a |an )?(bot|ai)|who are you|who am i talking to|tumi ke|apni ke|apni ki ai|apni ki nadim)\b/, /তুমি কে|আপনি কে|আপনি কি এআই|রোবট|আপনি কি নাদিম/],
  thanks: [/\b(thanks?|thank you|thx|tnx|tq|ty|dhonnobad|dhonnobaad|dhanyabad|shukriya)\b/, /ধন্যবাদ|থ্যাংক/],
  bye: [/\b(bye|goodbye|good bye|see you|allah hafez|khoda hafez|tata)\b/, /বিদায়|আল্লাহ হাফেজ|খোদা হাফেজ/],
  greeting: [/\b(hi+|hello+|hey+|hlw|helo|yo|salam|assalamu ?alaikum|asalamu ?alaikum|good (morning|afternoon|evening)|kemon achen|kemon acho|kemon aso|kemon asen)\b/, /হাই|হ্যালো|হেলো|সালাম|আসসালামু|কেমন আছ/],
};

const BANGLISH = /\b(ami|apni|apnar|apnake|tumi|tomar|tomake|amar|amake|kivabe|kibhabe|kemne|kemon|koto|kothay|korte|koren|korbo|korben|chai|chaichi|lagbe|hobe|ache|achen|asen|nai|nei|bhai|vai|valo|bhalo|dorkar|banate|banaben|parben|parbo|jogajog|daam|taka|bujhi|bujhte|bujhtesi|niben|nicchen|diben|dibo|jodi|theke|ekta|akta|unar|uni|janaben|ki ki)\b/;

const normalize = (t: string) =>
  t.toLowerCase().replace(/[?!.,;:()"'“”‘’`*_~\-–—/\\[\]{}<>|+=]/g, " ").replace(/\s+/g, " ").trim();

export function detectLang(text: string): Lang {
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  return BANGLISH.test(normalize(text)) ? "bl" : "en";
}

export function detectIntent(text: string): Intent {
  const t = normalize(text);
  const scores = new Map<Intent, number>();
  (Object.keys(PATTERNS) as Exclude<Intent, "fallback">[]).forEach((intent) => {
    const n = PATTERNS[intent].reduce((sum, re) => sum + (re.test(t) ? 1 : 0), 0);
    if (n) scores.set(intent, n);
  });
  const hasContent = [...scores.keys()].some((i) => !SOCIAL.includes(i));
  if (hasContent) SOCIAL.forEach((i) => scores.delete(i));
  let best: Intent = "fallback";
  let bestScore = 0;
  for (const intent of PRIORITY) {
    const s = scores.get(intent) || 0;
    if (s > bestScore) {
      best = intent;
      bestScore = s;
    }
  }
  return best;
}

const E = PROFILE.email;

/** Every answer, in English / Bangla / Banglish. Honest, from knowledge.js only. */
const ANSWERS: Record<Intent, { actions: ActionId[]; en: string; bl: string; bn: string }> = {
  greeting: {
    actions: ["services", "contact"],
    en: "Hi! I'm Nadim's AI assistant. I can tell you about his design services, how to hire him, or help you find your way around this site. What would you like to know?",
    bl: "Hi! Ami Nadim er AI assistant. Unar design service, kivabe kaj diben, ba ei site kivabe use korben — je kono kichu jiggesh korte paren.",
    bn: "হাই! আমি নাদিমের AI অ্যাসিস্ট্যান্ট। তার ডিজাইন সার্ভিস, কীভাবে কাজ দেবেন বা এই সাইট কীভাবে ব্যবহার করবেন — যেকোনো প্রশ্ন করতে পারেন।",
  },
  thanks: {
    actions: ["contact"],
    en: "You're welcome! Anything else I can help with? You can also message Nadim directly anytime.",
    bl: "Apnake o dhonnobad! Ar kichu janar thakle bolun — chaile Nadim ke shorashori message o dite paren.",
    bn: "আপনাকেও ধন্যবাদ! আর কিছু জানার থাকলে বলুন — চাইলে নাদিমকে সরাসরি মেসেজও দিতে পারেন।",
  },
  bye: {
    actions: [],
    en: "Thanks for stopping by! Whenever you need a design, Nadim is just one message away.",
    bl: "Ashar jonno dhonnobad! Kokhono design lagle Nadim ke ekta message dilei hobe.",
    bn: "আসার জন্য ধন্যবাদ! কখনো ডিজাইন লাগলে নাদিমকে একটা মেসেজ দিলেই হবে।",
  },
  identity: {
    actions: ["contact"],
    en: "I'm an AI assistant on Nadim's portfolio — not Nadim himself. I can answer questions about his work. For anything personal or important, send him a message and he'll reply directly.",
    bl: "Ami Nadim er portfolio te thaka ekta AI assistant — Nadim nije na. Unar kaj niye prosno korte paren. Personal ba joruri kichu hole unake message din, uni nijei uttor diben.",
    bn: "আমি নাদিমের পোর্টফোলিওর একটি AI অ্যাসিস্ট্যান্ট — নাদিম নিজে নই। তার কাজ নিয়ে প্রশ্ন করতে পারেন। ব্যক্তিগত বা জরুরি কিছু হলে তাকে মেসেজ দিন, তিনি নিজেই উত্তর দেবেন।",
  },
  about: {
    actions: ["about", "contact"],
    en: "Md Nadim Khondokar is a graphic designer from Bangladesh. He designs posters, social media content and simple brand marks, and he has just started learning front-end web development. This portfolio is his first big web project.",
    bl: "Md Nadim Khondokar Bangladesh er ekjon graphic designer. Uni poster, social media design ar simple logo banan, ar kichudin holo front-end web development shikha shuru korechen. Ei portfolio tai unar prothom boro web project.",
    bn: "মো. নাদিম খন্দকার বাংলাদেশের একজন গ্রাফিক ডিজাইনার। তিনি পোস্টার, সোশ্যাল মিডিয়া ডিজাইন আর সাধারণ লোগো তৈরি করেন, আর সম্প্রতি ফ্রন্ট-এন্ড ওয়েব ডেভেলপমেন্ট শেখা শুরু করেছেন। এই পোর্টফোলিওটাই তার প্রথম বড় ওয়েব প্রজেক্ট।",
  },
  services: {
    actions: ["services", "contact"],
    en: "Nadim can help you with:\n• Posters & flyers\n• Social media posts, stories & thumbnails\n• Simple logo concepts, colour palettes & font pairing\n• Simple web pages (he's still learning to code)\nTell him what you need and he'll reply with the details.",
    bl: "Nadim je kaj gulo korte paren:\n• Poster & flyer\n• Social media post, story & thumbnail\n• Simple logo concept, color palette & font pairing\n• Simple web page (coding ekhono shikhchen)\nApnar ki lagbe janiye message din, uni details janaben.",
    bn: "নাদিম যে কাজগুলো করেন:\n• পোস্টার ও ফ্লায়ার\n• সোশ্যাল মিডিয়া পোস্ট, স্টোরি ও থাম্বনেইল\n• সাধারণ লোগো, রঙের প্যালেট ও ফন্ট বাছাই\n• সাধারণ ওয়েব পেজ (কোডিং এখনো শিখছেন)\nআপনার কী লাগবে জানিয়ে মেসেজ দিন, তিনি বিস্তারিত জানাবেন।",
  },
  hire: {
    actions: ["contact", "email"],
    en: `Easiest way: tap “Send a message”. You write it right here on the site and it goes straight to Nadim's inbox — no email app needed. He usually replies within 24 hours. You can also email ${E}.`,
    bl: `Shobcheye shohoj: “Message pathan” button e chapun. Site er bhetorei likhte parben, ar message shorashori Nadim er inbox e jabe — kono email app lagbe na. Uni shadharonoto 24 ghontar moddhe uttor den. Chaile ${E} e email o korte paren.`,
    bn: `সবচেয়ে সহজ উপায়: “মেসেজ পাঠান” বাটনে চাপুন। সাইটের ভেতরেই লিখতে পারবেন, আর মেসেজ সরাসরি নাদিমের ইনবক্সে যাবে — কোনো ইমেইল অ্যাপ লাগবে না। তিনি সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দেন। চাইলে ${E} এ ইমেইলও করতে পারেন।`,
  },
  phone: {
    actions: ["contact", "email"],
    en: `There's no phone number listed on this site. The quickest way to reach Nadim is “Send a message” here, or email ${E}.`,
    bl: `Site e kono phone number dewa nai. Nadim ke paowar shobcheye druto upay holo ekhane “Message pathan”, ba ${E} e email.`,
    bn: `সাইটে কোনো ফোন নম্বর দেওয়া নেই। নাদিমকে পাওয়ার সবচেয়ে দ্রুত উপায় হলো এখানে “মেসেজ পাঠান”, অথবা ${E} এ ইমেইল।`,
  },
  pricing: {
    actions: ["contact"],
    en: "There's no fixed price list — it depends on what you need (type of design, how many, deadline). Send Nadim a short message with your idea and budget, and he'll reply with a quote.",
    bl: "Fixed kono price list nai — kon design, koyta, ar kobe lagbe tar upor dam nirbhor kore. Apnar idea ar budget likhe Nadim ke ekta message din, uni dam janiye diben.",
    bn: "নির্দিষ্ট কোনো দামের তালিকা নেই — কোন ডিজাইন, কয়টা আর কবে লাগবে তার ওপর দাম নির্ভর করে। আপনার আইডিয়া আর বাজেট লিখে নাদিমকে একটা মেসেজ দিন, তিনি দাম জানিয়ে দেবেন।",
  },
  payment: {
    actions: ["contact"],
    en: "Payment details are agreed directly with Nadim before the work starts, so everything is clear for both sides. Just ask him in your message.",
    bl: "Payment er bishoy kaj shuru korar age Nadim er sathe shorashori thik kora hoy, jate duijoner kachei shob clear thake. Message e jiggesh korun.",
    bn: "পেমেন্টের বিষয়টা কাজ শুরুর আগে নাদিমের সাথে সরাসরি ঠিক করা হয়, যাতে দুজনের কাছেই সব পরিষ্কার থাকে। মেসেজে জিজ্ঞেস করুন।",
  },
  timeline: {
    actions: ["contact"],
    en: "It depends on the project. Mention your deadline in your message and Nadim will tell you honestly whether he can make it.",
    bl: "Eta project er upor nirbhor kore. Message e apnar deadline likhun — Nadim shotti kore janaben uni shomoymoto korte parben kina.",
    bn: "এটা প্রজেক্টের ওপর নির্ভর করে। মেসেজে আপনার ডেডলাইন লিখুন — নাদিম সত্যি করে জানাবেন সময়মতো করতে পারবেন কিনা।",
  },
  revisions: {
    actions: ["contact"],
    en: "Changes and revisions are discussed with Nadim before the work starts. Ask him in your message so you both agree on it upfront.",
    bl: "Change ba revision er bishoy kaj shuru korar age Nadim er sathe kotha bole thik kora hoy. Message e jiggesh kore nin.",
    bn: "পরিবর্তন বা রিভিশনের বিষয়টা কাজ শুরুর আগে নাদিমের সাথে কথা বলে ঠিক করা হয়। মেসেজে জিজ্ঞেস করে নিন।",
  },
  tools: {
    actions: ["skills"],
    en: "For design, Nadim works with Photoshop, Illustrator, Figma and Canva. For the web, he's learning HTML, CSS, JavaScript and React.",
    bl: "Design er jonno Nadim Photoshop, Illustrator, Figma ar Canva use koren. Web er jonno uni HTML, CSS, JavaScript ar React shikhchen.",
    bn: "ডিজাইনের জন্য নাদিম Photoshop, Illustrator, Figma আর Canva ব্যবহার করেন। ওয়েবের জন্য তিনি HTML, CSS, JavaScript আর React শিখছেন।",
  },
  website: {
    actions: ["contact"],
    en: "Nadim has only just started learning web development — he can build simple, clean pages, and this portfolio is his first big project. For a bigger website, describe it in a message and he'll tell you honestly whether he can take it on.",
    bl: "Nadim matro web development shikha shuru korechen — simple, clean page banate paren, ar ei portfolio tai unar prothom boro project. Boro website lagle message e details likhun, uni shotti kore janaben kaj ta nite parben kina.",
    bn: "নাদিম সবে ওয়েব ডেভেলপমেন্ট শেখা শুরু করেছেন — সাধারণ, পরিচ্ছন্ন পেজ বানাতে পারেন, আর এই পোর্টফোলিওটাই তার প্রথম বড় প্রজেক্ট। বড় ওয়েবসাইট লাগলে মেসেজে বিস্তারিত লিখুন, তিনি সত্যি করে জানাবেন কাজটা নিতে পারবেন কিনা।",
  },
  projects: {
    actions: ["projects", "contact"],
    en: "His project gallery is still being built — he'd rather show nothing than show work that isn't his. If you want to see his style, you can request a sample design for your idea.",
    bl: "Unar project gallery ekhono toiri hocche — onner kaj nijer bole dekhanor cheye uni khali rakhai bhalo mone koren. Unar style dekhte chaile apnar idea diye ekta sample design chaite paren.",
    bn: "তার প্রজেক্ট গ্যালারি এখনো তৈরি হচ্ছে — অন্যের কাজ নিজের বলে দেখানোর চেয়ে তিনি খালি রাখাই ভালো মনে করেন। তার স্টাইল দেখতে চাইলে আপনার আইডিয়া দিয়ে একটা স্যাম্পল ডিজাইন চাইতে পারেন।",
  },
  reviews: {
    actions: ["contact"],
    en: "There are no client reviews on the site yet — Nadim chose not to show fake ones. You could be one of his first clients!",
    bl: "Site e ekhono kono client review nai — Nadim fake review dite chan ni. Apni unar prothom client der ekjon hote paren!",
    bn: "সাইটে এখনো কোনো ক্লায়েন্ট রিভিউ নেই — নাদিম ভুয়া রিভিউ দিতে চাননি। আপনিই হতে পারেন তার প্রথম ক্লায়েন্টদের একজন!",
  },
  education: {
    actions: ["contact"],
    en: "Nadim hasn't listed his education on this site. If it matters for your project, you can ask him directly.",
    bl: "Nadim ei site e unar porashonar tottho den ni. Apnar project er jonno joruri hole unake shorashori jiggesh korte paren.",
    bn: "নাদিম এই সাইটে তার পড়াশোনার তথ্য দেননি। আপনার প্রজেক্টের জন্য জরুরি হলে তাকে সরাসরি জিজ্ঞেস করতে পারেন।",
  },
  experience: {
    actions: ["contact"],
    en: "Nadim is at the start of his journey as a designer, and he has just started learning to code. He'd rather be honest than inflate numbers — the best way to judge his work is to ask for a sample.",
    bl: "Nadim designer hishebe ekhono shurur dike, ar coding shikha matro shuru korechen. Number baria bolar cheye uni shotti bola tai pochondo koren — unar kaj bujhar shobcheye bhalo upay holo ekta sample chawa.",
    bn: "নাদিম ডিজাইনার হিসেবে এখনো শুরুর দিকে, আর কোডিং শেখা সবে শুরু করেছেন। সংখ্যা বাড়িয়ে বলার চেয়ে তিনি সত্যি বলাটাই পছন্দ করেন — তার কাজ বোঝার সবচেয়ে ভালো উপায় হলো একটা স্যাম্পল চাওয়া।",
  },
  location: {
    actions: ["contact"],
    en: "Nadim is based in Bangladesh and works with clients online, so you can hire him from anywhere. You can write to him in English or Bangla.",
    bl: "Nadim Bangladesh e thaken ar online e kaj koren, tai je kono jayga theke unake kaj dite paren. English ba Bangla — je kono bhashay likhte paren.",
    bn: "নাদিম বাংলাদেশে থাকেন আর অনলাইনে কাজ করেন, তাই যেকোনো জায়গা থেকে তাকে কাজ দিতে পারেন। বাংলা বা ইংরেজি — যেকোনো ভাষায় লিখতে পারেন।",
  },
  availability: {
    actions: ["contact"],
    en: "Yes — he's currently open for design work. Send him a message with your project details to get started.",
    bl: "Ji — uni ekhon design er kaj nicchen. Project er details diye ekta message din.",
    bn: "জি — তিনি এখন ডিজাইনের কাজ নিচ্ছেন। প্রজেক্টের বিস্তারিত দিয়ে একটা মেসেজ দিন।",
  },
  music: {
    actions: ["music"],
    en: "That's Nadim's soundtrack: songs by Pakistani singer Samar Jafri. Open the Music section, or use the small player at the bottom-left and press play.",
    bl: "Eta Nadim er soundtrack: Pakistani singer Samar Jafri er gaan. Music section e jan, ba nicher bam dike chhoto player e play chapun.",
    bn: "এটা নাদিমের সাউন্ডট্র্যাক: পাকিস্তানি শিল্পী সামার জাফরির গান। Music সেকশনে যান, বা নিচে বাঁ দিকের ছোট প্লেয়ারে প্লে চাপুন।",
  },
  siteHelp: {
    actions: ["contact", "services"],
    en: "Here's a quick guide:\n• The menu at the top jumps to each section\n• “Let's talk” opens a message box — your message goes straight to Nadim\n• The round colour button at the bottom-right changes the site's colours\n• The music player plays his soundtrack\nWhat are you looking for?",
    bl: "Chhoto ekta guide:\n• Upore menu theke je kono section e jete parben\n• “Let's talk” chaple message box khule — message shorashori Nadim er kache jay\n• Nicher dan dike gol rong er button e site er rong bodlano jay\n• Music player e unar pochonder gaan baje\nApni ki khujchen?",
    bn: "ছোট একটা গাইড:\n• ওপরের মেনু থেকে যেকোনো সেকশনে যেতে পারবেন\n• “Let's talk” চাপলে মেসেজ বক্স খোলে — মেসেজ সরাসরি নাদিমের কাছে যায়\n• নিচে ডান দিকের গোল রঙের বাটনে সাইটের রং বদলানো যায়\n• মিউজিক প্লেয়ারে তার পছন্দের গান বাজে\nআপনি কী খুঁজছেন?",
  },
  fallback: {
    actions: ["contact"],
    en: "I'm not sure about that one, and I don't want to guess. Nadim can answer it directly — tap “Send a message” and he'll get back to you.",
    bl: "Eta niye ami nishchit na, ar onuman kore bolte chai na. Nadim nijei uttor dite parben — “Message pathan” e chapun, uni janaben.",
    bn: "এটা নিয়ে আমি নিশ্চিত নই, আর অনুমান করে বলতে চাই না। নাদিম নিজেই উত্তর দিতে পারবেন — “মেসেজ পাঠান” এ চাপুন, তিনি জানাবেন।",
  },
};

export interface LocalAnswer {
  text: string;
  actions: ActionId[];
  lang: Lang;
  intent: Intent;
}

export function answerLocally(question: string): LocalAnswer {
  const lang = detectLang(question);
  const intent = detectIntent(question);
  const a = ANSWERS[intent];
  return { text: a[lang], actions: a.actions, lang, intent };
}

/** Intents where a "Send a message" button always helps. */
export const CONTACT_INTENTS: string[] = [
  "hire", "phone", "pricing", "payment", "timeline", "revisions", "availability", "reviews", "projects", "website",
];

export const ACTION_LABELS: Record<ActionId, Record<Lang, string>> = {
  contact: { en: "Send a message", bl: "Message pathan", bn: "মেসেজ পাঠান" },
  email: { en: "Copy email", bl: "Email copy korun", bn: "ইমেইল কপি করুন" },
  services: { en: "See services", bl: "Service dekhun", bn: "সার্ভিস দেখুন" },
  projects: { en: "See work", bl: "Kaj dekhun", bn: "কাজ দেখুন" },
  skills: { en: "See skills", bl: "Skill dekhun", bn: "স্কিল দেখুন" },
  about: { en: "About Nadim", bl: "Nadim somporke", bn: "নাদিম সম্পর্কে" },
  music: { en: "Open music", bl: "Music e jan", bn: "মিউজিকে যান" },
};

export const COPIED_LABEL: Record<Lang, string> = { en: "Copied!", bl: "Copy hoyeche!", bn: "কপি হয়েছে!" };

export const WELCOME =
  "Hi! I'm Nadim's AI assistant. Ask me about his design services, how to hire him, or how this site works.\nবাংলায়ও প্রশ্ন করতে পারেন।";

export const SUGGESTIONS = [
  "What does Nadim design?",
  "How can I hire him?",
  "How much does it cost?",
  "Can he build a website?",
  "কীভাবে যোগাযোগ করব?",
];
