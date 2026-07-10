/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JFO_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
