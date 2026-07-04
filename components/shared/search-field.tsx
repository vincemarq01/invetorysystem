import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type SearchFieldProps = {
  placeholder: string;
};

export function SearchField({ placeholder }: SearchFieldProps) {
  return (
    <label className="relative block w-full max-w-sm">
      <span className="sr-only">{placeholder}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
      />
      <Input className="pl-9" placeholder={placeholder} />
    </label>
  );
}
