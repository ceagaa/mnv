"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const BG_SHAPE = ASSETS["692fd2dc4d63bf298d8f850a_texture-1"];

const REVEAL =
  "transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,100px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

function useInView<T extends HTMLElement>(
  threshold = 0,
): [RefObject<T | null>, boolean] {
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

export function CtaSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [subtextRef, subtextIn] = useInView<HTMLParagraphElement>();
  const [buttonsRef, buttonsIn] = useInView<HTMLDivElement>();

  return (
    <div className="relative block bg-[#112C23] px-[30px] pt-[80px] pb-[80px] font-heading text-[14px] leading-[20px] max-[479px]:px-[20px] max-[479px]:pt-[60px] max-[479px]:pb-[60px] lg:pt-[124px] lg:pb-[144px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative z-[2] flex w-full justify-center">
          <div className="flex w-full max-w-[840px] flex-col items-center justify-center gap-[32px] max-[479px]:gap-[30px]">
            <div className="flex w-full flex-col items-center gap-[24px] max-[479px]:gap-[20px]">
              <h2
                ref={titleRef}
                className={cn(
                  "w-full text-center font-semibold text-white text-[35px] leading-[42px] tracking-[-0.5px] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px] max-[479px]:text-[30px] max-[479px]:leading-[36px] max-[479px]:tracking-[0px]",
                  REVEAL,
                  "delay-[100ms]",
                  titleIn ? SHOWN : HIDDEN,
                )}
              >
                Need a Renovation You Can Trust? Let’s Redesign Your Home
              </h2>
              <div ref={subtextRef} className="w-full max-w-[500px]">
                <p
                  className={cn(
                    "w-full text-center font-sans text-[16px] leading-[27.2px] text-[#F7F6F3]",
                    REVEAL,
                    "delay-[200ms]",
                    subtextIn ? SHOWN : HIDDEN,
                  )}
                >
                  Renovation experience that’s smooth from start to finish. Book
                  your free consultation today — no pressure, just possibilities.
                </p>
              </div>
            </div>

            <div
              ref={buttonsRef}
              className={cn(
                "block",
                REVEAL,
                "delay-[300ms]",
                buttonsIn ? SHOWN : HIDDEN,
              )}
            >
              <a
                href="/contact-us"
                className="group inline-block max-w-full cursor-pointer no-underline"
              >
                <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-white p-[16px_32px] transition-[background-color] duration-500">
                  <div className="relative block overflow-hidden">
                    <p className="relative z-[2] whitespace-nowrap font-heading text-[16px] leading-[27.2px] font-medium text-[#112C23] transition-transform duration-300 ease group-hover:-translate-y-[30px]">
                      Book A Free Consultation
                    </p>
                    <p className="absolute bottom-[-30px] left-0 z-[2] whitespace-nowrap font-heading text-[16px] leading-[27.2px] font-medium text-white transition-transform duration-300 ease group-hover:-translate-y-[30px]">
                      Book A Free Consultation
                    </p>
                  </div>
                  <div className="absolute left-[-2px] top-0 h-full w-0 bg-[#FF6C1F] transition-[width] duration-200 ease group-hover:w-[102%]" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <img
        src={BG_SHAPE}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full max-w-full"
      />
    </div>
  );
}
