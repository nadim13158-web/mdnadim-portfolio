# 🚀 আপনার Portfolio Guide (সহজ বাংলায়)

আপনার site: **https://mdnadim-portfolio.netlify.app**

---

# ⭐ Vercel এ Deploy (ছবি সহ) + AI Assistant — এখান থেকে শুরু করুন

Terminal, VS Code, coding — কিছুই লাগবে না। সব browser এ, mouse দিয়ে টেনে ছাড়া।
দুটো ফ্রি account লাগবে: **GitHub** (ফাইল রাখার জায়গা) আর **Vercel** (site চালানোর জায়গা)।
এই পথে site এর link **সবসময় একই থাকে**, আর পরে কিছু বদলালে নিজে থেকেই update হয়।

## ধাপ ১ — Folder ready করুন (২ মিনিট)
1. নতুন project টা download করুন → zip হলে right click → **Extract All**
2. Folder খুলুন — ভিতরে `package.json`, `src`, `api`, `index.html` দেখবেন
3. `node_modules` বা `dist` folder থাকলে **delete** করুন (Vercel নিজেই বানায়)
4. **📸 ছবি (টেস্ট করা ✅):** আপনার suit পরা ছবিটা copy করে এই folder এ paste করুন (`package.json` এর পাশে)
   - নাম যা খুশি হতে পারে (`photo.jpg`, `Nadim.png`, `IMG_2024.JPG` ...) — শুধু **একটা** ছবি রাখবেন
   - Site নিজেই passport size (35×45 mm) এ কেটে Hero, phone আর About এ বসাবে
   - imgbb.com এ upload করা ছবি দিয়ে পরীক্ষা করা হয়েছে — নাম যা হলেও কাজ করে

## ধাপ ২ — দুটো ফ্রি key নিন (৩ মিনিট)
- **Contact form key (জরুরি):** https://web3forms.com → বক্সে `nadim13158@gmail.com` → **Create Access Key** → Gmail এ key আসবে, copy করুন
- **AI key:** https://aistudio.google.com → Google দিয়ে login → **Get API key** → **Create API key** → copy করুন (`AIza...` দিয়ে শুরু)

## ধাপ ৩ — GitHub এ ফাইল তুলুন (৩ মিনিট)
1. https://github.com/signup → ফ্রি account খুলুন
2. উপরে ডান দিকে **+** → **New repository** → নাম: `mdnadim-portfolio` → **Public** → **Create repository**
3. যে page আসবে সেখানে লেখা **"uploading an existing file"** — ওই link এ click
4. আপনার project folder খুলুন → ভিতরে **সব** select করুন (`Ctrl + A`) → টেনে GitHub এর বক্সে ছেড়ে দিন
   ⚠️ বাইরের folder টা না — folder এর **ভিতরের** সব জিনিস (যাতে `package.json` একদম উপরে থাকে)
5. সব upload হলে নিচে সবুজ **Commit changes** চাপুন

## ধাপ ৪ — Vercel এ চালু করুন (২ মিনিট)
1. https://vercel.com/signup → **Hobby** (ফ্রি) → **Continue with GitHub**
2. **Add New…** → **Project** → `mdnadim-portfolio` এর পাশে **Import**
3. **Environment Variables** খুলে দুটো যোগ করুন (নাম হুবহু এভাবে, সব বড় হাতের অক্ষর):
   - Name: `VITE_WEB3FORMS_KEY` · Value: Web3Forms এর key → **Add**
   - Name: `GEMINI_API_KEY` · Value: Gemini এর key → **Add**
4. **Deploy** চাপুন → ১–২ মিনিট → 🎉 → link: `https://mdnadim-portfolio.vercel.app`

> Key দিতে ভুলে গেলে: Project → **Settings** → **Environment Variables** এ দিন →
> **Deployments** → উপরের deployment এর **⋯** → **Redeploy**

