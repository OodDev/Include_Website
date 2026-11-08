
import Link from "next/link";

/** Global 404 fallback for paths outside locale routing (assets, deep links). */
export default function GlobalNotFound() {
  return (
    <div className="mx-auto grid max-w-[60ch] content-center gap-6 px-6 py-28 text-center">
      <h1 className="text-h1 font-extrabold tracking-tight">404</h1>
      <p className="text-[1.0625rem]">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="justify-self-center text-[0.9375rem] font-bold text-petrol-deep underline-offset-4 hover:underline">
        Back to the homepage
      </Link>
    </div>
  );
}
