import Image from "next/image";
import Link from "next/link";
import StyledContainer from "../StyledContainer";
import {
  footerMenus,
  legalLinks,
  siteSettings,
} from "@/data/site";

export default function StyledFooter() {
  const { logo, description, email, phone, location, social, name } =
    siteSettings;

  return (
    <footer className="site-footer">
      <StyledContainer className="py-8 md:py-10 xl:py-15 overflow-hidden">
        <div className="flex flex-col gap-y-10 xl:flex-row xl:items-start xl:justify-between">
          <div className="xl:max-w-87.5">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-10 w-auto"
            />
            <p className="text-body-base mt-[18px] mb-6">{description}</p>
            <ul className="flex flex-col gap-2 text-body-base">
              {email && (
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
                </li>
              )}
              {location && <li>{location}</li>}
            </ul>
            {social.length > 0 && (
              <ul className="flex gap-4 mt-6">
                {social.map(({ label, href }) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noreferrer">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 xl:gap-20">
            {footerMenus.map(({ title, links }) => (
              <div key={title}>
                <p className="text-title-base-blog font-medium mb-3">{title}</p>
                <ul className="flex flex-col gap-2 text-body-base">
                  {links.map(({ href, label, target }) => (
                    <li key={String(href)}>
                      <Link href={href ?? "/"} target={target}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border-primary flex flex-col md:flex-row gap-4 justify-between text-body-small">
          <p>
            © {new Date().getFullYear()} {name}. All rights reserved.
          </p>
          {legalLinks.length > 0 && (
            <ul className="flex gap-4">
              {legalLinks.map(({ href, label }) => (
                <li key={String(href)}>
                  <Link href={href ?? "/"}>{label}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </StyledContainer>
    </footer>
  );
}
