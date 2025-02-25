// Global type declarations

// Declare JSX namespace to avoid errors with JSX elements
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
