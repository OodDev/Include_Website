import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our custom text tokens (tokens.css): by default it
 * guesses `text-body` is a COLOR class and would then strip a preceding
 * `text-white` (slate-on-slate invisible buttons). Pin the token names to the
 * font-size group.
 */
const tw = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["body", "caption", "h1", "h2", "h3"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return tw(clsx(inputs));
}
