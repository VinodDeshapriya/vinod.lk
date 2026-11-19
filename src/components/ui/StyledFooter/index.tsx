import Image from "next/image";
import Link from "next/link";
import Facebook from "atd-icons/dist/Facebook";
import Instagram from "atd-icons/dist/Instagram";
import Linkedin from "atd-icons/dist/Linkedin";
import Tiktok from "atd-icons/dist/Tiktok";
import Youtube from "atd-icons/dist/Youtube";
import ArrowForward from "atd-icons/dist/ArrowForward";
import ArrowUp from "atd-icons/dist/ArrowUp";
import StyledContainer from "../StyledContainer";
import type { LayoutData } from "@/lib/layoutData";

const socialIcons = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
  TikTok: Tiktok,
  YouTube: Youtube,
};

const tel = (n: string) => `tel:${n.replace(/\s/g, "")}`;

/** Figma: Home Page › Footer (19276:1800) */
export default function StyledFooter({
  site,
  footerMenus,
  legalLinks,
  footerStrap,
}: Pick<LayoutData, "site" | "footerMenus" | "legalLinks" | "footerStrap">) {
  const { logoWhite, description, email, phones, location, social, name } = site;

  return (
    <footer className="site-footer border-t border-white/6">
      <StyledContainer className="pt-16 lg:pt-24 pb-10 flex flex-col gap-14">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:w-[320px] shrink-0 flex flex-col gap-5">
            <Image
              src={logoWhite.src}
              alt={logoWhite.alt}
              width={143}
              height={48}
              className="h-12 w-auto self-start"
            />
            <p className="text-body-base text-white/75">{description}</p>
            <ul className="flex gap-2.5">
              {social.map(({ label, href }) => {
                const Icon = socialIcons[label as keyof typeof socialIcons] ?? Facebook;
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="size-11 rounded-full bg-white/6 border border-white/10 flex items-center justify-center hover:bg-primary-light hover:border-primary-light transition-colors"
                    >
                      <Icon size={18} className="footer-icon" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 lg:flex lg:justify-between">
            {footerMenus.map(({ title, links }) => (
              <nav key={title} aria-label={title} className="flex flex-col gap-3.5">
                <p className="pb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                  {title}
                </p>
                {links.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href ?? "/"}
                    className="text-body-small text-white/80"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            ))}
            <div className="flex flex-col gap-3.5 col-span-2 md:col-span-1">
              <p className="pb-1 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
                Contact
              </p>
              <p className="text-body-small font-medium">{name}</p>
              <p className="text-body-small">{location}</p>
              <p className="text-body-small">
                {phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && " | "}
                    <a href={tel(p)}>{p}</a>
                  </span>
                ))}
              </p>
              <a href={`mailto:${email}`} className="text-body-small">
                {email}
              </a>
            </div>
          </div>
        </div>

        {/* Figma footer "Strip": 70px bar (tablet/desktop), stacked with a full-width button on mobile */}
        <div className="flex flex-col sm:flex-row gap-0.5 sm:gap-4 sm:items-center justify-between rounded-[20px] bg-white/5 border border-white/8 py-3 pr-3 pl-5 sm:pl-7 sm:h-[70px]">
          <p className="flex items-center gap-2.5 text-[16px] leading-6 text-white max-sm:min-h-14 max-sm:items-start">
            <span className="hidden sm:block size-2 shrink-0 rounded-full bg-secondary-light" />
            {footerStrap.text}
          </p>
          <Link
            href={footerStrap.cta.href}
            className="btn-book shrink-0 flex items-center justify-center gap-2 h-11 px-[18px] rounded-full bg-primary-light text-white text-[16px] leading-6 hover:bg-white hover:text-text-heading! transition-colors"
          >
            {footerStrap.cta.label}
            <ArrowForward size={16} />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between text-body-small">
          <p className="text-white/50">
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-7 md:gap-[60px]">
            <ul className="flex gap-7 text-white/60">
              {legalLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link href={href ?? "/"}>{label}</Link>
                </li>
              ))}
            </ul>
            <a href="#top" className="flex items-center gap-2 text-body-x-small text-white/80">
              Back to the top
              <ArrowUp size={14} />
            </a>
          </div>
        </div>
      </StyledContainer>
    </footer>
  );
}
