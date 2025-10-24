# Blogging Platform — Assignment by Kapybara

This is the assignment given by **Kapybara**, in which I have to build a blogging platform and implement core blogging features.

---

## Live Deployment

**[https://assignment-kapy-bara.vercel.app/](https://assignment-kapy-bara.vercel.app/)**

---

## Tech Stack

* **Next.js 15 (App Router)**
* **tRPC**
* **PostgreSQL (Neon)**
* **Drizzle ORM**
* **UploadThing** (for handling image uploads)
* **TypeScript**

---

## Features Implemented

* Markdown-based **Content Editor**
* **Post CRUD** (Create, Read, Update, Delete)
* **Post Filtering & Searching**
* **Draft & Publish** post states
* **Category Management**
* **Category attachment** with posts
* **Filtering based on categories**
* **Image uploads** handled via **UploadThing**

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blogging-platform.git
cd blogging-platform
```

### 2. Install Dependencies

Make sure you have **Node.js (>=18)** and **npm**, **yarn**, **pnpm**, or **bun** installed.

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root and add the following environment variables:

```bash
# PostgreSQL Database URL (Neon, Supabase, or local)
DATABASE_URL="your_neon_or_postgres_connection_url"

# UploadThing API Token
UPLOADTHING_TOKEN="your_uploadthing_token"
```

> You can get your **Neon Database URL** from the Neon dashboard under “Connection Details”.
> You can generate an **UploadThing Token** from your [UploadThing dashboard](https://uploadthing.com/dashboard).

### 4. Run Database Migrations

Once your `.env` is set up, push your schema to the database:

```bash
npm run db:push
# or, if you use drizzle-kit directly
npx drizzle-kit push
```

### 5. Start the Development Server

```bash
npm run dev
```

Now, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## tRPC Router Structure

### Post Router — `postRouter`

Handles everything related to **blog posts** (listing, fetching by slug, creating, updating, deleting).

#### Routes

##### 1. `all`

Fetches paginated posts with optional filters.

```ts
.all: publicProcedure
  .input({ page, limit, search?, categories? })
  .query(async ({ input }) => getPosts(input))
```

* Supports pagination (`page`, `limit`)
* Search by title or content
* Filter by category list

---

##### 2. `bySlug`

Fetches a single post via its slug.

```ts
.bySlug: publicProcedure
  .input({ slug: z.string() })
  .query(async ({ input }) => getBySlug(input.slug))
```

Throws a `TRPCError` with code `NOT_FOUND` if no post matches.

---

##### 3. `create`

Creates a new post entry.

```ts
.create: publicProcedure
  .input(createPostSchema.extend({ categories }))
  .mutation(async ({ input }) => createPost(input))
```

* Uses **Zod** for input validation
* Wraps DB errors in `TRPCError` for safe client responses

---

##### 4. `update`

Updates an existing post.

```ts
.update: publicProcedure
  .input(selectPostSchema.extend({ categories? }))
  .mutation(async ({ input }) => updatePost(input))
```

* Requires a valid `id`
* Updates both post fields and categories if provided

---

##### 5. `delete`

Deletes a post by ID.

```ts
.delete: publicProcedure
  .input({ id: z.string() })
  .mutation(async ({ input }) => db.delete(posts).where(eq(posts.id, input.id)))
```

---

### Category Router — `categoryRouter`

Handles category management for posts.

#### Routes

##### 1. `all`

Returns a list of all categories.

```ts
.all: publicProcedure.query(async () => getCategories())
```

---

##### 2. `add`

Creates a new category.

```ts
.add: publicProcedure
  .input({ slug: z.string(), name: z.string() })
  .mutation(async ({ input }) => addCategory(input))
```

---

##### 3. `update`

Updates an existing category.

```ts
.update: publicProcedure
  .input({ id, slug, name })
  .mutation(async ({ input }) => updateCategory(input))
```

---

### App Router — `appRouter`

Combines all individual routers into a single, unified router used by the server.

```ts
import { postRouter } from "./routers/post";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
  posts: postRouter,
  categories: categoryRouter,
});