## ধাপ ৫ — পরীক্ষা করুন ✅
- **ছবি:** site খুলুন → PC তে ডান পাশে, phone এ "Hello, I'm" এর পাশে আপনার ছবি
- **AI:** browser এ খুলুন `https://mdnadim-portfolio.vercel.app/api/chat?test=1`
  - `"ai_working": true` → AI চালু 🎉 · `"missing"` → key দেওয়া হয়নি · `"not valid"` → key আবার copy করুন
- **AI Assistant:** 🤖 robot button চাপুন → প্রশ্ন করুন → উপরে **"Gemini AI · online"**
- **Message:** Let's talk → নিজের আসল নাম আর email দিয়ে message → Gmail এ আসবে (না পেলে **Spam** দেখুন)

## পরে কিছু বদলাতে চাইলে (link একই থাকবে)
1. আমাকে বলুন → নতুন project download করুন (ছবিটা আবার folder এ রাখুন)
2. GitHub → আপনার `mdnadim-portfolio` → **Add file** → **Upload files**
3. Folder এর ভিতরের সব টেনে ছেড়ে দিন → **Commit changes**
4. ১–২ মিনিটে Vercel নিজেই নতুন version চালু করবে — key আবার দিতে হবে না

## 🤖 AI Assistant
- PC: নিচে ডান দিকে robot button · Phone: উপরের bar এ robot button
- Robot চোখ টিপে (blink), mouse রাখলে হাসে (^ ^), উত্তর খোঁজার সময় চোখ এদিক-ওদিক করে
- Theme এর রং বদলালে robot এর চোখের রংও বদলায়
- English, বাংলা, Banglish — তিন ভাষাতেই উত্তর; শুধু সত্যি তথ্য (`src/assistant/knowledge.js`)
- Gemini key না থাকলেও বন্ধ হয় না — নিজে থেকে instant উত্তর দেয়

> **Vercel Drop** (vercel.com/drop) দিয়েও এক টানে চালু করা যায়, কিন্তু Vercel এর নিয়মে
> প্রতিবার drop করলে **নতুন project আর নতুন link** তৈরি হয়, key ও আবার দিতে হয়।
> তাই বারবার update করার জন্য উপরের GitHub পথই ভালো।
>
> নিচের "ভাগ ০" আর "ভাগ ১" শুধু **Netlify** ব্যবহার করলে কাজে লাগবে।

---

# ভাগ ০ — ছবি লাগানো (সবচেয়ে সহজ, কোনো coding লাগবে না)

VS Code, terminal, npm — কিছুই লাগবে না। শুধু folder আর Netlify।

**ধাপ ১ —** নতুন project টা download করুন (আগের মতো)। zip হলে: right click → **Extract All** → **Extract**

**ধাপ ২ —** ভিতরের **`dist`** folder টা খুলুন। ভিতরে শুধু একটা file আছে: `index.html`

**ধাপ ৩ —** আপনার suit পরা ছবিটা copy করে এই `dist` folder এ paste করুন।
তারপর ছবির উপর right click → **Rename** → লিখুন **`photo`** → Enter
(Windows "Are you sure?" জিজ্ঞেস করলে **Yes**)

```
dist
├── index.html
└── photo.jpg      ← আপনার ছবি
```

**ধাপ ৪ — Netlify তে (একবারই):**
1. https://app.netlify.com → login → **mdnadim-portfolio** এ click
2. বাম দিকে **Forms** → **Enable form detection** click করুন
   (এটা না করলে contact form এর message আসে না)

**ধাপ ৫ — Upload:**
1. বাম দিকে **Deploys** এ যান
2. নিচে নামুন — একটা বক্স দেখবেন: *"Drag and drop your site output folder here"*
3. পুরো **`dist`** folder টা mouse দিয়ে টেনে ওই বক্সে ছেড়ে দিন
4. ১ মিনিট অপেক্ষা → **Published** লেখা আসবে → site খুলে refresh করুন ✅

> ⚠️ `app.netlify.com/drop` এ ছাড়বেন না — ওখানে ছাড়লে **নতুন** site আর নতুন link তৈরি হয়।
> আপনার পুরনো link আপডেট করতে সবসময় **Deploys** page এর বক্সে ছাড়বেন।

