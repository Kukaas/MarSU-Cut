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

const SelectField = ({ field, label, options, placeholder, onValueChange }) => {
  const hasManyOptions = options.length > 2; // Adjust the threshold as needed

  return (
    <FormItem>
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {hasManyOptions ? (
              <ScrollArea className="h-72 p-3">
                <SelectGroup>
                  {options.map((option) => (
                    <React.Fragment key={option}>
                      <SelectItem value={option}>{option}</SelectItem>
                      <Separator className="my-2" />
                    </React.Fragment>
                  ))}
                </SelectGroup>
              </ScrollArea>
            ) : (
              <SelectGroup className="p-3">
                {options.map((option) => (
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
  field: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  onValueChange: PropTypes.func,
};

export default SelectField;
