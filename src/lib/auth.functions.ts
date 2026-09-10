import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "@/lib/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    return session;
  }
);

export const ensureSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      throw new Error("Unauthorized");
    }

    return session;
  }
);

export const requireAdmin = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return null;
    }

    if (session.user.role !== "admin") {
      return null;
    }

    return session;
  }
);

export const listPasskeys = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const passkeys = await auth.api.listPasskeys({ headers });

    // Strip sensitive WebAuthn fields before sending them to the client
    return passkeys.map(({ createdAt, deviceType, id, name }) => ({
      createdAt,
      deviceType,
      id,
      name,
    }));
  }
);
