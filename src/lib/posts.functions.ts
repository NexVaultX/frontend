import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { desc, eq } from "drizzle-orm";
import { parse } from "valibot";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { postInputSchema, postUpdateSchema } from "@/lib/posts";
import type { Post, PostInput, PostSummary } from "@/lib/posts";

const getAdminSessionOrNull = async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
};

const getAdminSession = async () => {
  const session = await getAdminSessionOrNull();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
};

export const listPosts = createServerFn({ method: "GET" })
  .validator((data: { includeUnpublished?: boolean }) => data)
  .handler(async ({ data }): Promise<PostSummary[]> => {
    const { includeUnpublished = false } = data;

    if (includeUnpublished) {
      await getAdminSession();
    }

    const rows = await db
      .select({
        createdAt: posts.createdAt,
        excerpt: posts.excerpt,
        id: posts.id,
        published: posts.published,
        slug: posts.slug,
        title: posts.title,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .where(includeUnpublished ? undefined : eq(posts.published, true))
      .orderBy(desc(posts.createdAt));

    return rows;
  });

export const getPost = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<Post | null> => {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, data.slug))
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    const [post] = rows;

    if (!post.published) {
      const session = await getAdminSessionOrNull();

      if (!session) {
        return null;
      }
    }

    return post;
  });

export const getPostById = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Post | null> => {
    await getAdminSession();

    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.id, data.id))
      .limit(1);

    return rows[0] ?? null;
  });

export const createPost = createServerFn({ method: "POST" })
  .validator((data: PostInput) => parse(postInputSchema, data))
  .handler(async ({ data }): Promise<Post> => {
    const session = await getAdminSession();

    const [row] = await db
      .insert(posts)
      .values({
        authorId: session.user.id,
        content: data.content,
        excerpt: data.excerpt ?? null,
        published: data.published,
        slug: data.slug,
        title: data.title,
      })
      .returning();

    return row;
  });

export const updatePost = createServerFn({ method: "POST" })
  .validator((data: PostInput & { id: string }) =>
    parse(postUpdateSchema, data)
  )
  .handler(async ({ data }): Promise<Post> => {
    await getAdminSession();

    const [row] = await db
      .update(posts)
      .set({
        content: data.content,
        excerpt: data.excerpt ?? null,
        published: data.published,
        slug: data.slug,
        title: data.title,
      })
      .where(eq(posts.id, data.id))
      .returning();

    if (!row) {
      throw new Error("Post not found.");
    }

    return row;
  });

export const deletePost = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ ok: true }> => {
    await getAdminSession();

    const result = await db.delete(posts).where(eq(posts.id, data.id));

    if (result.rowCount === 0) {
      throw new Error("Post not found.");
    }

    return { ok: true };
  });
