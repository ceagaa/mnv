"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ASSETS } from "../shared/assets";

const LOGO_SRC = ASSETS["692fd2dc4d63bf298d8f848f_PressPoint"];
const MAIL_ICON = ASSETS["692fd2dc4d63bf298d8f8503_mail-1-1"];
const PHONE_ICON = ASSETS["692fd2dc4d63bf298d8f8509_Group-3"];
const CART_ICON = ASSETS["692fd2dc4d63bf298d8f83ab_shop-icon-main"];

const SOCIAL_LINKS = [
  {
    href: "https://x.com/",
    src: ASSETS["692fd2dc4d63bf298d8f8506_Social-icons-6"],
    size: "h-[17px] w-[17px]",
  },
  {
    href: "https://www.facebook.com/",
    src: ASSETS["692fd2dc4d63bf298d8f8504_Social-icons-7"],
    size: "h-[17px] w-[17px]",
  },
  {
    href: "https://www.instagram.com/",
    src: ASSETS["692fd2dc4d63bf298d8f8507_instagram-1-2"],
    size: "h-[17px] w-[17px]",
  },
  {
    href: "https://www.linkedin.com/",
    src: ASSETS["692fd2dc4d63bf298d8f8508_Social-icons-8"],
    size: "h-[17px] w-[16px]",
  },
] as const;

const MEGA_MENU = [
  [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Services", href: "/services" },
    { label: "Services Details", href: "/services-posts/full-home-renovation" },
    { label: "Projects", href: "/projects" },
    {
      label: "Projects Details",
      href: "/projects-posts/interior-and-exterior-design-upgrades",
    },
  ],
  [
    { label: "Blog", href: "/blog" },
    {
      label: "Blog Details",
      href: "/blog-posts/how-to-plan-your-home-renovation-a-step-by-guide",
    },
    { label: "Shop", href: "/shop" },
    { label: "Shop Details", href: "/product/infinite-t-shirts" },
    { label: "Reviews", href: "/reviews" },
    { label: "Contact Us", href: "/contact-us" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  [
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "License", href: "/license" },
    { label: "Changelog", href: "/changelog" },
    { label: "Styleguide", href: "/styleguide" },
    { label: "404 Not Found", href: "/404" },
  ],
] as const;

const LINK_BASE =
  "relative font-sans text-[16px] leading-[27.2px] font-medium text-[#112C23] no-underline opacity-50 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100";

const CTA_TEXT =
  "z-[2] whitespace-nowrap font-sans text-[16px] leading-[27.2px] font-medium text-white transition-transform duration-300 ease group-hover:-translate-y-[30px]";

const BAR = "absolute left-0 h-[2px] w-full -translate-y-1/2 bg-black transition-all duration-300";

function supportsHover(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover)").matches;
}

