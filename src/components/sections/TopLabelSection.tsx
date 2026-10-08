"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/assets";

const PHONE_ICON = ASSETS.phone;
const PHONE_TEXT = "Solicite seu orçamento de legalização";

const GROUPS = [0, 1, 2, 3] as const;

const MARQUEE_CSS = `
@keyframes mnv-top-label-marquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}
.mnv-top-label-marquee{animation:mnv-top-label-marquee 20s linear infinite}
`;

function TickerDot() {
  return (
    <div className="h-[12px] w-[12px]">
      <div className="h-[12px] w-[12px] rounded-[100px] bg-white" />
    </div>
  );
}

function PhoneItem() {
  return (
    <div className="flex gap-[12px]">
      <img src={PHONE_ICON} alt="" className="block h-auto max-w-full" />
      <span
        className={cn(
          "whitespace-nowrap font-heading font-semibold text-[28px] leading-[33.6px] tracking-[0px] text-white md:text-[38px] md:leading-[45.6px] md:tracking-[-1px] lg:text-[48px] lg:leading-[57.6px] lg:tracking-[-1.5px]",
        )}
      >
        {PHONE_TEXT}
      </span>
    </div>
  );
}

export function TopLabelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ticker = tickerRef.current;
    if (!section || !ticker) return;

    let frame = 0;
    let current = 0;
    let target = 0;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = Math.min(
        1,
        Math.max(0, (viewportHeight - rect.top) / (viewportHeight + rect.height)),
      );
      target = -1.2 * window.innerWidth * progress;
    };

    const tick = () => {
      current += (target - current) * 0.12;
      ticker.style.transform = `translate3d(${current}px, 0, 0)`;
      if (Math.abs(target - current) < 0.05) {
        current = target;
        ticker.style.transform = `translate3d(${current}px, 0, 0)`;
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const update = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    measure();
    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Chamada para orçamento"
      className="w-full overflow-hidden bg-[#D62828] py-[20px] font-heading"
    >
      <style>{MARQUEE_CSS}</style>
      <div ref={tickerRef} aria-hidden="true" className="w-full">
        <div className="mnv-top-label-marquee flex w-full items-center gap-[20px]">
          {GROUPS.map((group) => (
            <Fragment key={group}>
              {group > 0 ? <TickerDot /> : null}
              <div className="flex flex-none items-center gap-[20px]">
                <PhoneItem />
                <TickerDot />
                <PhoneItem />
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
