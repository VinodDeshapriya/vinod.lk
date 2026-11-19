import clsx from "clsx";
import { splitRows } from "@/lib/rows";

/** Lays cards out in the design's rows (see splitRows); each row's cards share the width. */
export default function CardRows<T>({
  items,
  gap,
  children,
}: {
  items: T[];
  gap: string;
  children: (item: T, index: number) => React.ReactNode;
}) {
  let index = 0;
  return (
    <div className={clsx("relative w-full flex flex-col", gap)}>
      {splitRows(items).map((row, r) => (
        <ul key={r} className={clsx("grid sm:grid-cols-2 lg:flex", gap)}>
          {row.map((item) => {
            const i = index++;
            return (
              <li key={i} className="lg:flex-1 lg:min-w-0">
                {children(item, i)}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
