import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  CreateUserDocument,
  type CreateUserMutation,
  type CreateUserMutationVariables,
} from "../modules/auth/graphql/signUp.generated";
import { graphqlRequest } from "../utils/axios";
import { useToast } from "../utils/handleToast";
import schema from "../validators/formValidation";
import { FormField } from "./formField";

export function SignUp() {
  type SignUpFormData = yup.InferType<typeof schema>;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  // const [toast, setToast] = useState<{
  //   open: boolean;
  //   message: string;
  //   severity: "success" | "error";
  // }>({
  //   open: false,
  //   message: "",
  //   severity: "success",
  // });
  // const handleClose = () => setToast((pre) => ({ ...pre, open: false }));

  const { mutate, isPending } = useMutation<
    CreateUserMutation,
    Error,
    CreateUserMutationVariables
  >({
    mutationFn: (variables) => graphqlRequest(CreateUserDocument, variables),
    onSuccess: () => {
      showToast("Account created successfully!", "success");
      // setToast({
      //   open: true,
      //   message: "Account created successfully!",
      //   severity: "success",
      // });
      // console.log("User created:", data.createUser.id);
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Account created! Please log in." },
        });
      }, 1500);
    },
    onError: (error) => {
      showToast(error.message, "error");
      // setToast({
      //   open: true,
      //   message: error.message,
      //   severity: "error",
      // });
      console.error("Signup failed:", error.message);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    mutate({
      createUserInput: {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        phoneNumber: data.phoneNumber,
        
      },
    });
  };
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f7f6",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Sign Up
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <FormField
                name="name"
                label="Name"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="address"
                label="Address"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="email"
                label="Email"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="phoneNumber"
                label="Phone"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="password"
                label="Password"
                type="password"
                register={register}
                errors={errors}
              />
              <FormField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                register={register}
                errors={errors}
              />
            </Grid>

            <Button
              type="submit"
              disabled={isPending}
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component={RouterLink} to="/login" fontWeight="bold">
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      {/* <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar> */}
    </Box>
  );
}
