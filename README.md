# Animated Portfolio

High-end Next.js App Router portfolio boilerplate with Lenis, GSAP, Framer Motion, React Three Fiber, and a Sanity-ready content layer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Until Sanity credentials are set, the site reads dummy content from `data/mock`.

## Sanity

1. Create a project at [sanity.io](https://www.sanity.io).
2. Copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Visit `/studio` to edit Profile, Projects, Tech Stack, Testimonials, and Settings.

The data layer in `lib/data.ts` falls back to mock JSON whenever Sanity is not configured, so name, bio, images, and projects can move to the CMS without rewriting section components.
