# Finch Demo Next.js

> A project that shows how to programatically interact with [Finch's APIs](https://developer.tryfinch.com/docs/reference/0c7c919255262-api-reference).

Integrating Finch with your frontend and backend can be daunting. Managing access tokens, handling `null` data, knowing which API endpoints to call when, etc. This sample application is meant to help you get started to see how an application can properly implement Finch. Start by running the application locally on your computer and then search through the code for any pages or components that you find interesting.

Since Finch requires having a frontend and a backend (for application security reasons), Next.js is perfect platform since it bundles a React client-side frontend with a server-side backend API running as serverless functions.

## 🖥️ Live Demo

[https://finch-demo-nextjs.vercel.app/](https://finch-demo-nextjs.vercel.app/)

## 🚀 Getting Started

### Prerequisites

There are a few things you will need setup before getting started:

1. Create a Redis Database via Upstash

## How to use

You need both `FINCH_CLIENT_ID` and `NEXT_PUBLIC_FINCH_CLIENT_ID` so that it can be used on Next.js frontend and Next.js backend.

Uses SWR to fetch api requests. A global fetcher function is used which includes a progress bar when loading. Editable in components/layout.tsx. Error handling and throwing happens within SWR fetcher in `_app.tsx`.

Finch Data Types can be found in types/finch.d.ts.

If you want to manually set the `current_connection`, log into Upstash, go to the database CLI, and run `SET current_connection <your-access-token>`.

In production, NEVER return the actual access_token in the /connections.tsx page. This is just an example (NOTE: Might just want to remove this entirely)

Always try to check for null values when displaying data (employee?.email)

### Using Gitpod

The benefits of using Gitpod vs running locally is that this entire workshop can be done completely in a browser - no additional software dependencies required.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#/https://github.com/tylernix/finch-demo-nextjs)

Create a `.env.local` file (or copy our example file `cp .env.local.example .env.local`).

```bash
BASE_URL=http://localhost:3000

NEXT_PUBLIC_FINCH_DEMO_CLIENT_ID=
FINCH_DEMO_CLIENT_ID=

NEXT_PUBLIC_FINCH_CLIENT_ID=
FINCH_CLIENT_ID=
FINCH_CLIENT_SECRET=

FINCH_API_URL=https://api.tryfinch.com
API_URL=http://localhost:3001/api

REDIS_URL=
```

### Using local machine

Using Gitpod is ideal, but if you want to run this reference implementation locally, there are a few things you will need setup on your computer before getting started:

[TODO]

To run your site locally, use:

```bash
npm run dev
```

To run it in production mode, use:

```bash
npm run build
npm run start
```
