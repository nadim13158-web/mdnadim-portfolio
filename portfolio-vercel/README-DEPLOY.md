# Vercel-এ ডিপ্লয় গাইড — Nadim Portfolio

এই ফোল্ডারের গঠন:
```
public/index.html   → পুরো ওয়েবসাইট (একটি ফাইল)
api/contact.js      → কন্টাক্ট ফর্মের ব্যাকএন্ড (ইমেইল পাঠায়)
vercel.json         → সিকিউরিটি হেডার
.env.example        → কোন সিক্রেট লাগবে তার তালিকা
```

## ধাপ ১ — Resend অ্যাকাউন্ট (ইমেইল পাঠানোর জন্য, ফ্রি)
1. https://resend.com এ যান → **Sign Up** করুন **সেই Gmail দিয়ে যেখানে ক্লায়েন্টের মেসেজ পেতে চান** (খুব জরুরি — নিচে কারণ)।
2. ড্যাশবোর্ডে **API Keys → Create API Key** → নাম দিন `portfolio` → আসে যাওয়া key-টি কপি করে রাখুন (`re_` দিয়ে শুরু)। এই key কাউকে দেবেন না, GitHub-এও আপলোড করবেন না।

> কেন একই Gmail? Resend-এর ফ্রি টেস্ট সেন্ডার শুধু আপনার Resend অ্যাকাউন্টের ইমেইলেই মেইল পাঠাতে পারে।
> পরে নিজের ডোমেইন কিনলে Resend-এ ডোমেইন ভেরিফাই করে `CONTACT_FROM_EMAIL` সেট করলেই প্রফেশনাল সেন্ডার হবে।

## ধাপ ২ — কোড GitHub-এ তুলুন
1. https://github.com এ নতুন রিপোজিটরি বানান, নাম দিন যেমন `Nadim-portfolio`।
2. এই ফোল্ডারের **ভেতরের সব ফাইল** (`public/`, `api/`, `vercel.json`, `package.json`, `.env.example`, `.gitignore`) আপলোড করুন (GitHub ওয়েবসাইটে "uploading an existing file" দিয়েও হবে)।

## ধাপ ৩ — Vercel-এ ডিপ্লয়
1. https://vercel.com → GitHub দিয়ে লগইন → **Add New… → Project** → আপনার রিপোটি **Import** করুন।
2. Framework Preset: **Other** (কিছু বদলানোর দরকার নেই) → **Deploy** চাপুন।
3. এক মিনিটেই সাইট লাইভ হবে (`*.vercel.app` ঠিকানায়)।

## ধাপ ৪ — ইমেইল চালু করুন (Environment Variables)
Vercel প্রজেক্টে **Settings → Environment Variables** এ গিয়ে যোগ করুন:
| Name | Value |
|---|---|
| `RESEND_API_KEY` | ধাপ ১-এর `re_...` key |
| `CONTACT_TO_EMAIL` | যে Gmail-এ মেসেজ পেতে চান |

তারপর **Deployments → সর্বশেষ ডিপ্লয়ের `⋯` → Redeploy** করুন (env var যোগের পর রি-ডিপ্লয় লাগে)।

## ধাপ ৫ — টেস্ট
লাইভ সাইটে গিয়ে কন্টাক্ট ফর্ম পূরণ করে পাঠান → "Thank you" মেসেজ আসবে → আপনার Gmail ইনবক্সে (স্প্যাম ফোল্ডারও দেখুন) মেইল পৌঁছাবে। **Reply** চাপলেই ক্লায়েন্টের ইমেইলে উত্তর যাবে।

## নোট
- এই প্রিভিউ/লোকাল ফাইলে ফর্ম পাঠালে ব্যাকএন্ড না থাকায় সাইট নিজে থেকেই আপনার ইমেইল অ্যাপ খুলে দেবে (ব্যাকআপ) — কোনো মেসেজ হারাবে না।
- সাইট আপডেট করতে চাইলে GitHub-এ ফাইল বদলালেই Vercel নিজে নিজে আবার ডিপ্লয় করে দেবে।
- নিরাপত্তা: ফর্মে honeypot + রেট-লিমিট + ভ্যালিডেশন আছে; API key শুধু Vercel-এর env-এ থাকে, ওয়েবসাইটের কোডে কখনোই নয়।
- কমান্ড লাইন পছন্দ হলে: এই ফোল্ডারে `npx vercel` চালালেও ডিপ্লয় হবে।


## নিজের ছবি যোগ করা (গুরুত্বপূর্ণ)

সবচেয়ে সহজ: ছবিটা চ্যাটে পাঠিয়ে দিলে background remove করে বসিয়ে দেওয়া হবে। নিজে করতে চাইলে transparent PNG বানিয়ে নাম দিন `nadim-photo.png` এবং GitHub-এ `public/nadim-photo.png` overwrite করে commit/push করুন। Vercel নিজে থেকে আবার deploy করবে। সুপারিশকৃত সাইজ প্রায় 900×1250 px।

## আগের linked GitHub + Vercel পোর্টফোলিও replace করতে

নতুন Vercel প্রজেক্ট বানানোর দরকার নেই। আগের রিপোর backup রেখে পুরোনো tracked ফাইল মুছে (`.git` রেখে) এই প্যাকেজের ভেতরের সব ফাইল কপি করে commit/push করুন। একই Vercel প্রজেক্ট ও domain-এ নতুন সাইট আসবে।

Vercel settings মিলিয়ে দেখুন: Root Directory = repo root, Framework = Other, Build/Install Command = খালি, Output Directory = `public`। তারপর Environment Variables-এ `RESEND_API_KEY` ও `CONTACT_TO_EMAIL` দিয়ে প্রয়োজনে Redeploy করুন।
