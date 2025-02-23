/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

import { ExternalProvider } from '@ethersproject/providers'

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

export {}
