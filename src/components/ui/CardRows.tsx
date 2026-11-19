import clsx from "clsx";
import { splitRows } from "@/lib/rows";

/**
 * Lays cards out in the design's rows on desktop (see splitRows); each row's
 * cards share the width. Below desktop the rows dissolve into one grid
 * (1 column on mobile, 2 on tablet) so no card is left alone with a gap
 * beside it; an odd last card spans both tablet columns.
 */
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
  const total = items.length;
  const oddLast = total % 2 === 1;
  return (
    <div className={clsx("relative w-full grid sm:grid-cols-2 lg:flex lg:flex-col", gap)}>
      {splitRows(items).map((row, r) => (
        <ul key={r} role="list" className={clsx("contents lg:flex", gap)}>
          {row.map((item) => {
            const i = index++;
            return (
              <li
                key={i}
                className={clsx("lg:flex-1 lg:min-w-0", oddLast && i === total - 1 && "sm:max-lg:col-span-2")}
              >
                {children(item, i)}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
}
