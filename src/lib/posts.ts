import {
  boolean,
  check,
  nonEmpty,
  object,
  optional,
  pipe,
  string,
} from "valibot";

export interface PostSummary {
  createdAt: Date | string;
  excerpt: string | null;
  id: string;
  published: boolean;
  slug: string;
  title: string;
  updatedAt: Date | string;
}

export interface Post extends PostSummary {
  authorId: string;
  content: string;
}

export interface PostInput {
  content: string;
  excerpt?: string;
  published: boolean;
  slug: string;
  title: string;
}

export const postTitleSchema = pipe(string(), nonEmpty("Title is required."));

export const postSlugSchema = pipe(
  string(),
  nonEmpty("Slug is required."),
  check(
    (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value),
    "Use lowercase letters, numbers, and hyphens."
  )
);

export const postContentSchema = pipe(
  string(),
  nonEmpty("Content is required.")
);

export const postInputSchema = object({
  content: postContentSchema,
  excerpt: optional(string()),
  published: boolean(),
  slug: postSlugSchema,
  title: postTitleSchema,
});

export const postUpdateSchema = object({
  content: postContentSchema,
  excerpt: optional(string()),
  id: string(),
  published: boolean(),
  slug: postSlugSchema,
  title: postTitleSchema,
});

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "");
