import * as React from "react";
import { Check, ChevronDown, X } from "react-bootstrap-icons";
import onClickOutside from "react-cool-onclickoutside";
import { Input } from "./Input";

interface Value {
  value: string;
  label: string;
}

type Props = Pick<JSX.IntrinsicElements["select"], "onChange" | "value" | "name" | "id"> & {
  items: Value[];
  clearable?: boolean;
};

export const Select = ({ onChange, id, value, name, items, clearable }: Props) => {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Value | null>(null);
  const [isOpen, setOpen] = React.useState(false);

  const isSelected = (value: Value) => selected && selected.value === value.value;
  const ref = onClickOutside(() => setOpen(false));
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    return items.filter((v) => v.label.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  function handleSelected(value: Value | null) {
    onChange?.({ target: { name, value: value?.value ?? null } } as any);

    setSearch("");
    setOpen(false);
  }

  React.useEffect(() => {
    const v = items.find((v) => v.value === value);

    if (value && v) {
      setSelected(v);
    }
  }, [value, items]);

  React.useEffect(() => {
    isOpen && inputRef.current && inputRef.current?.focus();
  }, [isOpen]);

  return (
    <div id={id} className={"relative"}>
      <button
        id="theme"
        ref={ref}
        className={`
        w-full p-2 px-3 flex justify-between items-center
        bg-white dark:bg-black rounded-md
        text-dark-gray dark:text-white
        border-[1.2px] hover:border-dark-gray dark:hover:border-white dark:border-gray-800
        border-gray-300 transition-all

        ${isOpen ? "border-black dark:border-gray-400" : ""}`}
        type="button"
        onClick={() => setOpen((o) => !o)}
      >
        {selected?.label ?? "None"}

        <div className="flex items-center gap-2">
          {clearable ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setSelected(null);
                handleSelected(null);
              }}
            >
              <X width={20} height={20} />
            </span>
          ) : null}

          <span>
            <ChevronDown
              className="transition-all duration-200"
              style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
            />
          </span>
        </div>
      </button>

      {isOpen && (
        <ul
          ref={ref}
          className="absolute w-full top-12 bg-gray-200 dark:bg-[#111111] rounded-lg p-2 pt-0 z-20 max-h-80 overflow-auto shadow-md"
        >
          <div className="sticky top-0 pt-2 bg-gray-200 dark:bg-[#111111]">
            <Input
              placeholder="Filter.."
              onChange={(e) => setSearch(e.target.value)}
              ref={inputRef}
            />
          </div>

          {filtered.length <= 0 ? (
            <p className="py-2 px-1 dark:text-white">No items found by that filter.</p>
          ) : (
            filtered.map((value) => (
              <button
                onClick={() => handleSelected(value)}
                key={value.value}
                className={`
                flex justify-between items-center
                text-dark-gray dark:text-white
                p-1.5 px-2 transition-colors w-full cursor-pointer
                dark:hover:bg-black hover:bg-gray-300
                dark:focus:bg-black focus:bg-gray-300
                rounded-lg my-1


                ${isSelected(value) ? "dark:bg-black bg-gray-300 font-medium" : "font-normal"}`}
              >
                {value.label}

                <span>{isSelected(value) && <Check width="25px" height="25px" />}</span>
              </button>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
