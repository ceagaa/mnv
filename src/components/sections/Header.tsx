"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { BrandLogo } from "./BrandLogo";

const NAV_LINKS = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Método", href: "#metodo" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
] as const;

const LINK_BASE =
  "relative font-sans text-[16px] leading-[27.2px] font-medium text-white opacity-70 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100 max-[992px]:text-[#0C1A3A] max-[992px]:opacity-100";

const CTA_TEXT =
  "z-[2] whitespace-nowrap font-sans text-[16px] leading-[27.2px] font-medium text-white transition-transform duration-300 ease group-hover:-translate-y-[30px]";

const BAR =
  "absolute left-0 h-[2px] w-full -translate-y-1/2 bg-white transition-all duration-300";

export function Header() {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const toggleNav = () => setNavOpen((open) => !open);
  const closeNav = () => setNavOpen(false);

  return (
    <header className="relative z-10 w-full bg-[#0C1A3A] px-0 pt-[20px] pb-[20px] font-heading text-[14px] leading-[20px] text-white min-[992px]:z-[9] min-[992px]:px-[30px] min-[992px]:py-[16px]">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative z-[5] w-full rounded-[18px] bg-transparent px-[30px] max-[480px]:px-[20px] min-[992px]:px-0">
          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex w-full items-center justify-between">
              <Link
                href="/"
                aria-label="MNV Segurança contra Incêndio e Pânico — início"
                className="relative block max-w-[240px] min-[768px]:max-w-[260px]"
              >
                <BrandLogo />
              </Link>

              <div className="flex items-center gap-[28px]">
                <nav
                  aria-label="Principal"
                  className={cn(
                    navOpen ? "block" : "hidden",
                    "relative bg-white px-[30px] py-[20px] text-center max-[480px]:px-[20px]",
                    "max-[992px]:absolute max-[992px]:left-0 max-[992px]:top-full max-[992px]:z-50 max-[992px]:w-full max-[992px]:min-w-[200px]",
                    "min-[992px]:flex min-[992px]:flex-row min-[992px]:items-center min-[992px]:gap-[28px] min-[992px]:bg-transparent min-[992px]:p-0 min-[992px]:text-left",
                  )}
                >
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeNav}
                      className={cn(
                        "inline-block",
                        LINK_BASE,
                        "max-[992px]:my-[12px]",
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>

                <div className="flex items-center gap-[25px] min-[992px]:gap-[30px]">
                  <div className="hidden items-center gap-[12px] leading-none md:flex">
                    <a
                      href="#orcamento"
                      className="group inline-block max-w-full cursor-pointer no-underline"
                    >
                      <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#D62828] px-[15px] py-[10px] transition-[background-color] duration-500 group-hover:bg-[#A01D22]">
                        <div className="relative block overflow-hidden">
                          <p className={cn("relative m-0 block", CTA_TEXT)}>
                            Solicitar Orçamento
                          </p>
                          <p
                            aria-hidden="true"
                            className={cn(
                              "absolute bottom-[-30px] left-0 m-0 block",
                              CTA_TEXT,
                            )}
                          >
                            Solicitar Orçamento
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>

                  <button
                    type="button"
                    aria-label="Abrir menu de navegação"
                    aria-expanded={navOpen}
                    onClick={toggleNav}
                    className="relative hidden h-[20.6094px] w-[26px] cursor-pointer border-0 bg-transparent p-0 select-none max-[992px]:block max-[480px]:h-[20px] max-[480px]:w-[25px]"
                  >
                    <span
                      className={cn(
                        BAR,
                        "top-[1px]",
                        navOpen && "top-1/2 rotate-45",
                      )}
                    />
                    <span
                      className={cn(BAR, "top-1/2", navOpen && "opacity-0")}
                    />
                    <span
                      className={cn(
                        BAR,
                        "top-[calc(100%-1px)]",
                        navOpen && "top-1/2 -rotate-45",
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
