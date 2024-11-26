import * as z from "zod";

export const StudentRegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  studentNumber: z
    .string()
    .min(3, { message: "Student Number must be at least 3 characters" }),
  studentGender: z.string(),
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
  level: z.string(),
});

export const CoordinatorRegisterSchema = z.object({
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
});

export const CommercialJobRegisterSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});

export const StudentUpdateProfileSchema = z.object({
  photo: z.string(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  studentNumber: z
    .string()
    .min(3, { message: "Student Number must be at least 3 characters" }),
  studentGender: z.string(),
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
  level: z.string(),
});

export const CoordinatorUpdateProfileSchema = z.object({
  photo: z.string(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  gender: z.string(),
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
});

export const CommercialJobUpdateProfileSchema = z.object({
  photo: z.string(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address " }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  gender: z.string(),
});

export const AdminUpdateProfileSchema = z.object({
  photo: z.string(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const RequestResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const OTPVerificationSchema = z.object({
  otp: z.string(),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
});

export const ResetPasswordSchemaProfile = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password must be at least 6 characters" }),
});

export const CreateOrderSchema = z.object({
  studentNumber: z
    .string()
    .min(3, { message: "Student Number must be at least 3 characters" }),
  studentName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  studentGender: z
    .string()
    .min(3, { message: "Gender must be at least 3 characters" }),
  receipt: z.string(),
  receiptUrl: z.string().optional(),
  receiptType: z.string().optional(),
  receiptDescription: z.string().optional(),
  ORNumber: z.string().optional(),
  amount: z.number().optional(),
  datePaid: z.string().optional(),
});

export const UploadreceiptSchema = z.object({
  ORNumber: z.string().min(1, "OR Number is required"), // Ensure it's a non-empty string
  receiptType: z.enum(["Full Payment", "Partial Payment"], {
    required_error: "Receipt Type is required",
  }),
  amount: z.number().min(0, "Amount must be greater than or equal to 0"), // Validate that it's a number
  datePaid: z.string().min(1, "Date Paid is required"), // Ensure it's a non-empty string, or use z.date() if you're working with Date objects
  url: z.string().url("Invalid URL").optional(), // Ensure URL is valid
});

export const NewReceiptSchema = z.object({
  type: z.string().min(3, { message: "Type must be at least 3 characters" }),
  ORNumber: z
    .string()
    .min(3, { message: "OR Number must be at least 3 characters" }),
  amount: z.number().int().nonnegative(),
  datePaid: z.string(),
  description: z.string().optional(),
});

export const editReceiptSchema = z.object({
  type: z.string().min(3, { message: "Type must be at least 3 characters" }),
  ORNumber: z
    .string()
    .min(3, { message: "OR Number must be at least 3 characters" }),
  amount: z.number().int().nonnegative(),
  datePaid: z.date(),
  description: z.string().optional(),
});

export const CreateRentalSchema = z.object({
  coordinatorName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
  possiblePickupDate: z.string(),
  small: z.number().int().nonnegative(),
  medium: z.number().int().nonnegative(),
  large: z.number().int().nonnegative(),
  extraLarge: z.number().int().nonnegative(),
});

export const CreateAccomplishmentSchema = z.object({
  assignedEmployee: z.string().min(1, "Assigned employee is required"),
  accomplishmentType: z.enum(["Cutting", "Sewing", "Pattern Making"], {
    required_error: "Please select an accomplishment type",
  }),
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive number"),
});

export const EditAccomplishmentSchema = z.object({
  assignedEmployee: z.string().min(1, "Assigned employee is required"),
  accomplishmentType: z.enum(["Cutting", "Sewing", "Pattern Making"], {
    required_error: "Please select an accomplishment type",
  }),
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce
    .number()
    .int()
    .positive("Quantity must be a positive number"),
});

export const AddOrderItemsSchema = z.object({
  level: z.string().min(1, { message: "Level must be at least 1 characters" }),
  productType: z
    .string()
    .min(3, { message: "Product Type must be at least 3 characters" }),
  size: z.string().min(1, { message: "Size must be at least 1 characters" }),
  unitPrice: z.number().int().nonnegative(),
  quantity: z.number().int().nonnegative(),
});

export const AddNewProductSchema = z.object({
  level: z.string(),
  productType: z.string(),
  size: z.string(),
  quantity: z.number().int().nonnegative(),
});

export const EditProductSchema = z.object({
  level: z.string(),
  productType: z.string(),
  size: z.string(),
  quantity: z.number().int().nonnegative(),
});

export const EditRawMAterialsSchema = z.object({
  type: z.string(),
  quantity: z.number().int().nonnegative(),
  unit: z.string(),
});

export const AddRawMaterialsSchema = z.object({
  type: z.string(),
  quantity: z.number().int().nonnegative(),
  unit: z.string(),
});

export const AddProductionSchema = z.object({
  level: z.string().min(3, { message: "Level must be at least 3 characters" }),
  productType: z
    .string()
    .min(3, { message: "Product Type must be at least 3 characters" }),
  productionDateFrom: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for productionDateFrom",
  }),
  productionDateTo: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for productionDateTo",
  }),
  size: z.string().min(1, { message: "Size must be at least 1 character" }),
  quantity: z.number().int().nonnegative(),
  rawMaterialsUsed: z.array(
    z.object({
      type: z.string(),
      quantity: z.number().nonnegative(),
    })
  ),
});

export const AddCommercialJobSchema = z.object({
  contactNumber: z
    .string()
    .min(3, { message: "Contact Number must be at least 3 characters" }),
  cbName: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

export const measureCommercialJobSchema = z.object({
  sh: z.number().min(1, { message: "Sh must be at least 1 characters" }),
  b: z.number().min(1, { message: "B must be at least 1 characters" }),
  fbl: z.number().min(1, { message: "Fbl must be at least 1 characters" }),
  UAG: z.number().min(1, { message: "UAG must be at least 1 characters" }),
  LAG: z.number().min(1, { message: "LAG must be at least 1 characters" }),
  SL: z.number().min(1, { message: "SL must be at least 1 characters" }),
  W: z.number().min(1, { message: "W must be at least 1 characters" }),
  H: z.number().min(1, { message: "H must be at least 1 characters" }),
  Cr: z.number().min(1, { message: "Cr must be at least 1 characters" }),
  Th: z.number().min(1, { message: "Th must be at least 1 characters" }),
  KL: z.number().min(1, { message: "KL must be at least 1 characters" }),
  PLBW: z.number().min(1, { message: "PLBW must be at least 1 characters" }),
});

export const addPickUpDateSchema = z.object({
  pickupDate: z.string(),
});

export const addNewProductTypeSchema = z.object({
  productType: z.string(),
});

export const addNewEmployeeSchema = z.object({
  name: z.string(),
  jobRole: z.string(),
  address: z.string(),
  contact: z.string(),
});
