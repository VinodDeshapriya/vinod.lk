"use client";
import { useState } from "react";
import LinkIcon from "atd-icons/dist/Link";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard?.writeText(window.location.href).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-border-primary text-body-small text-text-heading hover:border-primary-light hover:text-primary-light transition-colors"
    >
      <LinkIcon size={16} aria-hidden />
      {copied ? "Link copied" : "Copy link"}
    </button>
  );
}
