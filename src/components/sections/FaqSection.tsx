"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";
import { FAQ_ITEMS } from "@/lib/faq";

import { ASSETS } from "@/lib/assets";

const CHEVRON = ASSETS.chevronDown;

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";

function useInView<T extends HTMLElement>(threshold = 0): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      const fallback = window.setTimeout(() => setInView(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function useContentHeight(): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => setHeight(element.getBoundingClientRect().height);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, height];
}

function FaqItem({
  index,
  question,
  answer,
  delay,
  open,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  delay: string;
  open: boolean;
  onToggle: (index: number) => void;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [contentRef, contentHeight] = useContentHeight();
  const answerId = `faq-answer-${index}`;

  useEffect(() => {
    if (!open) return;

    const handleMouseUp = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && ref.current?.contains(target)) return;
      onToggle(index);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [open, ref, index, onToggle]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full flex-col items-start overflow-hidden border-b border-[#E4E7EF] whitespace-pre-wrap break-keep",
        open ? "z-[901]" : "z-[900]",
        REVEAL,
        delay,
        inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[24px]",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(index)}
        aria-expanded={open}
        aria-controls={answerId}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-[12px] px-[15px] py-[10px] text-left transition-colors ease-linear motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D62828] md:px-[24px] md:py-[16px]",
          open ? "bg-[#F6F7FA] duration-[400ms]" : "bg-white duration-[500ms]",
        )}
      >
        <span className="flex w-full items-start justify-between whitespace-pre-wrap break-keep">
          <span className="w-[86%] font-sans text-[18px] leading-[30.6px] font-medium text-[#0C1A3A] md:w-[93%]">
            {question}
          </span>
          <span className="flex shrink-0 flex-col items-center justify-center pt-[6px]">
            <img
              src={CHEVRON}
              alt="Icon"
              width={24}
              height={24}
              loading="lazy"
              className={cn(
                "block h-[24px] w-[24px] transition-transform duration-[400ms] ease-linear motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          </span>
        </span>
      </button>

      <div
        id={answerId}
        aria-hidden={!open}
        className="relative block w-full overflow-hidden transition-[height] duration-[400ms] ease-linear motion-reduce:transition-none"
        style={{ height: open ? `${contentHeight}px` : "0px" }}
      >
        <div
          ref={contentRef}
          className="w-full whitespace-normal rounded-[16px] px-[15px] py-[16px] md:w-[97%] md:px-[24px] md:pb-[24px] lg:w-full"
        >
          <p className="font-sans text-[16px] leading-[27.2px] text-[#55607A]">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [headingRef, headingIn] = useInView<HTMLHeadingElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
      className="px-[20px] pt-[60px] pb-[60px] font-heading md:px-[30px] md:pt-[80px] md:pb-[80px] lg:pt-[120px] lg:pb-[120px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex w-full flex-col items-center gap-[40px] md:gap-[56px] lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full max-w-full lg:max-w-[430px]">
            <h2
              ref={headingRef}
              className={cn(
                "text-[30px] leading-[36px] font-semibold tracking-[0px] text-[#0C1A3A] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                "delay-[200ms]",
                headingIn ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,24px,0)]",
              )}
            >
              Perguntas frequentes sobre segurança contra incêndio, AVCB e alvará
            </h2>
            <p className="mt-[24px] font-sans text-[16px] leading-[27.2px] text-[#55607A]">
              Não achou sua dúvida?{" "}
              <a
                href="#orcamento"
                className="font-medium text-[#D62828] underline underline-offset-4"
              >
                Fale com um especialista
              </a>
              .
            </p>
          </div>

          <div className="flex w-full max-w-full flex-col gap-[8px] lg:max-w-[660px]">
            {FAQ_ITEMS.map((item, index) => (
              <FaqItem
                key={item.question}
                index={index}
                question={item.question}
                answer={item.answer}
                delay={item.delay}
                open={openIndex === index}
                onToggle={toggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
