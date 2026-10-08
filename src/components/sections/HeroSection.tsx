"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "@/lib/assets";

const HERO_BG = "/hero-img.jpg";

const REVEAL_CLASSES =
  "transition-[opacity,translate,transform] duration-[600ms] ease-out motion-reduce:transition-none";

const FEATURE_CARDS = [
  {
    icon: ASSETS.iconConsultant,
    title: "Conhecimento das ITs do CBMERJ",
    body: "Projetos e adequações executados conforme as Instruções Técnicas do Corpo de Bombeiros do Rio de Janeiro.",
    delay: "delay-[320ms]",
  },
  {
    icon: ASSETS.iconLegal,
    title: "Do diagnóstico à emissão do AVCB",
    body: "Acompanhamos documento, obra e vistoria até a liberação do alvará, sem retrabalho e sem multa.",
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
        <p className="font-sans text-[16px] leading-[27.2px] font-semibold text-[#0C1A3A]">
          {title}
        </p>
      </div>
      <div className="h-[1px] border border-dashed border-[#E4E7EF] opacity-60" />
      <p className="font-sans text-[14px] leading-[23.8px] text-[#55607A]">
        {body}
      </p>
    </div>
  );
}

export function HeroSection() {
  const revealed = useLoadReveal();

  return (
    <section
      id="inicio"
      className="bg-cover bg-left-top bg-no-repeat bg-fixed text-[14px] leading-[20px] px-[30px] pt-[100px] pb-[60px] font-heading max-[992px]:pt-[80px] max-[768px]:pt-[60px] max-[768px]:bg-center max-[768px]:bg-scroll max-[480px]:px-[20px]"
      style={{
        backgroundColor: "#0C1A3A",
        backgroundImage: `linear-gradient(90deg, rgba(12,26,58,0.94) 0%, rgba(12,26,58,0.88) 50%, rgba(12,26,58,0.62) 100%), url(${HERO_BG})`,
      }}
    >
      <link rel="preload" as="image" href={HERO_BG} />
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-[70px] max-[768px]:gap-[60px] max-[480px]:gap-[40px]">
          <div className="max-w-[720px]">
            <p
              className={cn(
                "mb-[20px] font-sans text-[16px] leading-[27.2px] font-semibold uppercase text-[#FF5A52]",
                reveal(revealed, "")
              )}
            >
              Legalização junto ao Corpo de Bombeiros no Rio de Janeiro
            </p>

            <h1
              className={cn(
                "text-[52px] leading-[60px] font-bold tracking-[-1.5px] [font-kerning:none] [font-variant-ligatures:none] text-white max-[992px]:text-[48px] max-[992px]:leading-[56px] max-[992px]:tracking-[-1px] max-[768px]:text-[38px] max-[768px]:leading-[46px] max-[768px]:tracking-[-0.5px] max-[480px]:text-[32px] max-[480px]:leading-[38px] max-[480px]:tracking-[-0.5px]",
                reveal(revealed, "delay-[80ms]")
              )}
            >
              Segurança contra incêndio e pânico: da consultoria à aprovação do
              AVCB no Rio de Janeiro
            </h1>

            <p
              className={cn(
                "mt-[24px] mb-[32px] max-w-[560px] font-sans text-[18px] leading-[30.6px] text-[#DCE3F0]",
                reveal(revealed, "delay-[160ms]")
              )}
            >
              Somos especialistas em serviços e consultoria para legalização,
              redação de AVCB e demais certificações e alvarás. Assumimos o
              processo junto ao CBMERJ, projeto, adequação, vistoria e emissão,
              para sua obra ou estabelecimento ser aprovado sem retrabalho.
            </p>

            <div
              className={cn(
                "flex flex-wrap items-center gap-[24px]",
                reveal(revealed, "delay-[240ms]")
              )}
            >
              <a
                href="#orcamento"
                className="group inline-block max-w-full cursor-pointer no-underline"
              >
                <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#D62828] p-[16px_26px] transition-[background-color] duration-500 group-hover:bg-[#A01D22]">
                  <div className="relative overflow-hidden">
                    <div className="relative z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px]">
                      Solicitar Orçamento de Legalização
                    </div>
                    <div className="absolute bottom-[-30px] left-0 z-[2] font-heading text-[16px] leading-[27.2px] font-medium whitespace-nowrap text-white transition-transform duration-300 ease-out group-hover:-translate-y-[30px]">
                      Solicitar Orçamento de Legalização
                    </div>
                  </div>
                </div>
              </a>

              <a
                href="#servicos"
                className="font-sans text-[16px] leading-[27.2px] font-medium text-white no-underline underline-offset-4 hover:underline focus-visible:underline"
              >
                Ver serviços de AVCB
              </a>
            </div>

            <p
              className={cn(
                "mt-[24px] font-sans text-[14px] leading-[23.8px] font-medium tracking-[0.5px] uppercase text-[#B9C2D6]",
                reveal(revealed, "delay-[320ms]")
              )}
            >
              CBMERJ · AVCB · NR-23 · Normas ABNT
            </p>
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
