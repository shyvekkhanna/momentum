Momentum is an npm-workspaces monorepo: a Next.js web app plus a set of
platform-agnostic packages meant to be reused by a future Expo/React Native
app.

```
apps/
  web/                 Next.js App Router UI (moved from the repo root)
packages/
  types/                @momentum/types         — Task, ShoppingList, shared enums
  core/                 @momentum/core           — AI heuristics, task/shopping logic, stats, dates
  storage/              @momentum/storage        — StorageDriver abstraction + repositories
  notifications/        @momentum/notifications  — NotificationService abstraction + reminder scheduling
```

None of the packages touch a browser API directly. The web app is the only
place that does: `apps/web/lib/storage/webStorageDriver.ts` implements
`StorageDriver` with `window.localStorage`, and
`apps/web/lib/notifications/webNotificationService.ts` implements
`NotificationService` with the browser `Notification` API. A future Expo app
would add its own drivers (`AsyncStorage`, `expo-notifications`) and reuse
every package unchanged.

## Getting Started

Install dependencies once at the repo root (npm wires up the workspaces):

```bash
npm install
```

Then, from the root, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the dashboard by modifying `apps/web/app/page.tsx`. The page auto-updates as you edit the file.

Other useful root-level scripts: `npm run build`, `npm run lint`, `npm run typecheck` (runs `tsc --noEmit` across every package).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load Bricolage Grotesque.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
