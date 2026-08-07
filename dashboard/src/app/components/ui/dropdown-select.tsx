import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Option {
  label: string;
  value: string;
}

interface DropdownSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

export function DropdownSelect({
  value,
  onValueChange,
  options,
  className,
  placeholder,
}: DropdownSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`h-8 text-[13px] font-medium text-muted-foreground border-border hover:bg-muted bg-transparent focus:ring-1 focus:ring-border cursor-pointer min-w-[130px] ${
          className || ""
        }`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-[13px] cursor-pointer"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
