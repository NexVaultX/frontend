# Object Storage

Uploaded mod and plugin files live in S3-compatible object storage. Local
development uses [Garage](https://garagehq.deuxfleurs.fr/), which runs in
`docker-compose.yml`. Production uses
[Cloudflare R2](https://developers.cloudflare.com/r2/). R2 has no egress
fees, which matters because downloads make up most of the traffic.

The app only uses the S3 API (`@aws-sdk/client-s3`), so switching
providers only means changing environment variables.

## How it works

`src/lib/storage.ts` is the only module that talks to storage:

* `uploadStream` streams the request body into a multipart upload. It
  computes SHA-1 and SHA-512 while streaming, and aborts past
  `STORAGE_MAX_FILE_BYTES`. On failure it deletes whatever was written.
* `getDownloadUrl` returns `STORAGE_PUBLIC_URL/<key>` when a public
  domain is configured. Otherwise it returns a presigned GET URL that is
  valid for 5 minutes.
* `deleteObjects` removes keys in batches of 1000.

Object keys are immutable:
`projects/<projectId>/<versionId>/<fileId>/<filename>`. Objects are
stored with `Content-Disposition: attachment` and a one-year `immutable`
cache header, so a CDN can cache them indefinitely.

## Configuration

| Variable                    | Description                              |
| --------------------------- | ---------------------------------------- |
| `STORAGE_ENDPOINT`          | S3 API endpoint                          |
| `STORAGE_REGION`            | `garage` locally, `auto` for R2          |
| `STORAGE_BUCKET`            | Bucket name                              |
| `STORAGE_ACCESS_KEY_ID`     | Access key ID                            |
| `STORAGE_SECRET_ACCESS_KEY` | Secret access key                        |
| `STORAGE_FORCE_PATH_STYLE`  | `true` for Garage, `false` for R2        |
| `STORAGE_PUBLIC_URL`        | Optional public download domain          |
| `STORAGE_MAX_FILE_BYTES`    | Optional upload limit (default 100 MB)   |
| `GARAGE_RPC_SECRET`         | Garage node secret (local only)          |
| `GARAGE_ADMIN_TOKEN`        | Garage admin API token (local only)      |

## Local setup with Garage

1. Add the storage section from `.env.example` to `.env.local` and fill
   in the generated values:

   ```bash
   echo "GARAGE_RPC_SECRET=$(openssl rand -hex 32)"
   echo "GARAGE_ADMIN_TOKEN=$(openssl rand -base64 32)"
   echo "STORAGE_ACCESS_KEY_ID=GK$(openssl rand -hex 12)"
   echo "STORAGE_SECRET_ACCESS_KEY=$(openssl rand -hex 32)"
   ```

2. Start the infrastructure and prepare the bucket:

   ```bash
   just infra
   just storage-init   # or: pnpm storage:init
   ```

`scripts/garage-init.sh` assigns the single-node layout, creates the
bucket, imports the access key from `.env.local`, and grants it access.
It is safe to run more than once.

Garage's S3 API listens on `127.0.0.1:3900`. Without
`STORAGE_PUBLIC_URL`, downloads redirect to presigned Garage URLs.

## Production setup with Cloudflare R2

1. Create an R2 bucket in the Cloudflare dashboard.
2. Connect a custom domain to the bucket (for example
   `cdn.voxelvein.example`). Use a separate domain from the app, so
   uploaded files never share the app's origin or cookies.
3. Create an R2 API token with **Object Read & Write** on that bucket
   only.
4. Set the variables:

   ```bash
   STORAGE_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
   STORAGE_REGION=auto
   STORAGE_BUCKET=<bucket>
   STORAGE_ACCESS_KEY_ID=<token access key id>
   STORAGE_SECRET_ACCESS_KEY=<token secret>
   STORAGE_FORCE_PATH_STYLE=false
   STORAGE_PUBLIC_URL=https://cdn.voxelvein.example
   ```

The Garage variables are not used in production.

## Related

* [Projects and Files](../content/projects.md)
* [Meilisearch](../search/meilisearch.md)
