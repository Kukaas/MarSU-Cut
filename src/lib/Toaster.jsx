import { toast } from "sonner";

export const Toaster = () => {
  toast.error("Uh oh! Something went wrong", {
    action: {
      label: "Ok",
    },
  });
};
