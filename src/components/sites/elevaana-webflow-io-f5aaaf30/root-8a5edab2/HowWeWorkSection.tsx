"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ASSETS } from "../shared/assets";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setInView(true));
      return;
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
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function Reveal({ children, className }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-[600ms] ease-out",
        inView ? "[transform:translate3d(0,0,0)] opacity-100" : "[transform:translate3d(0,56px,0)] opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

type Step = {
  number: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: ASSETS["692fd2dc4d63bf298d8f8520_1."],
    title: "Discovery and Consultation",
    description:
      "We begin by listening — understanding your needs, lifestyle, and vision. We’ll visit your space, offer ideas, and discuss your goals in detail.",
  },
  {
    number: ASSETS["692fd2dc4d63bf298d8f8522_2."],
    title: "Design and Planning",
    description:
      "Our team develops a custom renovation plan, complete with layout concepts, material suggestions, and clear timelines — all tailored to you.",
  },
  {
    number: ASSETS["692fd2dc4d63bf298d8f851f_3."],
    title: "Estimate and Approval",
    description:
      "You’ll receive a detailed project quote with transparent pricing. Once approved, we finalize the schedule and begin preparing for the build.",
  },
  {
    number: ASSETS["692fd2dc4d63bf298d8f8521_4."],
    title: "Construction Begins",
    description:
      "Our licensed professionals handle every phase of construction with precision, professionalism, and regular updates — so you're never late.",
  },
];

export function HowWeWorkSection() {
  return (
    <section className="relative bg-[#112C23] px-[30px] py-[120px] max-[992px]:py-[80px] max-[768px]:py-[60px] max-[480px]:px-[20px]">
      <img
        src={ASSETS["692fd2dc4d63bf298d8f8523_texture202-p-1600"]}
        alt=""
        className="absolute inset-0 h-full w-full max-w-full object-cover"
      />
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative z-[2] flex flex-col gap-[177px] max-[992px]:gap-[80px] max-[768px]:gap-[60px]">
          <div>
            <p className="mb-[20px] font-sans text-[16px] font-semibold uppercase leading-[27.2px] text-[#FF6C1F]">
              How we work
            </p>
            <Reveal>
              <h2 className="font-heading text-[56px] font-semibold leading-[67.2px] tracking-[-1.5px] text-white max-[992px]:text-[44px] max-[992px]:leading-[52.8px] max-[992px]:tracking-[-1px] max-[768px]:text-[35px] max-[768px]:leading-[42px] max-[768px]:tracking-[-0.5px] max-[480px]:text-[30px] max-[480px]:leading-[36px] max-[480px]:tracking-[0px]">
                Our Renovation Process
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-x-[60px] gap-y-[140px] max-[992px]:gap-x-[30px] max-[992px]:gap-y-[60px] max-[768px]:grid-cols-1 max-[768px]:gap-x-[40px] max-[768px]:gap-y-[40px]">
            {STEPS.map((step) => (
              <Reveal
                key={step.title}
                className="flex items-center gap-[40px] max-[992px]:gap-[20px] max-[480px]:flex-col max-[480px]:items-start"
              >
                <img
                  src={step.number}
                  alt=""
                  className="h-auto max-w-full max-[992px]:w-[100px] max-[480px]:w-[60px]"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[8px] max-[480px]:w-full max-[480px]:flex-none">
                  <h3 className="max-w-[240px] font-heading text-[36px] font-medium leading-[50.4px] tracking-[-1px] text-white max-[768px]:text-[30px] max-[768px]:leading-[42px] max-[768px]:tracking-[-0.5px] max-[480px]:max-w-full max-[480px]:text-[28px] max-[480px]:leading-[39.2px] max-[480px]:tracking-[0px]">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[16px] font-normal leading-[27.2px] text-[#F7F6F3] opacity-70">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
