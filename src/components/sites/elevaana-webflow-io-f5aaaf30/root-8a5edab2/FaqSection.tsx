"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const CHEVRON = ASSETS["692fd2dc4d63bf298d8f853f_chevron-down-4"];

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";

const FAQ_ITEMS = [
  {
    question: "How long does a typical renovation take?",
    answer:
      "Project timelines vary depending on the scope, but most single-room renovations take 2–4 weeks, while full-home projects can range from 8–12 weeks. We provide a detailed timeline before starting so you know what to expect.",
    delay: "delay-[300ms]",
  },
  {
    question: "Do you provide free consultations?",
    answer:
      "Depending on scope, smaller room projects take around 2–4 weeks, whereas complete home renovations can take 8–12 weeks. We outline everything in advance to keep things transparent.",
    delay: "delay-[400ms]",
  },
  {
    question: "Can I live in my home during the renovation?",
    answer:
      "Duration varies by project size. Most individual rooms are completed within 2–4 weeks, while full-home remodels take 8–12 weeks. We provide a detailed plan before starting.",
    delay: "delay-[600ms]",
  },
  {
    question: "What areas do you serve?",
    answer:
      "The timeline depends on how extensive the work is. Room remodels generally take 2–4 weeks, and full-home projects can take 8–12 weeks. We make sure you receive a full schedule ahead of time.",
    delay: "delay-[700ms]",
  },
  {
    question: "Are your renovations fully insured and licensed?",
    answer:
      "Project length is based on scope. A single-room transformation is usually finished in 2–4 weeks, and complete home renovations may take 8–12 weeks. You’ll get a full timeline before we begin.",
    delay: "delay-[800ms]",
  },
] as const;

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
        "relative flex w-full flex-col items-start overflow-hidden border-b border-[#47564E29] whitespace-pre-wrap break-keep",
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
          "flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-[12px] px-[15px] py-[10px] text-left transition-colors ease-linear motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#112C23] md:px-[24px] md:py-[16px]",
          open ? "bg-[#F7F6F3] duration-[400ms]" : "bg-white duration-[500ms]",
        )}
      >
        <span className="flex w-full items-start justify-between whitespace-pre-wrap break-keep">
          <span className="w-[86%] font-sans text-[18px] leading-[30.6px] font-medium text-[#112C23] md:w-[93%]">
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

      <nav
        id={answerId}
        aria-hidden={!open}
        className="relative block w-full overflow-hidden transition-[height] duration-[400ms] ease-linear motion-reduce:transition-none"
        style={{ height: open ? `${contentHeight}px` : "0px" }}
      >
        <div
          ref={contentRef}
          className="w-full whitespace-normal rounded-[16px] px-[15px] py-[16px] md:w-[97%] md:px-[24px] md:pb-[24px] lg:w-full"
        >
          <p className="font-sans text-[16px] leading-[27.2px] text-[#3B3B3B]">{answer}</p>
        </div>
      </nav>
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
    <section className="px-[20px] pb-[60px] font-heading md:px-[30px] md:pb-[80px] lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex w-full flex-col items-center gap-[40px] md:gap-[56px] lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full max-w-full lg:max-w-[430px]">
            <p className="mb-[20px] font-sans text-[16px] leading-[27.2px] font-semibold uppercase text-[#FF6C1F]">
              FAQ
            </p>
            <h2
              ref={headingRef}
              className={cn(
                "text-[30px] leading-[36px] font-semibold tracking-[0px] text-[#112C23] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                "delay-[200ms]",
                headingIn ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,24px,0)]",
              )}
            >
              Frequently Asked Questions
            </h2>
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
