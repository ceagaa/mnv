"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const PHOTO_SRC = ASSETS["692fd2dc4d63bf298d8f853b_Image-27"];
const ICON_CONSULTANT = ASSETS["692fd2dc4d63bf298d8f853c_consultant-1-1"];
const ICON_LEGAL = ASSETS["692fd2dc4d63bf298d8f853d_legal-1-1"];

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const BUTTON_TEXT =
  "z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px] motion-reduce:transition-none";

const CARDS = [
  {
    icon: ICON_CONSULTANT,
    title: "Craftsmanship You Can Count",
    body: "We respect your time and your investment — with clear timelines, accurate estimates, and no hidden costs.",
    delay: "delay-[100ms]",
  },
  {
    icon: ICON_LEGAL,
    title: "Structural Knowledge & Sense",
    body: "From floor plans to finishes, we merge technical precision with creative vision to create functional, beautiful spaces.",
    delay: "delay-[200ms]",
  },
  {
    icon: ICON_CONSULTANT,
    title: "On-Time & On-Budget Delivery",
    body: "We respect your time and your investment — with clear timelines, accurate estimates, and no hidden costs.",
    delay: "delay-[300ms]",
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

function ExpertiseCard({
  icon,
  title,
  body,
  delay,
}: {
  icon: string;
  title: string;
  body: string;
  delay: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-[20px] md:gap-[24px] lg:pr-[32px]",
        REVEAL,
        delay,
        inView ? SHOWN : HIDDEN,
      )}
    >
      <div className="flex size-[60px] items-center justify-center rounded-[12px] bg-[#F7F6F3] md:size-[80px]">
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          className="block size-[24px] max-w-full md:size-[32px]"
        />
      </div>
      <div className="flex w-full flex-col gap-[12px]">
        <p className="font-sans text-[16px] leading-[27.2px] font-semibold text-[#112C23]">
          {title}
        </p>
        <p className="font-sans text-[16px] leading-[27.2px] text-[#47564E]">{body}</p>
      </div>
    </div>
  );
}

export function ExpertiseSection() {
  const [photoRef, photoIn] = useInView<HTMLDivElement>();
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [descriptionRef, descriptionIn] = useInView<HTMLParagraphElement>();
  const [buttonRef, buttonIn] = useInView<HTMLDivElement>();

  return (
    <section className="px-[20px] py-[60px] font-heading md:px-[30px] md:py-[80px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[60px] md:gap-[80px] lg:gap-[96px]">
          <div className="flex flex-col items-center gap-[40px] md:gap-[60px] lg:flex-row lg:gap-[60px]">
            <div
              ref={photoRef}
              className="relative w-full max-w-full overflow-hidden rounded-[12px] md:max-w-[80%] lg:max-w-[540px]"
            >
              <img
                src={PHOTO_SRC}
                alt=""
                width={1440}
                height={1466}
                loading="lazy"
                className="block h-auto w-full max-w-full rounded-[12px]"
              />
              <div
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 z-[100] origin-right rounded-[12px] bg-white transition-transform delay-[200ms] duration-500 ease-out motion-reduce:transition-none",
                  photoIn ? "scale-x-0" : "scale-x-100",
                )}
              />
            </div>

            <div className="flex w-full max-w-full flex-col items-start gap-[32px] md:max-w-[80%] lg:max-w-[601px]">
              <div className="flex w-full flex-col gap-[16px]">
                <h2
                  ref={titleRef}
                  className={cn(
                    "text-[28px] leading-[33.6px] font-semibold tracking-[0px] text-[#112C23] md:text-[38px] md:leading-[45.6px] md:tracking-[-1px] lg:text-[48px] lg:leading-[57.6px] lg:tracking-[-1.5px]",
                    REVEAL,
                    "delay-[200ms]",
                    titleIn ? SHOWN : HIDDEN,
                  )}
                >
                  Our experienced team handles every detail with care, precision, and passion
                </h2>
                <p
                  ref={descriptionRef}
                  className={cn(
                    "max-w-[475px] font-sans text-[16px] leading-[27.2px] text-[#47564E]",
                    REVEAL,
                    "delay-[300ms]",
                    descriptionIn ? SHOWN : HIDDEN,
                  )}
                >
                  Whether you’re updating a single room or transforming your entire home, we’re
                  committed to delivering results that reflect your lifestyle and exceed your
                  expectations.
                </p>
              </div>

              <div
                ref={buttonRef}
                className={cn(REVEAL, "delay-[400ms]", buttonIn ? SHOWN : HIDDEN)}
              >
                <a href="/contact-us" className="group inline-block max-w-full cursor-pointer">
                  <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#FF6C1F] p-[16px_26px] transition-[background-color] duration-500">
                    <div className="relative overflow-hidden">
                      <p className={cn(BUTTON_TEXT, "relative")}>Get a Free Quote</p>
                      <p className={cn(BUTTON_TEXT, "absolute bottom-[-30px] left-0")}>
                        Get a Free Quote
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-[-2px] h-full w-0 bg-[#112C23] transition-[width] duration-200 ease-out group-hover:w-[102%] motion-reduce:transition-none" />
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((card) => (
              <ExpertiseCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
