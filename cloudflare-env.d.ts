declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    PROFESSIONAL_USERNAME?: string;
    PROFESSIONAL_TEMP_PASSWORD?: string;
  }
}
