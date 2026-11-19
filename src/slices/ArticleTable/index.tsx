import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { articleH2 } from "@/components/blog/articleStyles";
import { slugify } from "@/lib/blog";

export type ArticleTableProps = SliceComponentProps<Content.ArticleTableSlice>;

/** Figma: Blog article › "Price table" (in 19268:24021) */
const ArticleTable = ({ slice }: ArticleTableProps) => {
  const { heading, column_1, column_2, column_3, rows, note } = slice.primary;
  const head = [column_1, column_2, column_3];
  return (
    <section data-slice-type={slice.slice_type} className="my-12">
      {heading && <h2 id={slugify(heading)} className={`${articleH2} mb-5`}>{heading}</h2>}
      <div className="overflow-x-auto rounded-[16px] border border-border-primary">
        <table className="w-full min-w-[520px] text-left">
          <thead className="bg-info-bg">
            <tr>
              {head.map((h, i) => (
                <th key={i} scope="col" className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.12em] text-primary-light">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border-secondary">
                <th scope="row" className="px-5 py-4 text-body-small font-medium text-text-heading">{r.cell_1}</th>
                <td className="px-5 py-4 text-body-small text-text-description">{r.cell_2}</td>
                <td className="px-5 py-4 text-body-small text-text-description">{r.cell_3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-3 text-[13px] text-text-inactive">{note}</p>}
    </section>
  );
};

export default ArticleTable;
