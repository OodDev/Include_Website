import pagesData from "@/data/pages.json";
import capturesData from "@/data/captures.json";
import type { Device } from "./model";

export interface PageInfo {
  slug: string;
  path: string;
  label: string;
  note: string;
  group: "pagine" | "legali";
}

export const LOCALE = pagesData.locale;
export const PAGES: PageInfo[] = pagesData.pages as PageInfo[];

export function findPage(path: string): PageInfo | undefined {
  return PAGES.find((p) => p.path === path);
}

export function pageLabel(path: string): string {
  return findPage(path)?.label ?? path;
}

export function liveUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_LIVE_SITE_URL || "https://include-website-six.vercel.app";
  const suffix = path === "/" ? "" : path;
  return `${base}/${LOCALE}${suffix}`;
}

export interface Hotspot {
  id: string;
  label: string;
  rect: { x: number; y: number; w: number; h: number };
}

export interface Capture {
  file: string;
  thumb?: string;
  width: number;
  height: number;
  hotspots: Hotspot[];
}

interface CapturesFile {
  generatedAt: string | null;
  base: string;
  locale: string;
  pages: Record<string, Partial<Record<Device, Capture>>>;
}

export const CAPTURES = capturesData as CapturesFile;

export function captureFor(path: string, device: Device): Capture | null {
  return CAPTURES.pages[path]?.[device] ?? null;
}

export function hasCaptures(): boolean {
  return Object.keys(CAPTURES.pages).length > 0;
}
