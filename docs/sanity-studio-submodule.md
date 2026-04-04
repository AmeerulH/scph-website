# Sanity Studio as a git submodule

The Next.js site and Sanity Studio live in separate repositories. This repo can embed the Studio at **`sanity-studio/`** via a submodule so one checkout contains both codebases.

## Prerequisites

1. **A dedicated Git remote for the Studio** (for example `git@github.com:AmeerulH/scph-sanity-studio.git`).
2. The Studio repository root should match a standard Sanity app layout: `sanity.config.ts`, `sanity.cli.ts`, `schemaTypes/`, `package.json`, etc.

If your Studio files currently live only on disk (for example under `my-sanity-studio/scph-website/` on your machine), treat that folder as the **root of the new Studio repo**—not the parent `my-sanity-studio/` directory.

## One-time: publish the Studio as its own repo

From the directory that contains `sanity.config.ts` (your Studio package root):

```bash
git init
git add .
git commit -m "Initial Sanity Studio for SCPH"
git branch -M main
git remote add origin git@github.com:YOUR_USER/YOUR_STUDIO_REPO.git
git push -u origin main
```

Use a `.gitignore` that excludes `node_modules/`, `dist/`, and `.sanity/` (your template likely already does).

## One-time: add the submodule to this website repo

From the **`scph-website`** repository root (not inside `sanity-studio`):

```bash
git submodule add git@github.com:YOUR_USER/YOUR_STUDIO_REPO.git sanity-studio
git commit -m "chore: add Sanity Studio as submodule"
git push
```

Or run:

```bash
./scripts/add-sanity-studio-submodule.sh git@github.com:YOUR_USER/YOUR_STUDIO_REPO.git
```

## Clone this repo (with submodule)

```bash
git clone --recurse-submodules git@github.com:AmeerulH/scph-website.git
cd scph-website
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

## Update the Studio after someone changed it

```bash
cd sanity-studio
git pull origin main   # or your default branch
cd ..
git add sanity-studio
git commit -m "chore: bump sanity-studio submodule"
git push
```

Alternatively, from the website repo root:

```bash
git submodule update --remote sanity-studio
git add sanity-studio
git commit -m "chore: bump sanity-studio submodule"
```

## Work on the Studio locally

```bash
cd sanity-studio
npm install
npm run dev
```

Schema files are under `sanity-studio/schemaTypes/`.

## Deploy / CI

If your host builds this repo from Git (for example Vercel), enable **recursive submodules** so `sanity-studio/` is present when needed. For Vercel, set **`GIT_SUBMODULE_STRATEGY=recursive`** in project environment variables if the build should see the submodule.

The public website runtime only talks to Sanity’s API; production builds do not require the Studio unless your pipeline runs schema checks from this tree.
