/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURA_RPC_URL: string
  readonly VITE_TURA_CHAIN_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
