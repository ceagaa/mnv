import { cn } from "@/lib/utils";

interface BrandLogoProps {
  readonly className?: string;
  readonly tone?: "light" | "dark";
}

export function BrandLogo({ className, tone = "light" }: BrandLogoProps) {
  return (
    <span
      className={cn(
        "flex flex-col items-start gap-[2px] font-heading leading-none",
        tone === "light" ? "text-white" : "text-[#0C1A3A]",
        className,
      )}
    >
      <span className="flex items-baseline gap-[3px] text-[26px] font-extrabold tracking-[-1px] md:text-[28px]">
        MNV
        <span aria-hidden="true" className="text-[#D62828]">
          .
        </span>
      </span>
      <span
        className={cn(
          "text-[9px] font-semibold tracking-[0.14em] uppercase md:text-[10px]",
          tone === "light" ? "text-[#FF5A52]" : "text-[#A01D22]",
        )}
      >
        Segurança contra incêndio
      </span>
    </span>
  );
}