export function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPagesOpen(false);
      setNavOpen(false);
    };
    const onPointerDown = (event: MouseEvent) => {
      const root = dropdownRef.current;
      const target = event.target;
      if (root && target instanceof Node && !root.contains(target)) {
        setPagesOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  const showOnHover = () => {
    if (supportsHover()) setPagesOpen(true);
  };
  const hideOnHover = () => {
    if (supportsHover()) setPagesOpen(false);
  };
  const togglePages = () => setPagesOpen((open) => !open);
  const toggleNav = () => {
    setNavOpen((open) => !open);
    setPagesOpen(false);
  };
  const closeNav = () => {
    setNavOpen(false);
    setPagesOpen(false);
  };

  return (
    <section className="relative z-10 w-full px-0 pt-[20px] pb-[20px] font-heading text-[14px] leading-[20px] text-[#333333] md:pt-[14px] md:max-[992px]:pb-[14px] min-[992px]:z-[9] min-[992px]:px-[30px] min-[992px]:pb-0">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="relative z-[5] w-full rounded-[18px] bg-transparent px-[30px] max-[480px]:px-[20px] min-[992px]:px-0">
          <div className="mb-[14px] hidden flex-col items-center justify-between gap-[16px] border-b border-[#112c231a] pb-[14px] md:flex min-[992px]:mb-0 min-[992px]:flex-row min-[992px]:gap-[30px]">
            <p className="font-sans text-[14px] leading-[23.8px] text-[#112C23]">
              Let’s build something beautiful together. Get a free quote today!
            </p>

            <div className="flex flex-wrap items-center gap-[24px]">
              <div className="flex items-center gap-[8px]">
                <img
                  src={MAIL_ICON}
                  alt=""
                  width={24}
                  height={24}
                  className="block h-[24px] w-[24px] max-w-full"
                />
                <a
                  href="mailto:f.rizvi93@gmail.com"
                  className="block text-[16px] leading-[27.2px] font-medium text-[#112C23] no-underline hover:underline"
                >
                  hello@renovapro.com
                </a>
              </div>

              <div className="h-full w-[2px] bg-[#112C23] opacity-10" />

              <div className="flex items-center gap-[8px]">
                <img
                  src={PHONE_ICON}
                  alt=""
                  width={19}
                  height={20}
                  className="block h-[20px] w-[19px] max-w-full"
                />
                <a
                  href="tel:835:+1-395-385-4819"
                  className="block text-[16px] leading-[27.2px] font-medium text-[#112C23] no-underline hover:underline"
                >
                  (555) 123-4567
                </a>
              </div>

              <div className="h-full w-[2px] bg-[#112C23] opacity-10" />

              <div className="flex items-center gap-[22px]">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    className="block max-w-full"
                  >
                    <img
                      src={social.src}
                      alt=""
                      className={cn(
                        "block max-w-full transition-opacity duration-500 hover:opacity-60",
                        social.size,
                      )}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[1280px]">
            <div className="flex w-full items-center justify-between">
              <Link
                href="/"
                className="relative block max-w-[200px] min-[768px]:max-w-[240px]"
              >
                <img
                  src={LOGO_SRC}
                  alt="Orginal Logo"
                  width={141}
                  height={24}
                  className="block h-auto w-[141px] max-w-full max-[480px]:w-[120px]"
                />
              </Link>

              <div className="flex items-center gap-[28px]">
                <nav
                  aria-label="Main"
                  className={cn(
                    navOpen ? "block" : "hidden",
                    "relative bg-white px-[30px] py-[20px] text-center max-[480px]:px-[20px]",
                    "max-[992px]:absolute max-[992px]:left-0 max-[992px]:top-full max-[992px]:z-50 max-[992px]:w-full max-[992px]:min-w-[200px]",
                    "min-[992px]:flex min-[992px]:flex-row min-[992px]:items-center min-[992px]:gap-[28px] min-[992px]:bg-transparent min-[992px]:p-0 min-[992px]:text-left",
                  )}
                >
                  <div
                    ref={dropdownRef}
                    onMouseEnter={showOnHover}
                    onMouseLeave={hideOnHover}
                    className="relative z-[900] block py-[35px] text-left max-[992px]:py-0"
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={pagesOpen}
                      onClick={togglePages}
                      className="relative flex w-full cursor-pointer items-center gap-[8px] border-0 bg-transparent p-0 pr-[25px] text-left font-sans text-[16px] leading-[27.2px] font-medium text-[#112C23] opacity-50 transition-opacity duration-500 hover:opacity-100 focus-visible:opacity-100"
                    >
                      All Pages
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute right-0 top-0 bottom-0 my-auto h-[16px] w-[16px] transition-transform duration-300",
                          pagesOpen && "rotate-180",
                        )}
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {pagesOpen && (
                      <div className="z-[900] mt-[16px] rounded-[16px] bg-white p-[20px] shadow-[0_16px_48px_#0000001f] min-[992px]:absolute min-[992px]:left-0 min-[992px]:top-[90px] min-[992px]:mt-0 min-[992px]:min-w-full">
                        <div className="flex items-stretch gap-[50px] md:max-[992px]:gap-[60px] max-[768px]:flex-col max-[768px]:gap-[9px] max-[768px]:h-[327px] max-[768px]:overflow-auto">
                          {MEGA_MENU.map((column, columnIndex) => (
                            <div key={columnIndex} className="block">
                              {column.map((link, linkIndex) => (
                                <a
                                  key={link.href}
                                  href={link.href}
                                  onClick={closeNav}
                                  className={cn(
                                    "block",
                                    LINK_BASE,
                                    linkIndex < column.length - 1 &&
                                      "mb-[16px]",
                                  )}
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <a
                    href="/services"
                    onClick={closeNav}
                    className={cn(
                      "inline-block",
                      LINK_BASE,
                      "max-[992px]:my-[16px]",
                    )}
                  >
                    Services
                  </a>
                  <a
                    href="/reviews"
                    onClick={closeNav}
                    className={cn(
                      "inline-block",
                      LINK_BASE,
                      "max-[992px]:mb-[16px]",
                    )}
                  >
                    Reviews
                  </a>
                  <a
                    href="/about"
                    onClick={closeNav}
                    className={cn("inline-block", LINK_BASE)}
                  >
                    Company
                  </a>
                </nav>

                <div className="flex items-center gap-[25px] min-[992px]:gap-[30px]">
                  <div className="relative z-[10] inline-block h-[29px] w-[46px]">
                    <a
                      href="#"
                      aria-label="Cart"
                      className="relative z-[30] flex items-center bg-transparent p-0"
                    >
                      <img
                        src={CART_ICON}
                        alt=""
                        width={24}
                        height={24}
                        className="relative block h-[24px] w-[24px] max-w-full invert"
                      />
                      <span className="relative bottom-[14px] flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#0b0707] text-[13px] leading-[140%] font-medium text-white">
                        0
                      </span>
                    </a>
                  </div>

                  <div className="hidden items-center gap-[12px] leading-none md:flex">
                    <a
                      href="/contact-us"
                      className="group inline-block max-w-full cursor-pointer no-underline"
                    >
                      <div className="relative flex items-center justify-center gap-[10px] overflow-hidden rounded-[12px] bg-[#FF6C1F] px-[15px] py-[10px] transition-[background-color] duration-500">
                        <div className="relative block overflow-hidden">
                          <p className={cn("relative m-0 block", CTA_TEXT)}>
                            Book A Free Consultation
                          </p>
                          <p
                            aria-hidden="true"
                            className={cn(
                              "absolute bottom-[-30px] left-0 m-0 block",
                              CTA_TEXT,
                            )}
                          >
                            Book A Free Consultation
                          </p>
                        </div>
                        <div className="absolute left-[-2px] top-0 h-full w-0 bg-[#112C23] transition-[width] duration-300 ease group-hover:w-[calc(100%+4px)]" />
                      </div>
                    </a>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle navigation"
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
    </section>
  );
}
