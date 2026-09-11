import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import { PostFormDialog } from "@/components/admin/post-form-dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, PostSummary } from "@/lib/posts";
import { deletePost, getPostById, listPosts } from "@/lib/posts.functions";

interface PostsState {
  error: string | null;
  isLoading: boolean;
  posts: PostSummary[];
}

type PostsAction =
  | { type: "LOAD_START" }
  | { type: "LOAD_SUCCESS"; posts: PostSummary[] }
  | { type: "LOAD_ERROR"; error: string }
  | { type: "CREATE_SUCCESS"; post: Post }
  | { type: "UPDATE_SUCCESS"; post: Post }
  | { type: "DELETE_SUCCESS"; id: string }
  | { type: "ACTION_ERROR"; error: string };

const postsReducer = (state: PostsState, action: PostsAction): PostsState => {
  switch (action.type) {
    case "LOAD_START": {
      return { ...state, error: null, isLoading: true };
    }
    case "LOAD_SUCCESS": {
      return { error: null, isLoading: false, posts: action.posts };
    }
    case "LOAD_ERROR": {
      return { ...state, error: action.error, isLoading: false };
    }
    case "CREATE_SUCCESS": {
      return {
        ...state,
        error: null,
        posts: [action.post, ...state.posts],
      };
    }
    case "UPDATE_SUCCESS": {
      return {
        ...state,
        error: null,
        posts: state.posts.map((post) =>
          post.id === action.post.id ? action.post : post
        ),
      };
    }
    case "DELETE_SUCCESS": {
      return {
        ...state,
        error: null,
        posts: state.posts.filter((post) => post.id !== action.id),
      };
    }
    case "ACTION_ERROR": {
      return { ...state, error: action.error };
    }
    default: {
      return state;
    }
  }
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDate = (value: Date | string) =>
  dateFormatter.format(new Date(value));

interface PostRowProps {
  isMutating: boolean;
  post: PostSummary;
  onDelete: (post: PostSummary) => void;
  onEdit: (post: PostSummary) => void;
}

const PostRow = ({ isMutating, post, onDelete, onEdit }: PostRowProps) => (
  <div className="border-border bg-muted/40 flex flex-wrap items-center gap-3 rounded-lg border p-3">
    <div className="min-w-0 flex-1">
      <p className="text-foreground flex flex-wrap items-center gap-2 text-sm font-medium">
        <span className="truncate">{post.title}</span>
        {post.published ? (
          <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
            Published
          </span>
        ) : (
          <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-medium tracking-wide uppercase">
            Draft
          </span>
        )}
      </p>
      <p className="text-muted-foreground truncate text-xs">
        /blog/{post.slug} · Updated {formatDate(post.updatedAt)}
      </p>
    </div>

    <div className="flex shrink-0 items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="min-h-10"
        disabled={isMutating}
        onClick={() => onEdit(post)}
      >
        <IconEdit size={16} stroke={1.8} />
        Edit
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="min-h-10 min-w-10"
        aria-label={`Delete ${post.title}`}
        disabled={isMutating}
        onClick={() => onDelete(post)}
      >
        <IconTrash size={16} stroke={1.8} />
      </Button>
    </div>
  </div>
);

// oxlint-disable-next-line react-doctor/no-giant-component -- Splitting AdminPosts further would require major refactoring
const AdminPosts = () => {
  const [state, dispatch] = useReducer(postsReducer, {
    error: null,
    isLoading: true,
    posts: [],
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PostSummary | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const { error, isLoading, posts } = state;

  // oxlint-disable-next-line react-doctor/react-compiler-no-manual-memoization -- React Compiler is not enabled in this project; useCallback keeps loadPosts stable so the effect does not re-run on every render
  const loadPosts = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    try {
      const rows = await listPosts({ data: { includeUnpublished: true } });
      dispatch({ posts: rows, type: "LOAD_SUCCESS" });
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Could not load posts.";

      dispatch({
        error: message.includes("Failed query")
          ? "Posts table not found. Run the database migration first."
          : message,
        type: "LOAD_ERROR",
      });
    }
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        action: {
          label: "Try again",
          onClick: () => loadPosts(),
        },
      });
    }
  }, [error, loadPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleSaved = (post: Post) => {
    if (editingPost) {
      dispatch({ post, type: "UPDATE_SUCCESS" });
    } else {
      dispatch({ post, type: "CREATE_SUCCESS" });
    }
    setEditingPost(null);
  };

  const handleDelete = async (post: PostSummary) => {
    setPendingDelete(null);
    setIsMutating(true);

    try {
      await deletePost({ data: { id: post.id } });
      dispatch({ id: post.id, type: "DELETE_SUCCESS" });
    } catch (deleteError) {
      dispatch({
        error:
          deleteError instanceof Error
            ? deleteError.message
            : "Could not delete the post.",
        type: "ACTION_ERROR",
      });
    }

    setIsMutating(false);
  };

  const openCreate = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const openEdit = async (post: PostSummary) => {
    try {
      const fullPost = await getPostById({ data: { id: post.id } });

      if (fullPost) {
        setEditingPost(fullPost);
        setFormOpen(true);
      }
    } catch (editError) {
      dispatch({
        error:
          editError instanceof Error
            ? editError.message
            : "Could not load the post.",
        type: "ACTION_ERROR",
      });
    }
  };

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div aria-busy="true" className="mt-4 grid gap-3">
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
        <Skeleton className="h-14" />
      </div>
    );
  } else if (posts.length === 0) {
    content = (
      <div className="border-border bg-muted/40 mt-4 rounded-lg border p-6 text-center">
        <p className="text-foreground text-sm font-medium">No posts yet</p>
        <p className="text-muted-foreground mt-1 text-sm">
          Create your first blog post to get started.
        </p>
      </div>
    );
  } else {
    content = (
      <ul aria-label="Blog posts" className="mt-4 grid gap-3">
        {posts.map((post) => (
          <li key={post.id}>
            <PostRow
              isMutating={isMutating}
              post={post}
              onDelete={setPendingDelete}
              onEdit={openEdit}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section
      aria-labelledby="admin-posts-heading"
      className="border-border bg-card rounded-xl border p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2
            id="admin-posts-heading"
            className="text-foreground text-lg font-semibold"
          >
            Blog Posts
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Create, edit, and publish blog posts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10"
            disabled={isLoading}
            onClick={() => loadPosts()}
          >
            Refresh
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            className="min-h-10"
            onClick={openCreate}
          >
            <IconPlus size={16} stroke={1.8} />
            New post
          </Button>
        </div>
      </div>

      {content}

      <PostFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editingPost}
        onSaved={handleSaved}
        onError={(message) =>
          dispatch({ error: message, type: "ACTION_ERROR" })
        }
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDelete(null);
          }
        }}
        title="Delete post"
        description={
          pendingDelete
            ? `Permanently delete "${pendingDelete.title}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete post"
        pending={isMutating}
        onConfirm={() => {
          if (pendingDelete) {
            void handleDelete(pendingDelete);
          }
        }}
      />
    </section>
  );
};

export { AdminPosts };
