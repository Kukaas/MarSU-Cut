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
});

export const CreateRentalSchema = z.object({
  idNumber: z
    .string()
    .min(3, { message: "ID Number must be at least 3 characters" }),
  coordinatorName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  department: z
    .string()
    .min(3, { message: "Department must be at least 3 characters" }),
  rentalDate: z.string(),
  returnDate: z.string(),
  quantity: z.number().int().nonnegative(),
});

export const CreateAccomplishmentSchema = z.object({
  type: z
    .string()
    .min(3, { message: "Type must be at least 3 characters" })
    .max(255, { message: "Type must be less than 256 characters" }),
  accomplishment: z
    .string()
    .min(3, { message: "Accomplishment must be at least 3 characters" })
    .max(255, { message: "Accomplishment must be less than 256 characters" }),
});

export const EditAccomplishmentSchema = z.object({
  type: z
    .string()
    .min(3, { message: "Type must be at least 3 characters" })
    .max(255, { message: "Type must be less than 256 characters" }),
  accomplishment: z
    .string()
    .min(3, { message: "Accomplishment must be at least 3 characters" })
    .max(255, { message: "Accomplishment must be less than 256 characters" }),
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
  idNumber: z
    .string()
    .min(3, { message: "ID Number must be at least 3 characters" }),
  cbName: z.string().min(3, { message: "Name must be at least 3 characters" }),
});
