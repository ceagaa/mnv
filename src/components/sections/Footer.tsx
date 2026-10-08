"use client";

import Link from "next/link";

import { useEffect, useRef, useState, type RefObject } from "react";

import { cn } from "@/lib/utils";
import { ASSETS } from "@/lib/assets";
import { BrandLogo } from "./BrandLogo";

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

interface SocialLink {
  readonly src: string;
  readonly href: string;
  readonly label: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    src: ASSETS.instagram,
    href: "https://www.instagram.com/legalizacaomnv/",
    label: "Instagram da MNV",
  },
];

interface MenuLink {
  readonly label: string;
  readonly href: string;
}

interface MenuColumnData {
  readonly title: string;
  readonly links: readonly MenuLink[];
}

const MENU_COLUMNS: readonly MenuColumnData[] = [
  {
    title: "Serviços",
    links: [
      { label: "Consultoria e laudo", href: "#servicos" },
      { label: "Redação e renovação de AVCB", href: "#servicos" },
      { label: "Detecção, alarme e acionamento", href: "#servicos" },
      { label: "Hidrantes e reallocagem", href: "#servicos" },
      { label: "Iluminação de emergência", href: "#servicos" },
      { label: "Vistoria e alvará", href: "#servicos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Início", href: "#inicio" },
      { label: "Sobre nós", href: "#sobre" },
      { label: "Método de trabalho", href: "#metodo" },
      { label: "Depoimentos", href: "#depoimentos" },
      { label: "Perguntas frequentes", href: "#faq" },
      { label: "Solicitar orçamento", href: "#orcamento" },
    ],
  },
];

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

function MenuColumn({ title, links }: MenuColumnData) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-stretch gap-[20px] md:items-start",
        REVEAL,
        inView ? SHOWN : HIDDEN,
      )}
    >
      <p className="mb-[4px] font-heading text-[18px] leading-[30.6px] font-medium text-white">
        {title}
      </p>
      <div className="flex flex-col gap-[12px]">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-sans text-[16px] leading-[27.2px] text-[#B9C2D6] no-underline transition-colors duration-500 hover:text-[#FF5A52] focus-visible:text-[#FF5A52]"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  const [leftRef, leftIn] = useInView<HTMLDivElement>();
  const [ctaRef, ctaIn] = useInView<HTMLDivElement>();
  const [bottomRef, bottomIn] = useInView<HTMLDivElement>();

  return (
    <footer
      id="orcamento"
      className="w-full bg-[#0C1A3A] px-[30px] py-[60px] max-[479px]:px-[20px] md:py-[76px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-[80px] max-[479px]:gap-[40px] md:gap-[60px] lg:gap-[80px]">
          <div className="flex flex-col gap-[60px] md:gap-[80px]">
            <div className="flex flex-col items-start justify-between gap-[40px] md:grid md:grid-cols-2 md:gap-[30px] lg:flex lg:flex-row">
              <div
                ref={leftRef}
                className={cn(
                  "flex w-full max-w-[400px] flex-col gap-[30px] max-[479px]:gap-[40px] md:col-span-2 md:gap-[40px] lg:w-[24%] lg:max-w-none",
                  REVEAL,
                  leftIn ? SHOWN : HIDDEN,
                )}
              >
                <div className="flex flex-col items-start gap-[20px] md:gap-[24px]">
                  <Link
                    href="/"
                    aria-label="MNV Segurança contra Incêndio e Pânico, início"
                    className="block max-w-full"
                  >
                    <BrandLogo />
                  </Link>
                  <p className="font-sans text-[16px] leading-[27.2px] text-[#C9D2E6]">
                    MNV, legalização e consultoria em segurança contra incêndio
                    e pânico no Rio de Janeiro. Atendimento em toda a capital e
                    região metropolitana.
                  </p>
                </div>
                <div className="flex gap-[32px] max-[479px]:gap-[24px]">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="relative flex h-[21px] w-[21px] shrink-0 items-center justify-center overflow-hidden transition-opacity duration-500 hover:opacity-70"
                    >
                      <img
                        src={social.src}
                        alt=""
                        loading="lazy"
                        className="block h-auto max-w-full brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-[24px] md:contents">
                {MENU_COLUMNS.map((column) => (
                  <MenuColumn key={column.title} {...column} />
                ))}
              </div>

              <div
                ref={ctaRef}
                className={cn(
                  "flex w-full flex-col gap-[40px] lg:w-[32%]",
                  REVEAL,
                  ctaIn ? SHOWN : HIDDEN,
                )}
              >
                <div className="flex flex-col gap-[16px]">
                  <h2 className="font-heading text-[22px] leading-[30.8px] font-medium tracking-[-0.5px] text-white max-[479px]:text-[20px] max-[479px]:leading-[28px] md:text-[24px] md:leading-[33.6px]">
                    Precisa de ajuda?
                  </h2>
                  <p className="mb-[4px] font-heading text-[16px] leading-[27.2px] font-normal text-[#C9D2E6]">
                    Informe o tipo de imóvel e a situação atual, como obra nova,
                    renovação de AVCB ou vistoria reprovada, e um especialista
                    responde com o próximo passo.
                  </p>
                </div>
                <div className="w-full max-w-[530px]">
                  <a
                    href="mailto:contato@mnvseguranca.com.br"
                    className="inline-flex min-h-[59px] w-full cursor-pointer items-center justify-center gap-[10px] whitespace-nowrap rounded-[12px] bg-[#D62828] px-[26px] py-[16px] font-heading text-[16px] leading-[27.2px] font-medium text-white no-underline transition-colors duration-500 hover:bg-[#A01D22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Falar com especialista
                  </a>
                </div>
              </div>
            </div>

            <div
              ref={bottomRef}
              className={cn(
                "flex flex-col items-start gap-[20px] border-t-2 border-[#FFFFFF29] pt-[24px] md:flex-row md:items-center md:justify-between md:gap-[8px]",
                REVEAL,
                bottomIn ? SHOWN : HIDDEN,
              )}
            >
              <p className="font-sans text-[16px] leading-[27.2px] text-[#B9C2D6]">
                Rio de Janeiro, RJ, Brasil
              </p>
              <p className="font-sans text-[16px] leading-[27.2px] text-[#B9C2D6]">
                © {new Date().getFullYear()} MNV Segurança contra Incêndio e
                Pânico. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
