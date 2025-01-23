import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        children?: React.ReactNode;
        style?: React.CSSProperties;
      };
      "appkit-network-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        children?: React.ReactNode;
        style?: React.CSSProperties;
      };
    }
  }
}

export {};
