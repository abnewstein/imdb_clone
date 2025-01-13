import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type SelectActorsPopoverProps = {
  actors: { value: string; label: string }[];
  value: string;
  defaultValue: string;
  onChange: (value: string) => void;
};

const SelectActorsPopover: React.FC<SelectActorsPopoverProps> = ({
  actors,
  value,
  defaultValue,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? actors.find(
                (actor) => actor.value === value || actor.value === defaultValue
              )?.label
            : "Select actor..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search actors..." className="h-9" />
          <CommandList>
            <CommandEmpty>No actor found.</CommandEmpty>
            <CommandGroup>
              {actors.map((actor) => (
                <CommandItem
                  key={actor.value}
                  value={actor.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {actor.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === actor.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectActorsPopover;
