import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";

const CustomNumberInput = ({
  control,
  name,
  label,
  type = "number", // Default to "number" if not specified
  placeholder,
  disabled,
  quantity,
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>
          {label}{" "}
          {quantity !== undefined && quantity !== null
            ? `(Available: ${quantity})`
            : ""}
        </FormLabel>

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

CustomNumberInput.propTypes = {
  control: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  quantity: PropTypes.number,
};

export default CustomNumberInput;
