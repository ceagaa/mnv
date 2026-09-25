"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const REVEAL_CLASSES =
  "transition-[opacity,translate,transform] duration-[600ms] ease-out motion-reduce:transition-none";

const FEATURE_CARDS = [
  {
    icon: ASSETS["692fd2dc4d63bf298d8f8511_consultant-1"],
    title: "Free In-Home Consultation",
    body: "We’ll visit your space, listen to your goals, and provide expert advice — no pressure, no obligation.",
    delay: "delay-[320ms]",
  },
  {
    icon: ASSETS["692fd2dc4d63bf298d8f8512_legal-1"],
    title: "Licensed & Insured Experts",
    body: "Homeowners love our work — rated 4.9/5 on Google for quality, reliability, and stunning results.",
    delay: "delay-[400ms]",
  },
] as const;

function useLoadReveal() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setRevealed(true), 50);
    return () => window.clearTimeout(id);
  }, []);

  return revealed;
}

function reveal(revealed: boolean, delay: string) {
  return cn(
    REVEAL_CLASSES,
    delay,
    revealed ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,20px,0)]"
  );
}

function FeatureCard({
  icon,
  title,
  body,
  className,
}: {
  icon: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[16px] rounded-[12px] bg-white p-[32px_24px] max-[480px]:p-[20px]",
        className
      )}
    >
      <div className="flex items-center gap-[12px]">
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          className="block size-[32px] max-w-full"
        />
        <p className="font-sans text-[16px] leading-[27.2px] font-semibold text-[#112C23]">
          {title}
        </p>
      </div>
      <div className="h-[1px] border border-dashed border-[#47564E] opacity-30" />
      <p className="font-sans text-[14px] leading-[23.8px] text-[#47564E]">
        {body}
      </p>
    </div>
  );
}

export function HeroSection() {
  const revealed = useLoadReveal();

  return (
    <section
      className="bg-cover bg-left-top bg-no-repeat bg-fixed text-[14px] leading-[20px] px-[30px] pt-[100px] pb-[46px] font-heading max-[992px]:pt-[80px] max-[768px]:pt-[60px] max-[768px]:bg-[position:-65px_0] max-[768px]:bg-scroll max-[480px]:px-[20px]"
      style={{ backgroundImage: `url(${ASSETS["hero-background"]})` }}
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-[70px] max-[768px]:gap-[60px] max-[480px]:gap-[40px]">
          <div className="max-w-[720px]">
            <p
              className={cn(
                "mb-[20px] font-sans text-[16px] leading-[27.2px] font-semibold uppercase text-[#FF6C1F]",
                reveal(revealed, "")
              )}
            >
              Crafting Beautiful Spaces
            </p>

            <h1
              className={cn(
                "text-[68px] leading-[78.2px] font-bold tracking-[-2px] [font-kerning:none] [font-variant-ligatures:none] text-[#112C23] max-[992px]:text-[56px] max-[992px]:leading-[64.4px] max-[992px]:tracking-[-1px] max-[768px]:text-[44px] max-[768px]:leading-[50.6px] max-[768px]:tracking-[-0.5px] max-[480px]:text-[38px] max-[480px]:leading-[43.7px] max-[480px]:tracking-[-0.5px]",
                reveal(revealed, "delay-[80ms]")
              )}
            >
              #1 Home Renovation Company in Sao Paolo
            </h1>

            <p
              className={cn(
                "mt-[24px] mb-[32px] max-w-[411px] font-sans text-[18px] leading-[30.6px] text-[#112C23]",
                reveal(revealed, "delay-[160ms]")
              )}
            >
              From kitchen upgrades to full-home remodels — we bring quality
              craftsmanship, timeless design, and your vision to life.
            </p>

            <div className={reveal(revealed, "delay-[240ms]")}>
              <a
                href="/contact-us"
                className="group inline-block max-w-full cursor-pointer no-underline"
              >
                <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#FF6C1F] p-[16px_26px] transition-[background-color] duration-500">
                  <div className="relative overflow-hidden">
                    <div className="relative z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px]">
                      Book A Free Consultation
                    </div>
                    <div className="absolute bottom-[-30px] left-0 z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px]">
                      Book A Free Consultation
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[-2px] h-full w-0 bg-[#112C23]" />
                </div>
              </a>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="grid w-full max-w-[655px] grid-cols-2 gap-[24px] max-[480px]:grid-cols-1">
              {FEATURE_CARDS.map((card) => (
                <FeatureCard
                  key={card.title}
                  icon={card.icon}
                  title={card.title}
                  body={card.body}
                  className={reveal(revealed, card.delay)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
