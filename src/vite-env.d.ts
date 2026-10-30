/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — set in Vercel → Settings → Environment Variables */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
