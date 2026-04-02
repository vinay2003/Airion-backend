interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly DEV: boolean;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
