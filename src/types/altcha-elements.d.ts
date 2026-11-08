// ALTCHA widget loader element (script tag copies the widget from
// /vendor/altcha/altcha.js). React 19 exposes JSX through React.JSX, so the
// ambient augmentation lives on the react package itself.
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "altcha-widget": DetailsHTMLAttributes<HTMLElement> & {
        challengeurl?: string;
        strings?: string;
        hidefooter?: boolean | string;
        name?: string;
      };
    }
  }
}
