"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";

import { ASSETS } from "@/lib/assets";

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";

const STAR_FILLED = ASSETS.starFilled;
const STAR_EMPTY = ASSETS.starEmpty;

const MARQUEE_CSS = `
@keyframes tcol-up{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes tcol-down{from{transform:translateY(-50%)}to{transform:translateY(0)}}
.tgrid{display:grid}
.tmarquee{display:none}
.tcol{overflow:hidden;height:640px}
.tcol-track{display:flex;flex-direction:column;animation:tcol-up 28s linear infinite;will-change:transform}
.tcol-track.is-down{animation-name:tcol-down}
.tcol-item{margin-bottom:25px}
@media (min-width:1024px){
  .tgrid{display:none}
  .tmarquee{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}
}
@media (prefers-reduced-motion: reduce){
  .tgrid{display:grid}
  .tmarquee{display:none}
}
`;

const MARQUEE_COLUMNS = [
  { items: [0, 3], duration: "30s", delay: "-4s", down: false },
  { items: [1, 4], duration: "34s", delay: "-12s", down: true },
  { items: [2, 5], duration: "26s", delay: "-7s", down: false },
] as const;

const CARD_DELAYS = [
  "delay-[0ms]",
  "delay-[80ms]",
  "delay-[160ms]",
  "delay-[240ms]",
  "delay-[320ms]",
  "delay-[400ms]",
] as const;

const TESTIMONIALS = [
  {
    stars: 5,
    quote:
      "“Obtivemos o AVCB na primeira vistoria. A equipe da MNV deixou tudo documentado antes do dia da inspeção.”",
    name: "Ricardo Almeida",
    position: "Síndico · Condomínio na Barra",
  },
  {
    stars: 5,
    quote:
      "“A obra parou esperando o Corpo de Bombeiros. Com o projeto adequado, liberaram o alvará em tempo recorde.”",
    name: "Fernanda Costa",
    position: "Gerente de Obras · Rio de Janeiro",
  },
  {
    stars: 5,
    quote:
      "“Renovamos o AVCB sem dor de cabeça: a MNV cuidou de laudo, documentação e acompanhamento da vistoria.”",
    name: "Marcelo Ribeiro",
    position: "Diretor Administrativo · Comercial",
  },
  {
    stars: 5,
    quote:
      "“Explicaram exatamente o que a NBR 9075 exigia no nosso pavimento e executaram sem desperdício.”",
    name: "Patrícia Lemos",
    position: "Engenheira de Manutenção",
  },
  {
    stars: 5,
    quote:
      "“Precisávamos abrir a loja no prazo e o laudo de segurança contra incêndio saiu antes da data prevista.”",
    name: "Gustavo Nogueira",
    position: "Responsável pela Loja · Zona Sul",
  },
  {
    stars: 5,
    quote:
      "“Adequaram hidrantes, sinalização e iluminação de emergência com equipe organizada e relatório claro.”",
    name: "Ana Paula Ferreira",
    position: "Coordenadora de Facilities",
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

function StarRow({ filled }: { filled: number }) {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={index < filled ? STAR_FILLED : STAR_EMPTY}
          alt=""
          width={32}
          height={32}
          className="block size-[32px] max-w-full"
        />
      ))}
    </div>
  );
}

interface TestimonialCardProps {
  stars: number;
  quote: string;
  name: string;
  position: string;
  delay: string;
}

function TestimonialCard({ stars, quote, name, position, delay }: TestimonialCardProps) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-start justify-between gap-[20px] rounded-[12px] bg-[#14213D] p-[20px] md:gap-[40px] md:p-[24px] lg:gap-[40px] lg:p-[40px]",
        REVEAL,
        delay,
        inView ? SHOWN : HIDDEN,
      )}
    >
      <StarRow filled={stars} />

      <h3 className="w-full font-heading text-[20px] leading-[28px] font-medium tracking-[-0.5px] text-white md:text-[24px] md:leading-[33.6px]">
        {quote}
      </h3>

      <div className="mt-[8px] flex flex-col">
        <p className="font-sans text-[16px] leading-[27.2px] font-semibold text-white">
          {name}
        </p>
        <p className="font-sans text-[14px] leading-[23.8px] text-[#C9D2E6]">{position}</p>
      </div>
    </div>
  );
}

export function TestimonialSection() {
  const [titleRef, titleIn] = useInView<HTMLHeadingElement>();
  const [subtextRef, subtextIn] = useInView<HTMLParagraphElement>();

  return (
    <section
      id="depoimentos"
      className="w-full overflow-hidden bg-[#0C1A3A] px-[20px] py-[60px] font-heading text-[14px] leading-[20px] font-normal text-white md:px-[30px] md:py-[80px] lg:px-[30px] lg:py-[120px]"
    >
      <style>{MARQUEE_CSS}</style>
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[40px] md:gap-[60px] lg:gap-[64px]">
          <div className="flex flex-col items-center gap-[16px]">
            <h2
              ref={titleRef}
              className={cn(
                "text-center font-heading text-[30px] leading-[36px] font-semibold text-white md:text-[44px] md:leading-[52.8px] md:tracking-[-1px] lg:text-[56px] lg:leading-[67.2px] lg:tracking-[-1.5px]",
                REVEAL,
                titleIn ? SHOWN : HIDDEN,
              )}
            >
              Entregando mais que segurança: aprovação comprovada
            </h2>
            <p
              ref={subtextRef}
              className={cn(
                "max-w-[560px] text-center font-sans text-[16px] leading-[27.2px] text-[#C9D2E6]",
                REVEAL,
                subtextIn ? SHOWN : HIDDEN,
              )}
            >
              Empresas e condomínios do Rio de Janeiro que precisavam abrir,
              vistoriar ou renovar o AVCB confiaram o processo à MNV e
              receberam a liberação dentro do prazo previsto.
            </p>
          </div>

          <div className="tgrid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px]">
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name}
                stars={testimonial.stars}
                quote={testimonial.quote}
                name={testimonial.name}
                position={testimonial.position}
                delay={CARD_DELAYS[index] ?? ""}
              />
            ))}
          </div>

          <div className="tmarquee">
            {MARQUEE_COLUMNS.map((column) => (
              <div key={column.items.join("-")} className="tcol">
                <div
                  className={cn("tcol-track", column.down && "is-down")}
                  style={{
                    animationDuration: column.duration,
                    animationDelay: column.delay,
                  }}
                >
                  {[...column.items, ...column.items].map(
                    (itemIndex, copyIndex) => {
                      const testimonial = TESTIMONIALS[itemIndex];
                      const duplicate = copyIndex >= column.items.length;
                      return (
                        <div
                          key={`${column.items.join("-")}-${copyIndex}`}
                          className="tcol-item"
                          aria-hidden={duplicate ? "true" : undefined}
                        >
                          <TestimonialCard
                            stars={testimonial.stars}
                            quote={testimonial.quote}
                            name={testimonial.name}
                            position={testimonial.position}
                            delay={
                              duplicate ? "" : (CARD_DELAYS[itemIndex] ?? "")
                            }
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