### নাম নিয়ে চিন্তা নেই
`photo`, `photo.jpg`, `photo.png`, এমনকি ভুল করে `photo.jpg.jpg` হলেও — site নিজে খুঁজে নেয়।
ছবি না থাকলে site আগের মতো "NK" design দেখায়, কিছু ভাঙে না।

### ছবি পরে বদলাতে চাইলে
নতুন ছবিটা একই নামে (`photo`) `dist` folder এ রেখে, আবার ধাপ ৫ করুন।

### Crop
চ্যাটে দেওয়া ৩টা suit পরা ছবির (652×800, 712×809, 748×1402) মুখের জায়গা আগে থেকেই বসানো।
Code নিজেই passport size (35×45 mm) বানায় — PC তে ডান পাশে ID card, phone এ "Hello, I'm" এর পাশে ছোট ছবি, About এ বড় portrait।
সম্পূর্ণ অন্য ছবি দিলে `src/config/photo.ts` এ `FACE_OVERRIDE` দিতে হবে (বা আমাকে বলুন)।

### একদমই না পারলে
https://imgbb.com এ ছবি upload করে `.jpg` দিয়ে শেষ হওয়া link টা আমাকে দিন — আমি বসিয়ে দেব।
তারপর শুধু ধাপ ৪-৫ করবেন।

> (developer দের জন্য: `src/assets/profile/` এ ছবি রেখে `npm run build` দিলে ছবি `index.html` এর ভিতরে ঢুকে যায় — সেটাই অগ্রাধিকার পায়।)

---

# ভাগ ১ — Message সরাসরি Gmail এ পাওয়া (একবারই করতে হবে)

এখন কেউ **"Let's talk"** বা যেকোনো message button এ চাপলে **site এর ভিতরেই** message box খোলে —
phone এর mail / message app খোলে না। Visitor লিখে **Send** চাপলেই message যায় Netlify তে,
আর Netlify সেটা আপনার Gmail এ পাঠায়। Email এ চাপলে email টা শুধু **copy** হয়, কোনো app খোলে না।

এর জন্য Netlify তে **৩টা কাজ একবার** করুন:

**কাজ ১ — Form চালু করা**
1. https://app.netlify.com → login → **mdnadim-portfolio** এ click
2. বাম দিকে **Forms** → **Enable form detection** click

**কাজ ২ — নতুন version upload** (কাজ ১ এর পরেই করতে হবে)
1. বাম দিকে **Deploys** → নিচের বক্সে পুরো **`dist`** folder টেনে ছেড়ে দিন
2. **Published** লেখা আসা পর্যন্ত অপেক্ষা করুন

**কাজ ৩ — Gmail এ message আসার ব্যবস্থা**
1. বাম দিকে **Forms** → **Submission notifications** (কোথাও "Form notifications" লেখা থাকে)
2. **Add notification** → **Email notification**
3. Event: **New form submission** · Email: `nadim13158@gmail.com` · Form: **Any form**
4. **Save**

> খুঁজে না পেলে: **Project configuration → Notifications → Emails and webhooks → Form submission notifications**

### পরীক্ষা করুন
- নিজের site খুলুন → **Let's talk** → আসল নাম আর আসল email দিয়ে একটা message পাঠান
  (`test@test.com` এর মতো ভুয়া email দিলে Netlify সেটাকে spam ধরে ফেলে)
- ১–২ মিনিটের মধ্যে Gmail এ আসবে (পাঠায় `formresponses@netlify.com`) — না পেলে **Spam** folder দেখুন
- Gmail এ **Reply** চাপলেই উত্তর সরাসরি যে message দিয়েছে তার কাছে চলে যাবে
- সব message Netlify তে **Forms → contact** এও জমা থাকে

