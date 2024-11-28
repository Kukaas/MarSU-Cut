import CustomInput from "@/components/components/custom-components/CustomInput";
import SelectField from "@/components/components/custom-components/SelectField";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { BASE_URL } from "@/lib/api";
import ToasterError from "@/lib/Toaster";
import { StudentRegisterSchema } from "@/schema/shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { notification } from "antd";
import axios from "axios";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Student = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // State to track the current step
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(StudentRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      password: "",
      confirmPassword: "",
      studentNumber: "",
      studentGender: "",
      level: "",
    },
  });

  const selectedLevel = form.watch("level");

  const departmentOptions =
    selectedLevel === "COLLEGE"
      ? [
          "College of Agriculture(Torrijos Campus)",
          "College of Allied Health Sciences",
          "College of Arts and Social Sciences",
          "College of Business and Accountancy",
          "College of Criminal Justice Education",
          "College of Education",
          "College of Engineering",
          "College of Environmental Studies",
          "College of Fisheries and Aquatic Sciences(Gasan Campus)",
          "College of Governance",
          "College of Industrial Technology",
          "College of Information and Computing Sciences",
        ]
      : ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  // Handle register
  const handleRegister = async (values) => {
    if (values.password && values.password.includes(" ")) {
      toast.error("Password cannot contain spaces");
      return;
    }

    if (values.password && values.password.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match", {
        description:
          "Please make sure your password and confirm password match.",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/auth/sign-up`,
        { ...values, role: "Student" },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        navigate("/sign-in");
        notification.success({
          message: "Registration successful",
          description: "Please check your email for verification.",
          closable: true,
          duration: 5,
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setLoading(false);
        toast.error("Email is already taken", {
          description: "Please try another email.",
        });
      } else if (error.response && error.response.status === 401) {
        setLoading(false);
        toast.error("Name already taken", {
          description: "Please try another name.",
        });
      } else {
        setLoading(false);
        ToasterError({
          description: "Please check your internet connection and try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step navigation
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleRegister)}
          className="space-y-4"
        >
          {currentStep === 1 && (
            <div>
              <div className="flex justify-between gap-3">
                <div className="w-full">
                  <CustomInput
                    form={form}
                    name="name"
                    label="Name"
                    placeholder="eg. John Doe"
                    type="text"
                  />
                </div>
                <div className="w-full">
                  <CustomInput
                    form={form}
                    name="studentNumber"
                    label="Student Number"
                    placeholder="eg. 21B10322"
                    type="text"
                  />
                </div>
              </div>
              <div className="flex w-full justify-between gap-2">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="studentGender"
                    render={({ field }) => (
                      <SelectField
                        field={field}
                        label="Gender"
                        options={["Male", "Female"]}
                        placeholder="Gender"
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <SelectField
                        field={field}
                        label="Level"
                        options={["COLLEGE", "HS"]}
                        placeholder="Level"
                      />
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <SelectField
                    field={field}
                    label="Department"
                    options={departmentOptions}
                    placeholder="Department"
                  />
                )}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 rounded-lg"
                onClick={nextStep}
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <CustomInput
                form={form}
                name="email"
                label="Email"
                placeholder="Enter your email..."
              />
              <CustomInput
                form={form}
                name="password"
                label="Password"
                placeholder="********"
                type="password"
              />
              <CustomInput
                form={form}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password..."
                type="password"
              />
              <div className="flex justify-between gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3 rounded-lg"
                  onClick={prevStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  type="submit"
                  className="w-full mt-3 rounded-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 animate-spin" />
                      <span>Registering</span>
                    </div>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default Student;
