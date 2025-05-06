// src/global.d.ts
import "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dojah-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          widgetId: string;
          text?: string;
          textColor?: string;
          backgroundColor?: string;
          accesskey?: string;
        },
        HTMLElement
      >;
    }
  }
}
