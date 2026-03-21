/// <reference types="@cloudflare/workers-types" />

interface CloudflareEnv {
  // Add your Cloudflare environment variables and bindings here
  // e.g. MY_KV: KVNamespace;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CONVEX_URL: string;
    CONVEX_DEPLOYMENT: string;
  }
}
