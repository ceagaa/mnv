"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

const REVEAL =
  "transition-[opacity,transform] duration-[1000ms] ease-[cubic-bezier(0.165,0.84,0.44,1)] motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,100px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const FIRE_CSS = `
@keyframes cta-flame-flicker{0%{transform:scaleX(1) scaleY(1);opacity:.45}50%{transform:scaleX(.97) scaleY(1.14);opacity:.75}100%{transform:scaleX(1.03) scaleY(.96);opacity:.55}}
@keyframes cta-ember-rise{0%{transform:translateY(0) scale(1);opacity:0}12%{opacity:.95}100%{transform:translateY(-300px) scale(.35);opacity:0}}
.cta-flame{position:absolute;bottom:-7%;border-radius:50%;mix-blend-mode:screen;filter:blur(30px);transform-origin:50% 100%;animation:cta-flame-flicker 2.6s ease-in-out infinite alternate}
.cta-ember{position:absolute;bottom:14px;border-radius:50%;background:#FFD166;box-shadow:0 0 8px 2px rgba(255,154,61,.75);opacity:0;animation-name:cta-ember-rise;animation-timing-function:ease-out;animation-iteration-count:infinite}
@media (prefers-reduced-motion: reduce){.cta-flame,.cta-ember{animation:none}.cta-ember{opacity:.6}}
`;

const FLAMES = [
  {
    className: "left-[3%] h-[170px] w-[340px] max-[768px]:w-[240px]",
    background:
      "radial-gradient(ellipse at 50% 100%, #FFD166 0%, #FF9A3D 40%, rgba(255,90,82,0) 72%)",
    animationDuration: "2.2s",
    animationDelay: "0s",
  },
  {
    className: "left-[26%] h-[200px] w-[460px] max-[768px]:w-[300px]",
    background:
      "radial-gradient(ellipse at 50% 100%, #FFB43D 0%, #FF7A3D 42%, rgba(160,29,34,0) 74%)",
    animationDuration: "2.9s",
    animationDelay: "0.5s",
  },
  {
    className: "left-[54%] h-[160px] w-[300px] max-[768px]:w-[220px]",
    background:
      "radial-gradient(ellipse at 50% 100%, #FFE08A 0%, #FF9A3D 45%, rgba(255,90,82,0) 70%)",
    animationDuration: "2.4s",
    animationDelay: "0.9s",
  },
  {
    className: "left-[74%] h-[180px] w-[400px] max-[768px]:w-[260px]",
    background:
      "radial-gradient(ellipse at 50% 100%, #FFC14D 0%, #FF5A52 44%, rgba(214,40,40,0) 72%)",
    animationDuration: "3.1s",
    animationDelay: "0.25s",
  },
] as const;

const EMBERS = [
  { left: 5, size: 6, duration: "4.6s", delay: "0s" },
  { left: 13, size: 4, duration: "5.4s", delay: "1.2s" },
  { left: 21, size: 7, duration: "4.1s", delay: "2.4s" },
  { left: 30, size: 5, duration: "6s", delay: "0.6s" },
  { left: 38, size: 4, duration: "5s", delay: "3.1s" },
  { left: 46, size: 8, duration: "4.4s", delay: "1.8s" },
  { left: 55, size: 5, duration: "5.8s", delay: "2.8s" },
  { left: 63, size: 6, duration: "4.9s", delay: "0.3s" },
  { left: 71, size: 4, duration: "6.3s", delay: "3.6s" },
  { left: 79, size: 7, duration: "4.3s", delay: "2.1s" },
  { left: 87, size: 5, duration: "5.6s", delay: "1.5s" },
  { left: 94, size: 6, duration: "5.2s", delay: "3.9s" },
] as const;

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
    <section
      id="contato"
      className="relative block overflow-hidden bg-[#D62828] px-[30px] pt-[80px] pb-[80px] font-heading text-[14px] leading-[20px] max-[479px]:px-[20px] max-[479px]:pt-[60px] max-[479px]:pb-[60px] lg:pt-[124px] lg:pb-[144px]"
    >
      <style>{FIRE_CSS}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      >
        {FLAMES.map((flame) => (
          <span
            key={flame.animationDelay}
            className={cn("cta-flame", flame.className)}
            style={{
              background: flame.background,
              animationDuration: flame.animationDuration,
              animationDelay: flame.animationDelay,
            }}
          />
        ))}
        {EMBERS.map((ember) => (
          <span
            key={`${ember.left}-${ember.delay}`}
            className="cta-ember"
            style={{
              left: `${ember.left}%`,
              width: ember.size,
              height: ember.size,
              animationDuration: ember.duration,
              animationDelay: ember.delay,
            }}
          />
        ))}
      </div>
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
                Sua vistoria do CBMERJ está marcada? Garanta a aprovação.
              </h2>
              <div ref={subtextRef} className="w-full max-w-[560px]">
                <p
                  className={cn(
                    "w-full text-center font-sans text-[16px] leading-[27.2px] text-white",
                    REVEAL,
                    "delay-[200ms]",
                    subtextIn ? SHOWN : HIDDEN,
                  )}
                >
                  Receba um diagnóstico do seu imóvel e o passo a passo para
                  obter o AVCB sem surpresas na vistoria do Corpo de Bombeiros.
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
                href="#orcamento"
                className="group inline-block max-w-full cursor-pointer no-underline"
              >
                <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-white p-[16px_32px] transition-[background-color] duration-500">
                  <div className="relative block overflow-hidden">
                    <p className="relative z-[2] whitespace-nowrap font-heading text-[16px] leading-[27.2px] font-medium text-[#A01D22] transition-transform duration-300 ease group-hover:-translate-y-[30px]">
                      Solicitar Orçamento de Legalização
                    </p>
                    <p className="absolute bottom-[-30px] left-0 z-[2] whitespace-nowrap font-heading text-[16px] leading-[27.2px] font-medium text-white transition-transform duration-300 ease group-hover:-translate-y-[30px]">
                      Solicitar Orçamento de Legalização
                    </p>
                  </div>
                  <div className="absolute left-[-2px] top-0 h-full w-0 bg-[#A01D22] transition-[width] duration-200 ease group-hover:w-[102%]" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
