import { MDXRemote } from "next-mdx-remote/rsc";
import { cn } from "@/lib/utils/cn";

/** MDX rendering for controlled repo content (trusted authors, §12). */
export function Prose({ body, className }: { body: string; className?: string }) {
  return (
    <div className={cn("prose-include", className)}>
      <MDXRemote source={body} />
    </div>
  );
}
