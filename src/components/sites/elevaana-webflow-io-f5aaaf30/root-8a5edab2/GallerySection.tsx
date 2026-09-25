"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";
import { ASSETS } from "../shared/assets";

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const CHEVRON = ASSETS["692fd2dc4d63bf298d8f8524_chevron-down-2"];
const CHEVRON_HOVER = ASSETS["692fd2dc4d63bf298d8f8525_chevron-down-3"];

const CATEGORY = "California | Home renovation";

interface GalleryProject {
  title: string;
  src: string;
  size: "wide" | "narrow";
}

const PROJECTS: readonly [GalleryProject[], GalleryProject[]] = [
  [
    {
      title: "Interior & Exterior Upgrades",
      src: ASSETS["692fd2dc4d63bf298d8f8505_modern-kitchen-design-interior"],
      size: "wide",
    },
    {
      title: "Indoor & Outdoor Improvements",
      src: ASSETS["692fd2dc4d63bf298d8f8516_handyman-construction-site-process-drilling-wall-with-perforator-1"],
      size: "narrow",
    },
  ],
  [
    {
      title: "Home Interior & Exterior Updates",
      src: ASSETS["692fd2dc4d63bf298d8f8517_female-surveyor-with-clipboard-meeting-with-decorator-working-inside-property-1"],
      size: "narrow",
    },
    {
      title: "Inside & Outside Remodeling",
      src: ASSETS["692fd2dc4d63bf298d8f8518_modern-wooden-kitchen-scandinavian-interior-with-cooking-appliances-real-image"],
      size: "wide",
    },
  ],
];

const CARD_HEIGHT = "h-[255px] min-[480px]:h-[305px] md:h-[425px]";
const CARD_WIDTH: Record<GalleryProject["size"], string> = {
  wide: "lg:w-[700px] lg:max-w-[700px]",
  narrow: "lg:w-[500px] lg:max-w-[500px]",
};

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

function GalleryCard({ title, src, size }: GalleryProject) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "group relative w-full overflow-hidden rounded-[12px]",
        CARD_HEIGHT,
        CARD_WIDTH[size],
        REVEAL,
        inView ? SHOWN : HIDDEN,
      )}
    >
      <img
        src={src}
        alt="Hero Image"
        className="absolute left-0 top-0 block h-[250px] w-full object-cover min-[480px]:h-[300px] md:h-[420px]"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[180px] rounded-[12px] bg-[linear-gradient(#0000,#000c)] transition-all duration-300 ease-out lg:bottom-[-30px] lg:opacity-0 lg:group-hover:bottom-0 lg:group-hover:opacity-100 motion-reduce:transition-none" />
      <div className="absolute bottom-[24px] left-[24px] right-[24px] z-[2] flex flex-col gap-[8px] transition-all duration-300 ease-out lg:right-auto lg:bottom-[-90px] lg:group-hover:bottom-[24px] motion-reduce:transition-none">
        <p className="text-[24px] font-medium leading-[33.6px] tracking-[-0.5px] text-white">
          {title}
        </p>
        <p className="text-[16px] leading-[27.2px] text-[#F7F6F3]">{CATEGORY}</p>
      </div>
    </div>
  );
}

function GalleryRow({ projects }: { projects: readonly GalleryProject[] }) {
  return (
    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:flex lg:gap-[40px]">
      {projects.map((project) => (
        <GalleryCard key={project.title} {...project} />
      ))}
    </div>
  );
}

export function GallerySection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [ctaRef, ctaIn] = useInView<HTMLDivElement>();

  return (
    <section className="w-full px-[20px] py-[60px] font-heading md:px-[30px] md:py-[80px] lg:py-[120px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[64px]">
          <div className="flex flex-wrap items-end justify-between gap-[30px] lg:flex-nowrap">
            <div className="block">
              <p className="mb-[20px] font-sans text-[16px] font-semibold uppercase leading-[27.2px] text-[#FF6C1F]">
                Our Gallery
              </p>
              <h2
                ref={titleRef}
                className={cn(
                  "font-semibold text-[30px] leading-[36px] tracking-[0px] text-[#112C23] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                  REVEAL,
                  titleIn ? SHOWN : HIDDEN,
                )}
              >
                Our Work Gallery
              </h2>
            </div>

            <div ref={ctaRef} className={cn(REVEAL, ctaIn ? SHOWN : HIDDEN)}>
              <a href="/projects" className="group flex max-w-full items-center gap-[8px]">
                <p className="font-sans text-[18px] font-medium leading-[30.6px] text-[#112C23]">
                  See All Projects
                </p>
                <span className="relative flex h-[32px] w-[32px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F7F6F3]">
                  <img
                    src={CHEVRON}
                    alt=""
                    width={24}
                    height={24}
                    className="block transition-transform duration-300 ease-out group-hover:translate-x-[36px] motion-reduce:transition-none"
                  />
                  <img
                    src={CHEVRON_HOVER}
                    alt=""
                    width={24}
                    height={24}
                    className="absolute left-[-32px] top-[4px] block transition-transform duration-300 ease-out group-hover:translate-x-[36px] motion-reduce:transition-none"
                  />
                </span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-[20px] lg:gap-[40px]">
            {PROJECTS.map((projects) => (
              <GalleryRow key={projects[0].title} projects={projects} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
