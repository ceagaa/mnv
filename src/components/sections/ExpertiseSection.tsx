"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "@/lib/assets";

const PHOTO_SRC = "/thumb.jpg";
const ICON_CONSULTANT = ASSETS.iconConsultant;
const ICON_LEGAL = ASSETS.iconLegal;

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const BUTTON_TEXT =
  "z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px] motion-reduce:transition-none";

const CARDS = [
  {
    icon: ICON_CONSULTANT,
    title: "Conhecimento das ITs do CBMERJ",
    body: "Projetos e adequações elaborados a partir das Instruções Técnicas do Corpo de Bombeiros do Rio de Janeiro.",
    delay: "delay-[100ms]",
  },
  {
    icon: ICON_LEGAL,
    title: "Projetos conforme a norma ABNT",
    body: "NBR 9075, NBR 10844 e NBR 10897 aplicadas no dimensionamento de detecção, emergência e hidrantes.",
    delay: "delay-[200ms]",
  },
  {
    icon: ICON_CONSULTANT,
    title: "Acompanhamento até o AVCB",
    body: "Do diagnóstico à vistoria, um especialista conduz o processo para que a aprovação aconteça sem retrabalho.",
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
      <div className="flex size-[60px] items-center justify-center rounded-[12px] bg-[#F6F7FA] md:size-[80px]">
        <img
          src={icon}
          alt=""
          width={32}
          height={32}
          className="block size-[24px] max-w-full md:size-[32px]"
        />
      </div>
      <div className="flex w-full flex-col gap-[12px]">
        <h3 className="font-sans text-[16px] leading-[27.2px] font-semibold text-[#0C1A3A]">
          {title}
        </h3>
        <p className="font-sans text-[16px] leading-[27.2px] text-[#55607A]">{body}</p>
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
    <section
      id="sobre"
      className="px-[20px] py-[60px] font-heading md:px-[30px] md:py-[80px] lg:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[60px] md:gap-[80px] lg:gap-[96px]">
          <div className="flex flex-col items-center gap-[40px] md:gap-[60px] lg:flex-row lg:gap-[60px]">
            <div
              ref={photoRef}
              className="relative w-full max-w-full overflow-hidden rounded-[12px] md:max-w-[80%] lg:max-w-[540px]"
            >
              <img
                src={PHOTO_SRC}
                alt="Ilustração de prevenção contra incêndio: extintor, escudo, sirene e checklist de vistoria"
                width={2000}
                height={2000}
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
                    "text-[28px] leading-[33.6px] font-semibold tracking-[0px] text-[#0C1A3A] md:text-[38px] md:leading-[45.6px] md:tracking-[-1px] lg:text-[48px] lg:leading-[57.6px] lg:tracking-[-1.5px]",
                    REVEAL,
                    "delay-[200ms]",
                    titleIn ? SHOWN : HIDDEN,
                  )}
                >
                  Especialistas em legalização junto ao Corpo de Bombeiros do
                  Rio de Janeiro
                </h2>
                <p
                  ref={descriptionRef}
                  className={cn(
                    "max-w-[520px] font-sans text-[16px] leading-[27.2px] text-[#55607A]",
                    REVEAL,
                    "delay-[300ms]",
                    descriptionIn ? SHOWN : HIDDEN,
                  )}
                >
                  A MNV nasceu para resolver o que atrasa obras: a aprovação do
                  Corpo de Bombeiros. Unindo serviços e consultoria, cuidamos da
                  documentação, dos projetos e da adequação física do imóvel para
                  que a vistoria seja aprovada na primeira visita, em
                  conformidade com as normas ABNT, a NR-23 e as Instruções
                  Técnicas do CBMERJ.
                </p>
              </div>

              <div
                ref={buttonRef}
                className={cn(REVEAL, "delay-[400ms]", buttonIn ? SHOWN : HIDDEN)}
              >
                <a href="#metodo" className="group inline-block max-w-full cursor-pointer">
                  <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#D62828] p-[16px_26px] transition-[background-color] duration-500">
                    <div className="relative overflow-hidden">
                      <p className={cn(BUTTON_TEXT, "relative")}>
                        Conhecer nosso método de trabalho
                      </p>
                      <p className={cn(BUTTON_TEXT, "absolute bottom-[-30px] left-0")}>
                        Conhecer nosso método de trabalho
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-[-2px] h-full w-0 bg-[#A01D22] transition-[width] duration-200 ease-out group-hover:w-[102%] motion-reduce:transition-none" />
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
