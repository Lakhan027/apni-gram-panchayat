'use client';

interface FilterChipsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export default function FilterChips<T extends string>({ options, value, onChange, label }: FilterChipsProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`min-h-[44px] rounded-full border px-4 text-[15px] font-semibold transition-colors ${
              active
                ? 'border-green-700 bg-green-700 text-white'
                : 'border-line bg-white text-ink hover:border-green-700 hover:bg-green-50'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
