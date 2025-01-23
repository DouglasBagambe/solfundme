/// <reference types="react" />

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      "appkit-network-button": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export {};
