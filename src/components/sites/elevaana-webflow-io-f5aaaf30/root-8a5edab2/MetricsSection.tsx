"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { ASSETS } from "../shared/assets";

const VIDEO_SRC =
  ASSETS["692fd2dc4d63bf298d8f851c_4808420_Apartment_Improvement_3840x2160_mp4"];
const POSTER_SRC =
  ASSETS["692a9171c1893782dd4aa9ba692c021a042f850b65b67c97_4808420_Apartment_Improvement_3840x2160_poster.0000000"];
const PAUSE_ICON = ASSETS["692fd2dc4d63bf298d8f851d_pause-circle"];
const PLAY_ICON = ASSETS["692fd2dc4d63bf298d8f851e_play"];

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const CARD_BORDERS = [
  "border-[#47564e33] md:border-r",
  "border-[#47564e33] lg:border-r",
  "border-[#47564e33] md:border-r",
  "",
];

const COUNTERS = [
  {
    value: 250,
    suffix: "+",
    label: "Successful Renovation Projects Completed",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[0]),
  },
  {
    value: 98,
    suffix: "%",
    label: "Overall Client Satisfaction Rate",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[1]),
  },
  {
    value: 12,
    suffix: "yrs",
    label: "Combined Industry Experience",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[2]),
  },
  {
    value: 63,
    suffix: "%",
    label: "Projects From Repeated Clients",
    className: "pr-[36px]",
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

function useCountUp(target: number, active: boolean, duration = 1500): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

interface CounterCardProps {
  value: number;
  suffix: string;
  label: string;
  className?: string;
}

function CounterCard({ value, suffix, label, className }: CounterCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const count = useCountUp(value, inView);

  return (
    <div
      ref={ref}
      className={cn("block", REVEAL, inView ? SHOWN : HIDDEN, className)}
    >
      <h1 className="font-medium text-[40px] leading-[40px] tracking-[0px] text-[#FF6C1F] md:text-[56px] md:leading-[56px] lg:text-[90px] lg:leading-[90px]">
        {count}
        <span className="text-[28px] md:text-[38px] lg:text-[48px]">{suffix}</span>
      </h1>
      <h2 className="font-medium text-[20px] leading-[28px] tracking-[-0.5px] text-[#112C23] md:text-[24px] md:leading-[33.6px]">
        {label}
      </h2>
    </div>
  );
}

export function MetricsSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [textRef, textIn] = useInView<HTMLDivElement>();
  const [shellRef, shellIn] = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const media = videoRef.current;
    if (!media) return;
    const sync = () => setPlaying(!media.paused);
    sync();
    media.addEventListener("play", sync);
    media.addEventListener("pause", sync);
    return () => {
      media.removeEventListener("play", sync);
      media.removeEventListener("pause", sync);
    };
  }, []);

  const togglePlayback = () => {
    const media = videoRef.current;
    if (!media) return;
    if (media.paused) {
      void media.play().catch(() => undefined);
    } else {
      media.pause();
    }
  };

  return (
    <section className="w-full bg-[#F7F6F3] px-[20px] py-[60px] font-heading md:px-[30px] md:py-[80px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[95px]">
          <div className="flex flex-col items-start justify-between gap-[30px] md:flex-row">
            <h2
              ref={titleRef}
              className={cn(
                "max-w-[600px] font-semibold text-[30px] leading-[36px] tracking-[0px] text-[#112C23] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                titleIn ? SHOWN : HIDDEN,
              )}
            >
              What Sets Us Apart
            </h2>
            <div
              ref={textRef}
              className={cn(
                "flex w-full max-w-full flex-col gap-[24px] md:w-[71%] md:max-w-[500px] lg:w-auto",
                REVEAL,
                textIn ? SHOWN : HIDDEN,
              )}
            >
              <h3 className="font-medium text-[20px] leading-[28px] tracking-[-0.5px] text-[#112C23] md:text-[24px] md:leading-[33.6px]">
                We don’t believe in cookie-cutter solutions. Every home and homeowner is
                unique — and so is our approach.
              </h3>
              <p className="font-sans text-[16px] leading-[27.2px] text-[#47564E]">
                With Elavana, you get transparent communication, detailed planning, high-end
                finishes, and a team that respects your space as much as their craft. We handle
                everything in-house, ensuring consistency from the first sketch to the final
                clean-up.
              </p>
            </div>
          </div>

          <div
            ref={shellRef}
            className={cn(
              "group relative z-[3] flex h-[300px] min-h-[200px] w-full items-center justify-center overflow-hidden rounded-[12px] md:h-[500px] md:min-h-[400px] lg:h-[630px] lg:min-h-[630px]",
              REVEAL,
              shellIn ? SHOWN : HIDDEN,
            )}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={VIDEO_SRC}
              poster={POSTER_SRC}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={playing ? "Pause video" : "Play video"}
                className="flex h-[80px] w-[80px] cursor-pointer items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b79c3] motion-reduce:transition-none"
              >
                <img
                  src={PAUSE_ICON}
                  alt="Pause video"
                  width={24}
                  height={24}
                  className={cn("block", !playing && "hidden")}
                />
                <img
                  src={PLAY_ICON}
                  alt="Play video"
                  width={24}
                  height={24}
                  className={cn("block", playing && "hidden")}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 md:gap-[40px] lg:flex lg:justify-between lg:gap-[60px]">
            {COUNTERS.map((counter) => (
              <CounterCard key={counter.label} {...counter} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
