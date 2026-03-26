import type { ChangeEvent } from "react";
import { Input } from "./ui/input";

interface Props {
  id: string;
  className?: string;
  value: string | number;
  label: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
}

export function InputLabel({
  id,
  value,
  type,
  onChange,
  label,
  className,
}: Props) {
  return (
    <div className={className}>
      <label className="text-lg font-medium mb-1.5" htmlFor={id}>
        {label}
      </label>
      <Input
        type={type ? type : "text"}
        id={id}
        value={value}
        onChange={onChange}
      />
      <br />
    </div>
  );
}
