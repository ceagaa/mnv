"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "@/lib/utils";

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

const CARD_BORDERS = [
  "border-[#E4E7EF] md:border-r",
  "border-[#E4E7EF] lg:border-r",
  "border-[#E4E7EF] md:border-r",
  "",
];

const COUNTERS = [
  {
    value: 200,
    suffix: "+",
    label: "Obras e imóveis legalizados",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[0]),
  },
  {
    value: 150,
    suffix: "+",
    label: "AVCBs emitidos junto ao CBMERJ",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[1]),
  },
  {
    value: 200,
    suffix: "+",
    label: "Projetos e laudos entregues",
    className: cn("pr-[20px] md:pr-[36px]", CARD_BORDERS[2]),
  },
  {
    value: 150,
    suffix: "+",
    label: "Clientes atendidos no Rio de Janeiro",
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
      <p className="font-medium text-[40px] leading-[40px] tracking-[0px] text-[#D62828] md:text-[56px] md:leading-[56px] lg:text-[90px] lg:leading-[90px]">
        {count}
        <span className="text-[28px] md:text-[38px] lg:text-[48px]">{suffix}</span>
      </p>
      <h3 className="font-medium text-[20px] leading-[28px] tracking-[-0.5px] text-[#0C1A3A] md:text-[24px] md:leading-[33.6px]">
        {label}
      </h3>
    </div>
  );
}

export function MetricsSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [textRef, textIn] = useInView<HTMLDivElement>();

  return (
    <section
      id="vantagens"
      className="w-full bg-[#F6F7FA] px-[20px] py-[60px] font-heading md:px-[30px] md:py-[80px] lg:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[95px]">
          <div className="flex flex-col items-start justify-between gap-[30px] md:flex-row">
            <h2
              ref={titleRef}
              className={cn(
                "max-w-[600px] font-semibold text-[30px] leading-[36px] tracking-[0px] text-[#0C1A3A] md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                titleIn ? SHOWN : HIDDEN,
              )}
            >
              Por que empresas do Rio confiam a legalização à MNV
            </h2>
            <div
              ref={textRef}
              className={cn(
                "flex w-full max-w-full flex-col gap-[24px] md:w-[71%] md:max-w-[500px] lg:w-auto",
                REVEAL,
                textIn ? SHOWN : HIDDEN,
              )}
            >
              <h3 className="font-medium text-[20px] leading-[28px] tracking-[-0.5px] text-[#0C1A3A] md:text-[24px] md:leading-[33.6px]">
                A MNV entrega mais que segurança: entrega aprovação na vistoria
                do Corpo de Bombeiros.
              </h3>
              <p className="font-sans text-[16px] leading-[27.2px] text-[#55607A]">
                Cada etapa é executada conforme as Instruções Técnicas do CBMERJ
                e as normas ABNT, com relatório claro do que precisa ser feito
                antes da vistoria. Você sabe o custo, o prazo e o que falta para
                obter o AVCB — sem surpresa e sem obra desnecessária.
              </p>
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
