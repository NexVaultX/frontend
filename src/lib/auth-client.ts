import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { ac, admin, user } from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    passkeyClient(),
    adminClient({ ac, roles: { admin, user } }),
  ],
});
