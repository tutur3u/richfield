import "@phosphor-icons/react";

// TypeScript 7 currently drops intrinsic SVG attributes inherited through
// ComponentPropsWithoutRef in Phosphor's published IconProps declaration.
// Restore the className prop used throughout the app until the package ships
// a TS7-compatible declaration.
declare module "@phosphor-icons/react" {
  interface IconProps {
    className?: string;
  }
}

export {};
