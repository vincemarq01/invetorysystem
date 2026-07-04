import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DataTableProps = {
  headers: string[];
  rows: Array<Array<ReactNode>>;
  emptyLabel?: string;
};

export function DataTable({
  headers,
  rows,
  emptyLabel = "No records found.",
}: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-semibold uppercase text-zinc-500">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "transition hover:bg-zinc-50",
                    rowIndex % 2 === 1 && "bg-stone-50/40",
                  )}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="whitespace-nowrap px-4 py-3 text-zinc-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-zinc-500" colSpan={headers.length}>
                  {emptyLabel}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
