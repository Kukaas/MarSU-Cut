import { toast } from "sonner";

const ToasterError = ({ description }) => {
  toast.error("Uh oh! Something went wrong", {
    description: description,
  });
};

export default ToasterError;
