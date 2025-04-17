This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

# 🧠 KnowledgeHub – Decentralized Knowledge Sharing Platform

Welcome to the official KnowledgeHub repository – a decentralized article publishing and review system powered by Web3.Storage, Supabase, WalletConnect, and Ethereum.

---

## ✅ Local Development Setup Guide

Follow these steps to set up the KnowledgeHub project on your local machine with your own accounts and configuration.

### 1. Clone the Repository

```
git clone https://github.com/VatsalBhavsar/KnowledgeHub.git
cd KnowledgeHub
```

### 2. Install Dependencies

Ensure you have Node.js v20+

```
npm install
```

### 3. Create Supabase Project

- Visit: https://supabase.com
- Create a new project
- Go to **Project → Settings → API**
  - Copy your **Project URL** and **anon public key**

#### Create a `drafts` table with the following fields:

| Field Name     | Type      | Notes |
|----------------|-----------|-------|
| id             | UUID (PK) | Primary key |
| title          | Text      |        |
| summary        | Text      |        |
| content        | Text      |        |
| tags           | Text[]    | Array of tags |
| author         | Text      |        |
| is_published   | Boolean   | Default: false |
| published_at   | Timestamp |        |
| status         | Text      | draft, under_review, approved, etc. |
| submitted_at   | Timestamp |        |
| reviewed_by    | Text[]    |        |
| ipfs_cid       | Text      |        |
| created_at     | Timestamp | Default: now() |

---

### 4. Create Web3.Storage Account

- Visit: https://web3.storage
- Sign up with your email
- No need to generate tokens manually (space created in-app)

---

### 5. Create WalletConnect Project

- Visit: https://cloud.walletconnect.com
- Create a project
- Copy:
  - **Project ID**
  - **Project Name**

---

### 6. Setup Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_WEB3_STORAGE_DID=did:key:xyz123 (get after test-setup)
NEXT_PUBLIC_GMAIL_ID=your-email@example.com

NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME=KnowledgeHub
```

---

### 7. Start Dev Server and Setup DID

```
npm run dev
```

- Open: http://localhost:3000/test-setup
- Verify your email
- A space will be created on Web3.Storage
- Copy the DID logged in console → update `.env.local`

---

### 8. TinyMCE Setup

This project uses **self-hosted TinyMCE**.

- No manual download needed
- Assets are copied from `node_modules` to `public/tinymce/`

Script in `package.json`:
```
"postinstall": "node scripts/copy-tinymce-assets.js"
```

---

### 9. Run the App

```
npm run dev
```

Visit: `http://localhost:3000`

---

### 10. Wallet & Auth

- Wallet connection is via **RainbowKit + Wagmi**
- Uses **Sepolia Testnet**
- Currently no smart contracts – used for identity association

---

Feel free to contribute or fork the project for custom enhancements.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
