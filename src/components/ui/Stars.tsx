import StarFill from "atd-icons/dist/StarFill";

export default function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-[3px]" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarFill key={i} size={16} className="text-warning-primary" />
      ))}
    </div>
  );
}
