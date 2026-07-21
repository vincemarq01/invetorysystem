import type { ComponentProps } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFieldProps = ComponentProps<typeof Input> & {
  placeholder: string;
};

export function SearchField({
  className,
  placeholder,
  ...props
}: SearchFieldProps) {
  return (
    <label className="relative block w-full max-w-sm">
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
      />
      <Input
        className={["pl-9", className].filter(Boolean).join(" ")}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}
