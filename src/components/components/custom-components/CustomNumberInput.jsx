import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const CustomNumberInput = ({
  control,
  name,
  label,
  type = "number", // Default to "number" if not specified
  placeholder,
  disabled,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            type={type}
            {...field}
            value={field.value !== undefined ? field.value : ""}
            onChange={(e) => {
              const value = e.target.value;
              // Parse only non-negative numbers or empty strings
              if (value === "" || parseFloat(value) >= 0) {
                field.onChange(value !== "" ? parseFloat(value) : "");
              }
            }}
            placeholder={placeholder}
            className="w-full"
            disabled={disabled}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CustomNumberInput;
