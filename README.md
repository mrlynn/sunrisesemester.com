This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment variables

Copy `.env.example` to `.env.local` and fill in values. Core variables:

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection |
| `AUTH_SECRET` | Editor session JWT signing |
| `NEXT_PUBLIC_BASE_URL` | Public site URL for email links |

### Email (Gmail SMTP / App Password)

Subscribe confirmations, group updates, and anonymous report notifications use Gmail SMTP via nodemailer.

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST` | Usually `smtp.gmail.com` |
| `SMTP_PORT` | `465` (SSL) or `587` (STARTTLS) |
| `SMTP_USER` | Gmail address that owns the App Password |
| `SMTP_PASS` | Google App Password (16 characters, not the normal login password) |
| `FROM_EMAIL` | From header, e.g. `Sunrise Semester <sunrisesemesteraa@gmail.com>` |
| `REPORTS_TO_EMAIL` | Optional; defaults to `sunrisesemesteraa@gmail.com` |

**Setup:** Google Account → Security → 2-Step Verification → App passwords → create one for Mail, then set `SMTP_PASS` to that value in Vercel / `.env.local`.

# sunrisesemester.com
