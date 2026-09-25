"use client";

import Link from "next/link";

import { useEffect, useRef, useState, type FormEvent, type RefObject } from "react";

import { cn } from "@/lib/utils";
import { ASSETS } from "../shared/assets";

const LOGO_SRC = ASSETS["692fd2dc4d63bf298d8f8559_logo-main-1"];

const REVEAL = "transition-all duration-700 ease-out motion-reduce:transition-none";
const HIDDEN = "opacity-0 [transform:translate3d(0,24px,0)]";
const SHOWN = "opacity-100 [transform:translate3d(0,0,0)]";

interface SocialLink {
  readonly src: string;
  readonly href: string;
}

const SOCIAL_LINKS: readonly SocialLink[] = [
  { src: ASSETS["692fd2dc4d63bf298d8f850f_Social-icons-9"], href: "https://twitter.com/" },
  { src: ASSETS["692fd2dc4d63bf298d8f850d_Social-icons-10"], href: "https://www.facebook.com/" },
  { src: ASSETS["692fd2dc4d63bf298d8f850e_instagram-1-3"], href: "https://instagram.com/" },
  { src: ASSETS["692fd2dc4d63bf298d8f850c_Social-icons-11"], href: "https://linkedin.com/" },
];

interface MenuLink {
  readonly label: string;
  readonly href: string;
  readonly current?: boolean;
}

interface MenuColumnData {
  readonly title: string;
  readonly links: readonly MenuLink[];
}

const MENU_COLUMNS: readonly MenuColumnData[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/", current: true },
      { label: "About us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Reviews", href: "/reviews" },
      { label: "Contact us", href: "/contact-us" },
      { label: "License", href: "/license" },
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
      <p className="mb-[4px] font-heading text-[18px] leading-[30.6px] font-medium text-[#112C23]">
        {title}
      </p>
      <div className="flex flex-col gap-[12px]">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={cn(
              "font-sans text-[16px] leading-[27.2px] no-underline transition-colors duration-500 hover:text-[#FF6C1F]",
              link.current ? "text-[#FF6C1F]" : "text-[#47564E]",
            )}
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
  const [formRef, formIn] = useInView<HTMLDivElement>();
  const [bottomRef, bottomIn] = useInView<HTMLDivElement>();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="w-full bg-white px-[30px] py-[60px] max-[479px]:px-[20px] md:py-[76px]">
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
                    aria-current="page"
                    className="block max-w-full max-[479px]:max-w-[200px]"
                  >
                    <img
                      src={LOGO_SRC}
                      alt="Image"
                      loading="lazy"
                      className="block h-auto max-w-full"
                    />
                  </Link>
                  <p className="font-sans text-[16px] leading-[27.2px] text-[#47564E]">
                    Renovation experience that’s smooth from start to finish. Book your
                    consultation.
                  </p>
                </div>
                <div className="flex gap-[32px] max-[479px]:gap-[24px]">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      className="relative flex h-[21px] w-[21px] shrink-0 items-center justify-center overflow-hidden transition-opacity duration-500 hover:opacity-70"
                    >
                      <img
                        src={social.src}
                        alt="Social Icon"
                        loading="lazy"
                        className="block h-auto max-w-full"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-[24px] md:contents">
                {MENU_COLUMNS.map((column) => (
                  <MenuColumn key={column.links[0]?.href} {...column} />
                ))}
              </div>

              <div
                ref={formRef}
                className={cn(
                  "flex w-full flex-col gap-[40px] lg:w-[32%]",
                  REVEAL,
                  formIn ? SHOWN : HIDDEN,
                )}
              >
                <div className="flex flex-col gap-[16px]">
                  <h4 className="font-heading text-[22px] leading-[30.8px] font-medium tracking-[-0.5px] text-[#112C23] max-[479px]:text-[20px] max-[479px]:leading-[28px] md:text-[24px] md:leading-[33.6px]">
                    Join our newsletter
                  </h4>
                  <p className="mb-[4px] font-heading text-[16px] leading-[27.2px] font-normal text-[#47564E]">
                    Join our email list underneath and always hear about new changes first.
                  </p>
                </div>
                <div className="w-full max-w-[530px]">
                  {submitted ? (
                    <div className="min-h-[59px] bg-[#112C23] px-[22px] py-[8px] text-center font-sans text-[18px] leading-[30.6px] font-medium text-white">
                      Thank you! Your submission has been received!
                    </div>
                  ) : (
                    <form
                      id="email-form"
                      name="email-form"
                      method="get"
                      onSubmit={handleSubmit}
                      className="flex flex-row items-center gap-[10px] max-[479px]:flex-col"
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        maxLength={256}
                        required
                        placeholder="Your Email Address"
                        aria-label="Your Email Address"
                        className="h-[59px] w-full border border-[#FFFFFF4D] bg-[#F7F6F3] px-[12px] font-sans text-[14px] leading-[23.8px] font-normal text-[#47564E99] placeholder:text-[#999999]"
                      />
                      <input
                        type="submit"
                        value="Subscribe"
                        className="min-h-[59px] max-[479px]:w-full cursor-pointer whitespace-nowrap bg-[#112C23] px-[22px] py-[8px] font-sans text-[18px] leading-[30.6px] font-medium text-white transition-opacity duration-500 hover:opacity-80"
                      />
                    </form>
                  )}
                  <div className="hidden h-[59px] border border-[#FFFFFF4D] bg-[#FFDEDE] px-[60px] py-[16px] mt-[10px] font-sans text-[16px] leading-[27.2px] font-medium text-white">
                    Oops! Something went wrong while submitting the form.
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={bottomRef}
              className={cn(
                "flex flex-col items-start gap-[20px] border-t-2 border-[#112c2338] pt-[24px] md:flex-row md:items-center md:justify-between md:gap-[8px]",
                REVEAL,
                bottomIn ? SHOWN : HIDDEN,
              )}
            >
              <p className="font-sans text-[16px] leading-[27.2px] text-[#47564E]">SINCE. 2025</p>
              <p className="font-sans text-[16px] leading-[27.2px] text-[#47564E]">
                ©Elevana. All rights reserved.Powered by{" "}
                <a
                  href="https://webflow.com/templates"
                  className="text-[#47564E] no-underline transition-colors duration-500 hover:text-[#FF6C1F] hover:underline"
                >
                  Webflow
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
