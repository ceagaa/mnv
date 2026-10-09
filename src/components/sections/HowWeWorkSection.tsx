"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/assets";

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
  width: number;
  height: number;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    number: ASSETS.step1,
    width: 134,
    height: 200,
    title: "Diagnóstico e consultoria",
    description:
      "Visitamos o imóvel, verificamos sistemas e documentos e entregamos o plano de adequação com custo e prazo definidos.",
  },
  {
    number: ASSETS.step2,
    width: 143,
    height: 200,
    title: "Projeto e documentação",
    description:
      "Elaboramos projeto técnico, memorial e apostilamento conforme as normas ABNT e as Instruções Técnicas do CBMERJ.",
  },
  {
    number: ASSETS.step3,
    width: 143,
    height: 200,
    title: "Adequação e instalação",
    description:
      "Executamos o que a vistoria exige: detecção, alarme, hidrantes, iluminação de emergência e sinalização de rotas de fuga.",
  },
  {
    number: ASSETS.step4,
    width: 154,
    height: 200,
    title: "Vistoria e emissão do AVCB",
    description:
      "Acompanhamos a vistoria do Corpo de Bombeiros e o processo até a emissão do AVCB e da liberação do alvará.",
  },
];

export function HowWeWorkSection() {
  return (
    <section
      id="metodo"
      className="relative bg-[#0C1A3A] px-[30px] py-[120px] max-[992px]:py-[80px] max-[768px]:py-[60px] max-[480px]:px-[20px]"
    >
      <img
        src={ASSETS.texture}
        alt=""
        className="absolute inset-0 h-full w-full max-w-full object-cover"
      />
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative z-[2] flex flex-col gap-[177px] max-[992px]:gap-[80px] max-[768px]:gap-[60px]">
          <div>
            <p className="mb-[20px] font-sans text-[16px] font-semibold uppercase leading-[27.2px] text-[#FF5A52]">
              Como trabalhamos
            </p>
            <Reveal>
              <h2 className="font-heading text-[56px] font-semibold leading-[67.2px] tracking-[-1.5px] text-white max-[992px]:text-[44px] max-[992px]:leading-[52.8px] max-[992px]:tracking-[-1px] max-[768px]:text-[35px] max-[768px]:leading-[42px] max-[768px]:tracking-[-0.5px] max-[480px]:text-[30px] max-[480px]:leading-[36px] max-[480px]:tracking-[0px]">
                Da consultoria à aprovação: a legalização em 4 etapas
              </h2>
            </Reveal>
            <p className="mt-[24px] max-w-[620px] font-sans text-[16px] leading-[27.2px] text-[#C9D2E6]">
              Método da MNV para obter o AVCB: diagnóstico do imóvel, projeto
              técnico, adequação dos sistemas e acompanhamento da vistoria junto
              ao CBMERJ no Rio de Janeiro.
            </p>
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
                  width={step.width}
                  height={step.height}
                  className="h-auto max-w-full max-[992px]:w-[100px] max-[480px]:w-[60px]"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-[8px] max-[480px]:w-full max-[480px]:flex-none">
                  <h3 className="max-w-[240px] font-heading text-[36px] font-medium leading-[50.4px] tracking-[-1px] text-white max-[768px]:text-[30px] max-[768px]:leading-[42px] max-[768px]:tracking-[-0.5px] max-[480px]:max-w-full max-[480px]:text-[28px] max-[480px]:leading-[39.2px] max-[480px]:tracking-[0px]">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[16px] font-normal leading-[27.2px] text-[#C9D2E6]">
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
