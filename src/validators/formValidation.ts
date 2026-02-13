import * as yup from "yup";
export const schema = yup
  .object({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be at least 10 digits"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  })
  .required();

export const loginSchema = schema.omit([
  "address",
  "confirmPassword",
  "name",
  "phoneNumber",
]);
export const userUpdateSchema = schema.omit(["confirmPassword", "phoneNumber"]);
export default schema;
export const forgotPasswordSchema = schema.omit([
  "address",
  "confirmPassword",
  "password",
  "name",
  "phoneNumber",
]);
export const resetPasswordSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),

    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    verificationCode: yup
      .string()
      .length(6, "Code must be 6 digit")
      .required("Verification code is required"),
  })
  .required();
