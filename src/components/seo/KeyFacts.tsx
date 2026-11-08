import type { ReactNode } from "react";

/**
 * KeyFacts (§9.3): a <dl> of project facts — extractable from plain HTML
 * without JS (AIO pattern). Server-rendered.
 */
export function KeyFacts({
  facts,
  className,
}: {
  facts: { term: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}>
      {facts.map((f) => (
        <div key={f.term} className="rounded-card bg-white p-5">
          <dt className="u-label text-slate/60" style={{ fontSize: "0.6875rem" }}>
            {f.term}
          </dt>
          <dd className="mt-2 font-semibold">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * AnswerBlock (§9.3): the 40–60-word direct answer that opens each key page.
 */
export function AnswerBlock({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <section aria-labelledby="answer-heading" className="max-w-[72ch]">
      <h2 id="answer-heading" className="sr-only">
        {question}
      </h2>
      <p className="text-[1.1875rem] font-semibold leading-[1.6]">{answer}</p>
    </section>
  );
}
