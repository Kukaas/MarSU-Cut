import * as z from "zod";

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
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

export const UpdateProfileSchema = z.object({
  photo: z.string(),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
  password: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 256 characters" }),
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
  studentNumber: z
    .string()
    .min(3, { message: "Student Number must be at least 3 characters" }),
  studentName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" }),
  studentGender: z
    .string()
    .min(3, { message: "Gender must be at least 3 characters" }),
  rentalDate: z.string(),
  returnDate: z.string(),
  receipt: z.string(),
});
