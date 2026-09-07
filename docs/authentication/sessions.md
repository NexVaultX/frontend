# Sessions

Sessions are managed by Better Auth and stored in the `sessions` table.
This guide explains the session settings in `src/lib/auth.ts`.

## Configuration

```ts
session: {
  // 30 days
  expiresIn: 60 * 60 * 24 * 30,
  // refresh on every request → sliding expiration
  updateAge: 0,
},
```

* `expiresIn` — how long a session lives, in seconds. The default is
  30 days.
* `updateAge` — how often the session expiry is refreshed, in seconds.
  `0` refreshes on every request, giving a sliding expiration: an
  active user never gets signed out.

## How sessions work

1. On sign-in, Better Auth creates a session cookie and a row in the
   `sessions` table.
2. On each request, the session is validated and (with `updateAge: 0`)
   its expiry is pushed forward.
3. When the session expires, the user must sign in again.

## Sign out

Sign out is handled by the Better Auth client:

```ts
await authClient.signOut();
```

The session row is deleted and the cookie is cleared.

## Session management UI

The **Sessions** tab of the settings page
(`src/components/settings/settings-sessions.tsx`) lists active
sessions and lets users revoke them.

## Related

* [Email and Password](email-password.md)
* [Passkeys](passkeys.md)
* [Google Social Provider](../social-providers/google.md)