### "Your message couldn't be sent" দেখালে
কাজ ১ আর কাজ ২ হয়নি — form চালু করে আবার `dist` upload করুন।
(আগে এই অবস্থায় site ভুল করে "Message sent" দেখাত কিন্তু কিছুই যেত না — সেটা ঠিক করা হয়েছে।)

---

# ভাগ ২ — Portfolio তে Change করার নিয়ম

### কোন file খুললে কী পাবেন

| যা বদলাতে চান | কোন file খুলবেন |
|---|---|
| আপনার ছবি | Vercel: যেকোনো নামে main folder এ (`package.json` এর পাশে) · Netlify: `dist` folder এ `photo` নামে |
| AI assistant এর তথ্য | `src/assistant/knowledge.js` |
| ছবির crop (passport size) | `src/config/photo.ts` |
| আপনার নাম, ইমেইল, skill, project list, client review | `src/data/portfolioData.ts` |
| গান বদলানো / নতুন গান যোগ | `src/data/music.ts` |
| Form কোথায় message পাঠাবে | `src/config/contact.ts` |
| Color / theme বদলানো | `src/context/ThemeContext.tsx` |
| Design বা layout | `src/components/` folder |

### উদাহরণ ১ — নিজের project যোগ করা

`src/data/portfolioData.ts` খুলুন। নিচের অংশ খুঁজুন:

```ts
export const projects: { ... }[] = [
  // Nijer design add korle ekhane likhun...
];
```

`[` আর `]` এর মাঝে এভাবে লিখুন (আগের লাইনের শেষে কমা `,` দিতে ভুলবেন না):

```ts
export const projects = [
  {
    title: "River Sunset Poster",
    description: "A poster I made practising gradient blending and typography.",
    tags: ["Poster", "Practice"],
    live: "#",
    code: "#",
    year: "2026",
  },
  {
    title: "Second design name",
    description: "Another design you made.",
    tags: ["Social Media", "Practice"],
    live: "#",
    code: "#",
    year: "2026",
  },
];
```

> দুটো বা চারটা project দিলে layout সবচেয়ে ভালো দেখাবে (২ column এ জোড়ায় জোড়ায়)।

**Project-এর ছবি বসাতে চাইলে:** আপনার design-এর ফাইল বা link আমাকে দিন, আমি card-এ বসিয়ে দেব।

---

### উদাহরণ ২ — প্রথম client review যোগ করা

`src/data/portfolioData.ts` এ খুঁজুন:

```ts
export const testimonials: { ... }[] = [];
```

`[` আর `]` এর মাঝে লিখুন:

```ts
export const testimonials = [
  {
    name: "Client er naam",
    role: "Ki kore, ba kon dokaan",
    quote: "Client ja boleche seta hübahu liple diye likhun.",
  },
];
```

একবার review add করলেই section টা নিজে থেকেই slider হয়ে যাবে।

---

### উদাহরণ ৩ — Skill এর নাম বা group বদলানো

```ts
export const skills = [
  { name: "Photoshop", level: 0, group: "Design tools" },
  { name: "After Effects", level: 0, group: "Motion" },   // notun skill
];
```

`group` এর নাম বদলালে নতুন card নিজে থেকেই তৈরি হবে।
`level` এখন কোনো কাজে লাগে না (আমি ভুয়া % bar বাদ দিয়েছি)।

### উদাহরণ — নিজের WhatsApp link বসানো

`src/data/portfolioData.ts` এ খুঁজুন:

```ts
{ name: "WhatsApp", url: "https://wa.me/", icon: "whatsapp" },
```

`https://wa.me/` এর পরে নিজের number লিখুন (country code সহ, কোনো + বা space ছাড়া):

```ts
{ name: "WhatsApp", url: "https://wa.me/8801XXXXXXXXX", icon: "whatsapp" },
```

একইভাবে GitHub, LinkedIn, Facebook এর link ও বসিয়ে দিন।

### Change করার পর যা করবেন (প্রতিবার)

```bash
npm run build
```

তারপর নতুন `dist` folder টা Netlify তে drag করে ছাড়ুন। মাত্র ১০ সেকেন্ড।

