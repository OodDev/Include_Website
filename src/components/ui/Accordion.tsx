"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Minus, Plus } from "./IconsMini";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={className}>
      {items.map((it, i) => (
        <AccordionPrimitive.Item
          key={i}
          className="border-b border-slate/15"
          value={`item-${i}`}
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-bold">
              {it.question}
              <span aria-hidden="true" className="shrink-0 text-petrol-deep">
                <span className="group-data-[state=open]:hidden">
                  <Plus />
                </span>
                <span className="hidden group-data-[state=open]:block">
                  <Minus />
                </span>
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-open data-[state=closed]:animate-accordion-close motion-safe">
            <div className="pb-5 max-w-[65ch] leading-[1.65] opacity-80">{it.answer}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
