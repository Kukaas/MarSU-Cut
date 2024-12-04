import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import PropTypes from "prop-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const SelectField = ({
  field,
  label,
  options,
  placeholder,
  onValueChange,
  type,
  className,
}) => {
  const hasManyOptions = options.length > 2; // Adjust the threshold as needed

  // Filter out empty string options
  const filteredOptions = options.filter((option) => option !== "");

  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Select
          value={field.value}
          onValueChange={(value) => {
            field.onChange(value);
            if (onValueChange) {
              onValueChange(value);
            }
          }}
        >
          <SelectTrigger className="w-full" disabled={type === "disabled"}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-w-[350px]">
            {hasManyOptions ? (
              <ScrollArea className="h-72 p-3">
                <SelectGroup>
                  {filteredOptions.map((option) => (
                    <React.Fragment key={option}>
                      <SelectItem value={option}>{option}</SelectItem>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
                </SelectGroup>
              </ScrollArea>
            ) : (
              <SelectGroup className="p-3">
                {filteredOptions.map((option) => (
                  <React.Fragment key={option}>
                    <SelectItem value={option}>{option}</SelectItem>
                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

SelectField.propTypes = {
  field: PropTypes.object,
  label: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  onValueChange: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default SelectField;
