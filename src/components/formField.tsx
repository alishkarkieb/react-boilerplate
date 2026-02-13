import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  size?: { xs?: number; sm?: number; md?: number };
}

export const FormField = ({
  name,
  label,
  type = "text",
  register,
  errors,
  size = { xs: 12 },
}: FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword((show) => !show);
     const  isPasswordField = type==='password' 
  return (
    <Grid size={size}>
      <TextField
        fullWidth
        label={label}
       type={isPasswordField ? (showPassword ? "text" : "password") : type}
        // register returns { name, onChange, onBlur, ref }
        {...register(name)}
        // Check if this specific field has an error
        error={!!errors[name]}
        slotProps={{
          input: {
            endAdornment: isPasswordField ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        // Display the error message from Yup
        helperText={errors[name]?.message as string}
        variant="outlined"
      />
    </Grid>
  );
};
