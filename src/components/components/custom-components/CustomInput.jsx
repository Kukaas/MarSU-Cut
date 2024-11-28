import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Eye, EyeOff } from "lucide-react"; // Assuming you use lucide-react for icons
import PropTypes from "prop-types";

const CustomInput = ({ form, name, label, placeholder, type, maxLength }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl className="relative">
            <div>
              <Input
                placeholder={placeholder}
                {...field}
                type={showPassword && type === "password" ? "text" : type}
                className={type === "password" ? "pr-10" : ""}
                maxLength={maxLength}
                disabled={type === "disabled"}
              />
              {type === "password" && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

CustomInput.propTypes = {
  form: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "email", "number", "disabled"]),
  maxLength: PropTypes.number,
};

export default CustomInput;
