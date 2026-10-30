# Md Nadim Khondokar — Portfolio

Personal portfolio website. Built with **React + Vite + Tailwind CSS + Three.js + Framer Motion**.

Contact form messages are delivered straight to **nadim13158@gmail.com** (no server needed).

---

## 1. Local-এ চালানো (VS Code)

```bash
npm install
npm run dev
```

Browser এ খুলুন → `http://localhost:5173`

> `dist/index.html` double-click করে খুলবেন না — তখন 3D আর music player কাজ করবে না।

Production build বানাতে:

```bash
npm run build
npm run preview
```

Build শেষে সব কিছু একটা মাত্র ফাইলে চলে আসে → **`dist/index.html`**

---

## 2. Contact Form Setup (জরুরি — message পেতে হলে)

Form টা কোথায় message পাঠাবে সেটা ঠিক করা আছে এই ফাইলে:
**`src/config/contact.ts`**

### Option A — Web3Forms (Recommended ✅)

সবচেয়ে নির্ভরযোগ্য। মাত্র ৩০ সেকেন্ড লাগে।

1. যান → <https://web3forms.com>
2. **"Access Key"** box এ লিখুন: `nadim13158@gmail.com`
3. **"Create Access Key"** click করুন
4. আপনার ইমেইলে access key চলে আসবে (যেমন `a1b2c3d4-xxxx-xxxx-xxxx`)
5. `src/config/contact.ts` খুলে সেই key বসান:

```ts
export const FORM_PROVIDER = "web3forms";
export const WEB3FORMS_ACCESS_KEY = "এখানে-আপনার-কী-বসান";
```

6. Save করে আবার build দিন → `npm run build`

### Option B — FormSubmit (কোনো key লাগে না)

```ts
export const FORM_PROVIDER = "formsubmit";
```

তারপর:
1. Site live করুন
2. Form থেকে **একটা test message** পাঠান
3. `nadim13158@gmail.com` এ activation mail আসবে
4. Mail এর **"Activate"** link এ click করুন — একবারই করতে হবে, permanent

> **Note:** Form কখনো visitor এর mail app বা অন্য কোনো app খোলে না — সব কাজ page এর ভিতরেই হয়।
> সব service fail করলে form শুধু "Try again" দেখায়। "Let's talk" button গুলো একই message pop-up খোলে।

---

## 3. Website Publish করার ৩টা উপায় (সব ফ্রি)

### 🥇 উপায় ১ — Netlify (সবচেয়ে সহজ, কোনো command লাগে না)

1. Terminal এ লিখুন:
   ```bash
   npm run build
   ```
2. Browser এ যান → <https://app.netlify.com/drop>
3. আপনার project folder এর ভিতরের **`dist`** folder টা mouse দিয়ে ধরে **drag করে ছেড়ে দিন**
4. ১০ সেকেন্ডে site live 🎉
5. Link পাবেন এমন: `https://random-name-123.netlify.app`

**নিজের নামের link চাইলে:** Netlify → Site settings → **Change site name** → `nadimkhondokar` লিখুন
→ Link হবে: `https://nadimkhondokar.netlify.app`

---

### 🥈 উপায় ২ — Vercel

> **Terminal ছাড়া সহজ উপায় (ছবি আর AI সহ):** `GUIDE.md` এর একদম উপরের অংশ দেখুন।
 (Auto-update সুবিধা সহ)

1. আপনার code টা GitHub এ push করুন:
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/আপনার-নাম/portfolio.git
   git push -u origin main
   ```
2. যান → <https://vercel.com> → **Continue with GitHub**
3. **"Add New" → "Project"** → আপনার `portfolio` repo টা **Import** করুন
4. কিছুই change করতে হবে না — Vercel নিজেই বুঝে নেয়
5. **"Deploy"** click করুন → ১ মিনিটে live ✅

**ভবিষ্যতে code change করলে:** শুধু `git push` দিন — Vercel নিজে থেকেই নতুন version live করে দেবে।

---

### 🥉 উপায় ৩ — GitHub Pages (সবকিছু GitHub এ রাখতে চাইলে)

1. GitHub এ নতুন repository খুলুন (নাম দিন `portfolio`)
2. Code push করুন (উপরের command গুলো দিয়ে)
3. Repo তে যান → **Settings → Pages**
4. **Source:** `Deploy from a branch`
5. **Branch:** `main` → কিন্তু folder এ `/root` এর বদলে `/docs` দরকার
6. তাই আগে একটা কাজ করুন — `package.json` এ build script টা এটা করুন:
   ```json
   "build": "vite build --outDir docs --base ./"
   ```
7. `npm run build` → `docs` folder তৈরি হবে → push করুন
8. Settings → Pages → Branch: `main`, folder: `/docs` → Save

Live হবে: `https://আপনার-নাম.github.io/portfolio/`