export type AppRouter = typeof appRouter;
```

This structure ensures:

* Full **type safety** (client and server share types)
* Modular **scalability**
* Clear **separation of concerns** (business logic lives in `services/`)

---

## Building the Project

Create a production build from source:

```bash
npm run build
```

Then run the optimized production server:

```bash
npm run start
```

This will start the Next.js app in production mode using the generated build output.

---

## Summary

This project demonstrates:

* **End-to-end type safety** with tRPC
* **Modern app architecture** using Next.js App Router
* **Database integration** with Drizzle ORM + PostgreSQL
* **Clean modular design** for scalable feature addition
* **Image upload management** using UploadThing

---

**Developed by:** *Mayank Gupta*
# Blogging Platform — Assignment by Kapybara

This is the assignment given by **Kapybara**, in which I have to build a blogging platform and implement core blogging features.

---

## Live Deployment

**[https://assignment-kapy-bara.vercel.app/](https://assignment-kapy-bara.vercel.app/)**

---

## Tech Stack

* **Next.js 15 (App Router)**
* **tRPC**
* **PostgreSQL (Neon)**
* **Drizzle ORM**
* **UploadThing** (for handling image uploads)
* **TypeScript**

---

## Features Implemented

* Markdown-based **Content Editor**
* **Post CRUD** (Create, Read, Update, Delete)
* **Post Filtering & Searching**
* **Draft & Publish** post states
* **Category Management**
* **Category attachment** with posts
* **Filtering based on categories**
* **Image uploads** handled via **UploadThing**

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blogging-platform.git
cd blogging-platform
```

### 2. Install Dependencies

Make sure you have **Node.js (>=18)** and **npm**, **yarn**, **pnpm**, or **bun** installed.

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root and add the following environment variables:

```bash
# PostgreSQL Database URL (Neon, Supabase, or local)
DATABASE_URL="your_neon_or_postgres_connection_url"

# UploadThing API Token
UPLOADTHING_TOKEN="your_uploadthing_token"
```

> You can get your **Neon Database URL** from the Neon dashboard under “Connection Details”.
> You can generate an **UploadThing Token** from your [UploadThing dashboard](https://uploadthing.com/dashboard).

### 4. Run Database Migrations

Once your `.env` is set up, push your schema to the database:

```bash
npm run db:push
# or, if you use drizzle-kit directly
npx drizzle-kit push
```

### 5. Start the Development Server

```bash
npm run dev
```

Now, open [http://localhost:3000](http://localhost:3000) in your browser.

---

## tRPC Router Structure

### Post Router — `postRouter`

Handles everything related to **blog posts** (listing, fetching by slug, creating, updating, deleting).

#### Routes

##### 1. `all`

Fetches paginated posts with optional filters.

```ts
.all: publicProcedure
  .input({ page, limit, search?, categories? })
  .query(async ({ input }) => getPosts(input))
```

* Supports pagination (`page`, `limit`)
* Search by title or content
* Filter by category list

---

##### 2. `bySlug`

Fetches a single post via its slug.

```ts
.bySlug: publicProcedure
  .input({ slug: z.string() })
  .query(async ({ input }) => getBySlug(input.slug))
```

Throws a `TRPCError` with code `NOT_FOUND` if no post matches.

---

##### 3. `create`

Creates a new post entry.

```ts
.create: publicProcedure
  .input(createPostSchema.extend({ categories }))
  .mutation(async ({ input }) => createPost(input))
```

* Uses **Zod** for input validation
* Wraps DB errors in `TRPCError` for safe client responses

---

##### 4. `update`

Updates an existing post.

```ts
.update: publicProcedure
  .input(selectPostSchema.extend({ categories? }))
  .mutation(async ({ input }) => updatePost(input))
```

* Requires a valid `id`
* Updates both post fields and categories if provided

---

##### 5. `delete`

Deletes a post by ID.

```ts
.delete: publicProcedure
  .input({ id: z.string() })
  .mutation(async ({ input }) => db.delete(posts).where(eq(posts.id, input.id)))
```

---

### Category Router — `categoryRouter`

Handles category management for posts.

#### Routes

##### 1. `all`

Returns a list of all categories.

```ts
.all: publicProcedure.query(async () => getCategories())
```

---

##### 2. `add`

Creates a new category.

```ts
.add: publicProcedure
  .input({ slug: z.string(), name: z.string() })
  .mutation(async ({ input }) => addCategory(input))
```

---

##### 3. `update`

Updates an existing category.

```ts
.update: publicProcedure
  .input({ id, slug, name })
  .mutation(async ({ input }) => updateCategory(input))
```

---

### App Router — `appRouter`

Combines all individual routers into a single, unified router used by the server.

```ts
import { postRouter } from "./routers/post";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
  posts: postRouter,
  categories: categoryRouter,
});

export type AppRouter = typeof appRouter;
```

This structure ensures:

* Full **type safety** (client and server share types)
* Modular **scalability**
* Clear **separation of concerns** (business logic lives in `services/`)

---

## Building the Project

Create a production build from source:

```bash
npm run build
```

Then run the optimized production server:

```bash
npm run start
```

This will start the Next.js app in production mode using the generated build output.

---

## Summary

This project demonstrates:

* **End-to-end type safety** with tRPC
* **Modern app architecture** using Next.js App Router
* **Database integration** with Drizzle ORM + PostgreSQL
* **Clean modular design** for scalable feature addition
* **Image upload management** using UploadThing

---

**Developed by:** *Mayank Gupta*
