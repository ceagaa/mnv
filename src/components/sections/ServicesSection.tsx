"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import {
  ClipboardCheck,
  Droplets,
  FileCheck,
  Lightbulb,
  ShieldCheck,
  Siren,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ServiceCardData = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

const SERVICE_CARDS: ServiceCardData[] = [
  {
    href: "#orcamento",
    icon: ClipboardCheck,
    title: "Consultoria e laudo de segurança contra incêndio",
    description:
      "Diagnóstico do imóvel, plano de adequação e apostilamento junto ao Corpo de Bombeiros.",
  },
  {
    href: "#orcamento",
    icon: FileCheck,
    title: "Redação e renovação de AVCB",
    description:
      "Projeto técnico, memorial e documentação completos para emissão ou renovação do Auto de Vistoria.",
  },
  {
    href: "#orcamento",
    icon: Siren,
    title: "Detecção, alarme e acionamento de incêndio",
    description:
      "Instalação e adequação de sistemas conforme a NBR 9075, com equipe qualificada.",
  },
  {
    href: "#orcamento",
    icon: Droplets,
    title: "Hidrantes e linha de reallocagem",
    description:
      "Dimensionamento e execução conforme a NBR 10897 para aprovação na vistoria.",
  },
  {
    href: "#orcamento",
    icon: Lightbulb,
    title: "Iluminação de emergência e sinalização",
    description:
      "Adequação de rotas de fuga e sinalização conforme a NBR 10844, prontas para o CBMERJ.",
  },
  {
    href: "#orcamento",
    icon: ShieldCheck,
    title: "Acompanhamento de vistoria e alvará",
    description:
      "Presença técnica em todas as etapas até a liberação do alvará do Corpo de Bombeiros.",
  },
];

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
  const Icon = card.icon;

  return (
    <div role="listitem" className="w-full">
      <a
        href={card.href}
        className="group flex h-full w-full max-w-full flex-col gap-[24px] rounded-[12px] border border-[#E4E7EF] bg-white p-[24px] transition-colors duration-[400ms] ease-[ease] hover:border-[#D62828]"
      >
        <div className="flex size-[64px] shrink-0 items-center justify-center rounded-[12px] bg-[#F6F7FA] transition-colors duration-[400ms] ease-[ease] group-hover:bg-[#0C1A3A]">
          <Icon
            aria-hidden="true"
            className="size-[32px] text-[#D62828] transition-colors duration-[400ms] ease-[ease] group-hover:text-white"
            strokeWidth={1.5}
          />
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
    <section
      id="servicos"
      className="px-[20px] py-[60px] md:px-[30px] md:py-[80px] lg:px-[30px] lg:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col items-center gap-[40px] md:gap-[56px]">
          <div className="flex max-w-[720px] flex-col items-center gap-[16px]">
            <h2
              ref={titleRef}
              className={cn(
                "text-center text-[30px] font-semibold leading-[36px] text-ink md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL_TRANSITION,
                "delay-[100ms]",
                titleIn ? "opacity-100 [transform:translate3d(0,0,0)]" : "opacity-0 [transform:translate3d(0,100px,0)]",
              )}
            >
              Serviços de legalização e prevenção e combate a incêndio
            </h2>
            <p
              ref={subtextRef}
              className={cn(
                "max-w-[640px] text-center font-sans text-[16px] leading-[27.2px] text-slate",
                REVEAL_TRANSITION,
                "delay-[200ms]",
                subtextIn
                  ? "opacity-100 [transform:translate3d(0,0,0)]"
                  : "opacity-0 [transform:translate3d(0,100px,0)]",
              )}
            >
              Serviços de legalização e adequação para obter AVCB, alvará e
              certificações de segurança contra incêndio em edifícios
              comerciais, industriais e residenciais no Rio de Janeiro.
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
                <ServiceCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
