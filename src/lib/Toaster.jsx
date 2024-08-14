import { toast } from "sonner";

const ToasterError = () => {
  toast.error("Uh oh! Something went wrong", {
    action: {
      label: "Ok",
    },
  });
};

export default ToasterError;
