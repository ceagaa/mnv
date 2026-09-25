"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";

const STAR_FILLED = ASSETS["692fd2dc4d63bf298d8f8528_Star-icon"];
const STAR_EMPTY = ASSETS["692fd2dc4d63bf298d8f8529_Star-icon-1"];

const CARD_DELAYS = [
  "delay-[0ms]",
  "delay-[80ms]",
  "delay-[160ms]",
  "delay-[240ms]",
  "delay-[320ms]",
  "delay-[400ms]",
] as const;

const TESTIMONIALS = [
  {
    stars: 4,
    quote:
      "“This charity provided critical medical aid to our community. The healthcare support.”",
    name: "Brooklyn Simmons",
    position: "Product Manager",
    avatar: ASSETS["692fd2dc4d63bf298d8f8527_Group-34606"],
  },
  {
    stars: 3,
    quote:
      "“I’ve had the privilege to volunteer here, and seeing the difference we make in life.”",
    name: "Robart Fox",
    position: "UX/UI Designer",
    avatar: ASSETS["692fd2dc4d63bf298d8f8536_Group-34606-1"],
  },
  {
    stars: 3,
    quote:
      "“Their transparency inspire us to give more and make a bigger real impact together.”",
    name: "Sophia Martinez",
    position: "Creative Director",
    avatar: ASSETS["692fd2dc4d63bf298d8f8537_Group-34606-2"],
  },
  {
    stars: 5,
    quote:
      "“After losing our home to a flood, they helped us rebuild and find stability again.”",
    name: "Emily Carter",
    position: "Senior Project Manager",
    avatar: ASSETS["692fd2dc4d63bf298d8f8538_Group-34606-3"],
  },
  {
    stars: 4,
    quote:
      "“My children now have access to clean water and meals thanks to this organization.”",
    name: "Ava Thompson",
    position: "Lead Interior Designer",
    avatar: ASSETS["692fd2dc4d63bf298d8f8539_Group-34606-4"],
  },
  {
    stars: 5,
    quote:
      "“Knowing my monthly donations supporting children’s education gives me immense.”",
    name: "Mia Robinson",
    position: "Marketing Manager",
    avatar: ASSETS["692fd2dc4d63bf298d8f853a_Group-34606-5"],
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

function StarRow({ filled }: { filled: number }) {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={index < filled ? STAR_FILLED : STAR_EMPTY}
          alt=""
          width={32}
          height={32}
          className="block size-[32px] max-w-full"
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  stars: number;
  quote: string;
  name: string;
  position: string;
  avatar: string;
  delay: string;
}

function TestimonialCard({ stars, quote, name, position, avatar, delay }: TestimonialCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start justify-between gap-[20px] rounded-[12px] bg-white p-[20px] md:gap-[40px] md:p-[24px] lg:gap-[40px] lg:p-[40px]",
        REVEAL,
        delay,
        inView ? SHOWN : HIDDEN,
      )}
    >
      <StarRow filled={stars} />

      <h3 className="w-full font-heading text-[20px] leading-[28px] font-medium tracking-[-0.5px] text-[#112C23] md:text-[24px] md:leading-[33.6px]">
        {quote}
      </h3>

      <div className="mt-[8px] flex items-center gap-[12px]">
        <img
          src={avatar}
          alt=""
          width={48}
          height={48}
          className="block size-[48px] max-w-[48px]"
        />
        <div className="flex flex-col">
          <p className="font-sans text-[16px] leading-[27.2px] font-semibold text-[#112C23]">
            {name}
          </p>
          <p className="font-sans text-[14px] leading-[23.8px] text-[#47564E]">{position}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [subtextRef, subtextIn] = useInView<HTMLParagraphElement>();

  return (
    <section className="w-full overflow-hidden bg-[#F7F6F3] px-[20px] py-[60px] font-heading text-[14px] leading-[20px] font-normal text-[#333333] md:px-[30px] md:py-[80px] lg:px-[30px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[64px]">
          <div className="flex flex-col items-center gap-[16px]">
            <h2
              ref={titleRef}
              className={cn(
                "text-center font-heading text-[30px] leading-[36px] font-semibold text-[#112C23] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                titleIn ? SHOWN : HIDDEN,
              )}
            >
              Trusted by 310k+ Customers
            </h2>
            <p
              ref={subtextRef}
              className={cn(
                "max-w-[510px] text-center font-sans text-[16px] leading-[27.2px] text-[#47564E]",
                REVEAL,
                subtextIn ? SHOWN : HIDDEN,
              )}
            >
              Together, we can make a real impact in communities around the world. Help us bring
              hope and support.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                stars={testimonial.stars}
                quote={testimonial.quote}
                name={testimonial.name}
                position={testimonial.position}
                avatar={testimonial.avatar}
                delay={CARD_DELAYS[index] ?? ""}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
