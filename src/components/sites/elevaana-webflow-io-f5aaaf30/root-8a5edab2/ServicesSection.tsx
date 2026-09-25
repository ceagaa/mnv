"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";
import { ASSETS } from "../shared/assets";

type ServiceCardData = {
  href: string;
  image: string;
  title: string;
  description: string;
};

const SERVICE_CARDS: ServiceCardData[] = [
  {
    href: "/services-posts/full-home-renovation",
    image: ASSETS["692fd2dc4d63bf298d8f84f3_Image-26"],
    title: "Full Home Renovation",
    description:
      "From reorganizing layouts to building full home redesigns feels brand new.",
  },
  {
    href: "/services-posts/interior-exterior-upgrades",
    image:
      ASSETS[
        "692fd2dc4d63bf298d8f84f2_female-surveyor-with-clipboard-meeting-with-decorator-working-inside-property"
      ],
    title: "Interior & Exterior Upgrades",
    description:
      "From simple layout adjustments to entire home reinventions into every room.",
  },
  {
    href: "/services-posts/custom-carpentry-built-ins",
    image: ASSETS["692fd2dc4d63bf298d8f84f1_Image-25"],
    title: "Custom Carpentry & Built-ins",
    description:
      "From layout improvements to complete transformations into a space you’ll love.",
  },
];

const ARROW_ICON = ASSETS["692fd2dc4d63bf298d8f8514_arrow-narrow-right"];

const REVEAL_TRANSITION =
  "transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)]";

function useInView<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
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
      { threshold: 0 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  const [imageRef, curtainOpen] = useInView<HTMLDivElement>();

  return (
    <div role="listitem" className="w-full">
      <a href={card.href} className="group flex w-full max-w-full flex-col gap-[24px]">
        <div
          ref={imageRef}
          className="relative w-full overflow-hidden rounded-[12px]"
        >
          <img
            src={card.image}
            alt="Hero Image"
            width={796}
            height={1000}
            loading="lazy"
            className="block h-auto w-full rounded-[12px] transition-transform duration-[400ms] ease-[ease] group-hover:scale-110"
          />
          <div
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-[100] origin-bottom rounded-[12px] bg-white transition-transform delay-[200ms] duration-[500ms] ease-[ease]",
              curtainOpen ? "scale-y-0" : "scale-y-100",
            )}
          />
          <div className="absolute right-[24px] top-[-60px] flex h-[40px] w-[40px] items-center justify-center rounded-[100px] border border-[#112c231a] bg-white transition-transform duration-[400ms] ease-[ease] group-hover:translate-y-[80px]">
            <img
              src={ARROW_ICON}
              alt=""
              width={33}
              height={33}
              className="block h-[33px] w-[33px]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[20px] font-medium leading-[28px] tracking-[-0.5px] text-ink transition-colors duration-[400ms] ease-[ease] group-hover:text-brand md:text-[24px] md:leading-[33.6px]">
            {card.title}
          </h3>
          <p className="font-sans text-[16px] leading-[27.2px] text-slate">
            {card.description}
          </p>
        </div>
      </a>
    </div>
  );
}

export function ServicesSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [subtextRef, subtextIn] = useInView<HTMLParagraphElement>();
  const [gridRef, gridIn] = useInView<HTMLDivElement>();

  return (
    <section className="px-[20px] py-[60px] md:px-[30px] md:py-[80px] lg:px-[30px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center gap-[40px] md:gap-[56px]">
          <div className="flex max-w-[606px] flex-col items-center gap-[16px]">
            <h2
              ref={titleRef}
              className={cn(
                "text-center text-[30px] font-semibold leading-[36px] text-ink md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL_TRANSITION,
                "delay-[100ms]",
                titleIn ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,100px,0)]",
              )}
            >
              Our Renovation Services
            </h2>
            <p
              ref={subtextRef}
              className={cn(
                "max-w-[500px] text-center font-sans text-[16px] leading-[27.2px] text-slate",
                REVEAL_TRANSITION,
                "delay-[200ms]",
                subtextIn
                  ? "opacity-100 [transform:translate3d(0,0,0)]"
                  : "opacity-0 [transform:translate3d(0,100px,0)]",
              )}
            >
              From kitchen upgrades to full-home remodels — we bring quality
              craftsmanship, timeless design, and your vision to life.
            </p>
          </div>
          <div
            ref={gridRef}
            className={cn(
              "w-full",
              REVEAL_TRANSITION,
              "delay-[300ms]",
              gridIn ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,100px,0)]",
            )}
          >
            <div role="list" className="grid grid-cols-1 gap-[24px] md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <ServiceCard key={card.href} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
