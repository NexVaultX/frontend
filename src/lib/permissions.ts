import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
  mod: ["create", "update", "delete"],
  report: ["review", "dismiss"],
});

export const admin = ac.newRole({
  mod: ["create", "update", "delete"],
  report: ["review", "dismiss"],
  session: ["list", "revoke", "delete"],
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "delete",
    "set-password",
    "set-email",
    "get",
    "update",
  ],
});

export const user = ac.newRole({
  mod: [],
  report: [],
  session: [],
  user: [],
});