> ⚠️ GitHub Pages এ music player ঠিকমতো কাজ করাতে `base` setting দরকার, তাই Netlify বা Vercel বেশি সুবিধাজনক।

---

## 4. নিজের Domain (যেমন `nadimkhondokar.com`)

1. **Domain কিনুন:**
   - <https://www.namecheap.com> (~$10/বছর)
   - <https://domains.google.com>
   - বাংলাদেশ থেকে: <https://www.exonhost.com> বা <https://www.dhakawebhost.com>

2. **Netlify এ connect করুন:**
   - Netlify → Site settings → **Domain management** → **Add custom domain**
   - আপনার domain লিখুন → **Add domain**
   - Netlify যে ৪টা nameserver দেবে, সেগুলো domain provider এর **DNS settings** এ paste করুন
   - ২৪ ঘণ্টার মধ্যে চালু হয়ে যাবে (সাধারণত ১ ঘণ্টার মধ্যেই)

3. **HTTPS (চেক mark 🔒)** Netlify নিজে থেকেই ফ্রি SSL certificate দিয়ে দেয়।

---

## 5. সমস্যা হলে

| সমস্যা | সমাধান |
|---|---|
| Form থেকে message আসছে না | `src/config/contact.ts` এ access key ঠিক আছে কিনা দেখুন। FormSubmit হলে activation mail এ click করেছেন কিনা check করুন। Spam folder ও দেখুন। |
| `npm install` error | `node_modules` folder delete করে আবার `npm install` দিন। Node.js version 18+ লাগবে। |
| 3D / galaxy দেখাচ্ছে না | Browser এ hardware acceleration on করুন। Chrome: Settings → System → "Use hardware acceleration" |
| Music বাজছে না | Browser নিজে থেকে autoplay block করে। Play button এ click করতে হবে। |
| Mobile এ scroll ঠিক না | সর্বশেষ version এ ঠিক করা আছে। `npm run build` আবার দিন। |

---

## 6. ফাইল কোথায় কী আছে

```
api/
└── chat.js               ← AI assistant এর server (Vercel, Gemini key লাগে)
vercel.json             ← Vercel settings
src/
├── assistant/
│   ├── knowledge.js        ← AI কী কী জানে (শুধু সত্যি তথ্য)
│   ├── brain.ts            ← key ছাড়া instant উত্তর (English/বাংলা/Banglish)
│   └── client.ts           ← AI কে প্রশ্ন পাঠায়
├── assets/
│   └── profile/            ← আপনার ছবি এখানে রাখুন (passport crop অটো)
├── config/
│   ├── photo.ts            ← ছবির crop এর মাপ
│   └── contact.ts          ← Form কোথায় message পাঠাবে (এডিট করুন)
├── data/
│   ├── portfolioData.ts    ← আপনার নাম, skill, project, testimonial
│   └── music.ts            ← Playlist (YouTube video id)
├── components/
│   ├── Hero.tsx            ← প্রথম section (galaxy + নাম)
│   ├── About.tsx           ← নিজের সম্পর্কে
│   ├── Services.tsx        ← কী কী কাজ করেন
│   ├── ProjectCard.tsx     ← কাজের card (slide animation)
│   ├── Skills.tsx          ← Skill bar
│   ├── Projects.tsx        ← Portfolio grid
│   ├── Philosophy.tsx      ← আপনার কাজের নীতি
│   ├── Music.tsx           ← Samar Jafri playlist player
│   ├── Experience.tsx      ← Timeline
│   ├── Testimonials.tsx    ← Client feedback
│   ├── Contact.tsx         ← Contact form
│   ├── Footer.tsx
│   ├── MiniPlayer.tsx      ← Floating music player
│   ├── CustomCursor.tsx    ← Stardust cursor
│   ├── BackgroundFX.tsx    ← Star field + shooting stars
│   └── three/HeroScene.tsx ← 3D spiral galaxy
└── hooks/
    └── useContactSubmit.ts ← Form submit logic
```

---

## 7. Quick Checklist

- [ ] `npm install` দিয়ে dependencies নামিয়েছেন
- [ ] `src/config/contact.ts` এ access key / provider ঠিক করেছেন
- [ ] `src/data/portfolioData.ts` এ নিজের project এর real link বসিয়েছেন
- [ ] `src/data/portfolioData.ts` এ GitHub / LinkedIn / Facebook / WhatsApp link update করেছেন
- [ ] `npm run build` দিয়ে `dist` folder বানিয়েছেন
- [ ] Netlify / Vercel এ deploy করেছেন
- [ ] Live site থেকে নিজেকে একটা test message পাঠিয়েছেন ✅

---

**Made with React, Three.js & a lot of late nights.**
