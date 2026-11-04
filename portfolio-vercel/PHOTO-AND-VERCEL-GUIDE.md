# নিজের ছবি বসানো + আগের Vercel প্রজেক্টে নতুন পোর্টফোলিও বসানো

## সবচেয়ে সহজ উপায় — ছবিটা এই চ্যাটে পাঠিয়ে দিন

আপনি চাইলে আপনার পরিষ্কার half-body/full-body ছবিটা এখানে আপলোড করে দিন। আমি background remove করে, স্ক্রিনশটের মতো ডান পাশে 3D depth দিয়ে বসিয়ে আবার টেস্ট করে দেবো।

ভালো ফল পেতে ছবিটা এমন হলে ভালো:
- কোমর/বুক থেকে মাথা পর্যন্ত দেখা যায় এমন ছবি
- মুখ ও শরীর পরিষ্কার, ঝাপসা নয়
- পেছনে মানুষ/জিনিস কম
- সম্ভব হলে original quality

## নিজে ছবি বদলাতে চাইলে

সাইটের কোড এখন এই ফাইলটা খোঁজে:

```text
nadim-photo.png
```

1. ছবির background remove করুন (যেমন remove.bg বা Canva Background Remover)।
2. Transparent **PNG** হিসেবে ডাউনলোড করুন। সুপারিশকৃত সাইজ প্রায় **900 × 1250 px**।
3. ফাইলের নাম ঠিক এটা রাখুন: `nadim-photo.png`
4. GitHub রিপোতে ফাইলটা রাখুন এখানে:

```text
public/nadim-photo.png
```

5. Commit/Push করুন। Vercel নিজে থেকে নতুন deploy করে দেবে।
6. লাইভ সাইটে **Ctrl + F5** দিয়ে hard refresh করে দেখুন।

ডাউনলোড করা HTML ফাইলটা লোকালভাবে চালিয়ে ছবি দেখতে চাইলে `nadim-photo.png` ফাইলটাও সেই HTML-এর **একই ফোল্ডারে** রাখতে হবে।

> বর্তমানে placeholder হিসেবে একটি 1×1 transparent `nadim-photo.png` রাখা আছে। আসল ছবি না থাকলে সাইটে placeholder silhouette দেখাবে। একই নামের আসল PNG আপলোড করে overwrite করলেই আপনার ছবি আসবে।

---

## আগের GitHub + Vercel পোর্টফোলিওর জায়গায় নতুনটা বসানো

আপনার GitHub রিপো আগের Vercel প্রজেক্টের সঙ্গে linked থাকলে **নতুন Vercel প্রজেক্ট বানানোর দরকার নেই**। একই রিপোর ফাইল বদলে push করলেই একই domain/link-এ নতুন সাইট চলে আসবে।

### ধাপ ১ — আগেরটার backup রাখুন

GitHub রিপো থেকে আগের কোড ZIP ডাউনলোড করে রাখুন, অথবা একটি branch বানিয়ে রাখুন।

### ধাপ ২ — নতুন প্যাকেজ প্রস্তুত করুন

`portfolio-vercel.zip` ডাউনলোড করে unzip করুন। ভেতরে এমন থাকবে:

```text
public/
  index.html
  nadim-photo.png
api/
  contact.js
vercel.json
package.json
.env.example
.gitignore
README-DEPLOY.md
PHOTO-AND-VERCEL-GUIDE.md
```

### ধাপ ৩ — পুরোনো রিপোর ফাইল replace করুন

সবচেয়ে নির্ভরযোগ্য উপায় GitHub Desktop বা VS Code দিয়ে:

1. আগের রিপোটা clone করুন।
2. রিপো ফোল্ডারের ভেতরের পুরোনো tracked ফাইলগুলো মুছুন — তবে `.git` ফোল্ডার মুছবেন না।
3. Unzip করা নতুন প্যাকেজের **ভেতরের সব ফাইল/ফোল্ডার** রিপো ফোল্ডারে কপি করুন। ZIP ফাইলটা নিজে কপি করবেন না।
4. নিজের আসল ছবি থাকলে `public/nadim-photo.png` overwrite করুন।
5. Commit করুন: `Replace portfolio with new 3D portfolio`
6. **Push** করুন।

GitHub ওয়েবসাইট দিয়েও করা যায়: রিপোতে **Add file → Upload files**, তারপর নতুন ফাইলগুলো drag করে overwrite করুন। তবে পুরোনো root `index.html` বা পুরোনো `src/` থেকে গেলে conflict হতে পারে—সেগুলো মুছে দেওয়াই নিরাপদ।

### ধাপ ৪ — Vercel settings মিলিয়ে দেখুন

আগের Vercel প্রজেক্ট খুলে **Settings → Build and Deployment** (বা General/Build & Development) দেখুন:

- **Root Directory:** রিপোর root (খালি/`.`)
- **Framework Preset:** `Other`
- **Build Command:** খালি/None
- **Install Command:** খালি/None
- **Output Directory:** `public`

আগের প্রজেক্টের settings অন্যরকম থাকলে উপরের মতো করে Save করুন। এই প্যাকেজের `vercel.json`-এ framework, build/install command ও output directory (`public`) আগেই সেট করা আছে; তবু Root Directory ঠিক আছে কিনা ড্যাশবোর্ডে একবার দেখে নিন।

### ধাপ ৫ — Contact email-এর Environment Variables

**Settings → Environment Variables**-এ থাকতে হবে:

| Name | Value |
|---|---|
| `RESEND_API_KEY` | Resend-এর `re_...` API key |
| `CONTACT_TO_EMAIL` | যে Gmail-এ ক্লায়েন্টের মেসেজ পেতে চান |

Env var নতুন যোগ/বদল করলে **Deployments → সর্বশেষ deployment → ⋯ → Redeploy** করুন।

Resend key আগে না থাকলে: https://resend.com → Sign Up (যে Gmail-এ মেসেজ পেতে চান) → **API Keys → Create API Key**। Key কখনো GitHub-এ আপলোড করবেন না।

### ধাপ ৬ — Deploy ও টেস্ট

1. GitHub-এ push হলেই Vercel-এ **Deployments**-এ নতুন deployment শুরু হবে।
2. Status **Ready** হলে আপনার আগের domain/link খুলুন।
3. **Ctrl + F5** দিয়ে hard refresh করুন।
4. ছবি, গান, door room, AI এবং contact form একবার করে টেস্ট করুন।
5. Contact form থেকে নিজে একটি টেস্ট মেসেজ পাঠিয়ে Gmail inbox/spam দেখুন।

### সমস্যা হলে

- **আগের সাইটই দেখাচ্ছে:** Vercel Deployment Ready হয়েছে কিনা দেখুন, hard refresh করুন, আর নিশ্চিত করুন সঠিক GitHub রিপো/branch-এ push হয়েছে।
- **ছবি আসছে না:** ফাইলের নাম ও জায়গা ঠিক আছে কিনা দেখুন—`public/nadim-photo.png`। বড়/ছোট হাতের অক্ষরও মিলতে হবে।
- **404 আসছে:** Output Directory `public` আছে কিনা দেখুন।
- **ইমেইল যাচ্ছে না:** দুটি env var ঠিকমতো দেওয়ার পর Redeploy করেছেন কিনা দেখুন।