---

# ভাগ ৩ — আমাকে দিয়ে করাতে চাইলে (সবচেয়ে সহজ)

Code নিজে না বদলে আমাকে শুধু বলুন কী change চান। যেমন:

- "এই project টা add করো, ছবি এই" (file attach করে দিলে আরও ভালো)
- "WhatsApp number বসাও: 8801XXXXXXXXX"
- "Color টা বদলাও, নীল চাই"
- "আমার ছবি hero তে বসাও"

আমি change করে দেব, আপনি শুধু `npm run build` করে `dist` folder Netlify তে drag করবেন।

---

# ভাগ ৪ — ছোট কিছু টিপস

**নিজের domain চাইলে** (`nadimkhondokar.com`):
1. https://www.namecheap.com থেকে কিনুন (~$10/বছর)
2. Netlify → Site configuration → **Domain management** → **Add a domain**
3. Netlify যে nameserver দেবে সেটা Namecheap এর DNS এ বসান
4. HTTPS (🔒) Netlify নিজে থেকেই ফ্রি দেয়

**Project এর ছবি বসাতে চাইলে:**
আপনার design গুলো আমাকে দিন, আমি card গুলোতে বসিয়ে দেব।
(এখন card গুলোতে code দিয়ে বানানো mockup design আছে)

**ভবিষ্যতে যা যোগ করতে পারি:**
- Resume/CV download button
- Blog section
- বাংলা / English language toggle
- Project ছবির slideshow
- Visitor counter

---

# ভাগ ৫ — Mobile আর Lag ঠিক করা হয়েছে

আপনি যে সমস্যাগুলো বলেছিলেন, সেগুলোর কারণ ধরে ঠিক করে দিয়েছি:

| সমস্যা ছিল | কারণ ছিল | এখন |
|---|---|---|
| Mobile এ ঠিকমতো চলত না | ১১,০০০টা 3D particle mobile এ অনেক ভারী ছিল | Mobile এ এখন ৩,৮০০টা — অনেক হালকা |
| Onek lagi legi (lag) | প্রতি আধা সেকেন্ডে পুরো site re-render হতো (3D canvas সহ) | Progress আলাদা ভাবে update হয়, তাই 3D আর নড়ে না |
| Background ভারী ছিল | অনেক বেশি blur আর তারা | Mobile এ blur ও তারা কমানো হয়েছে |
| গান চলত না / tap কাজ করত না | Video টা ছবির নিচে চাপা পড়ত | Video এখন উপরে, mobile এ YouTube এর নিজের control ও আছে |
| Button এ নীল দাগ পড়ত | Mobile tap highlight | বন্ধ করা হয়েছে |
| নিচের player বাইরে চলে যেত | iPhone এর safe area ধরা ছিল না | এখন safe area মেনে চলে |

**গুরুত্বপূর্ণ:** নতুন version টা দেখতে হলে অবশ্যই আবার `dist` folder Netlify তে upload করতে হবে। তারপর mobile এ গিয়ে দেখুন — browser এর cache থাকতে পারে, তাই একবার refresh করে নিন।

---

# সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| Form থেকে message আসছে না | উপরের **ভাগ ১** এর ৩টা কাজ করেছেন কিনা দেখুন। Gmail এর **spam folder** ও check করুন। Netlify → Forms tab এ ঢুকে দেখুন message আছে কিনা। |
| `npm run build` error দিচ্ছে | `node_modules` folder delete করে আবার `npm install` দিন। |
| Galaxy / 3D দেখাচ্ছে না | Browser এ hardware acceleration on করুন। |
| Music বাজছে না | Browser autoplay block করে, তাই ▶ button এ click করতে হবে। |
| Netlify এ upload হচ্ছে না | `dist` folder এর ভিতরে `index.html` আছে কিনা দেখুন (folder এর ভিতরের file গুলো দিতে হবে, folder টা না)। |

---

**আপনার Portfolio · Md Nadim Khondokar · nadim13158@gmail.com**
