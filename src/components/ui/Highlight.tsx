/** Italic brand-blue emphasis used inside headings ("Built *faster*."). */
export default function Highlight({ children }: { children: React.ReactNode }) {
  return <em className="italic text-primary-light">{children}</em>;
}
