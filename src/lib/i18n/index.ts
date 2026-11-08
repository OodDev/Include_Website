import { createNavigation } from "next-intl/server";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

export { routing } from "./routing";
