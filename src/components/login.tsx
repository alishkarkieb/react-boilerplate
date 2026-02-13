import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Link, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // Correct import for MUI v6
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
} from "../modules/auth/graphql/login.generated";
import { useAuth } from "../utils/authContext";
import { graphqlRequest } from "../utils/axios";
import { useToast } from "../utils/handleToast";
import { loginSchema } from "../validators/formValidation";
import { FormField } from "./formField";

export function Login() {
  type LoginFormData = yup.InferType<typeof loginSchema>;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  const { mutate, isPending } = useMutation<
    LoginMutation,
    Error,
    LoginMutationVariables
  >({
    mutationFn: (variables) => graphqlRequest(LoginDocument, variables),
    onSuccess: (data) => {
      login(data?.login?.payload?.accessToken);
      showToast("Login Successfully!", "success");
      setTimeout(() => {
        navigate("/", {
          state: { message: "Login Successfully" },
        });
      }, 1000);
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });
  const onSubmit = (data: LoginFormData) => {
    mutate({
      login: {
        email: data.email,
        password: data.password,
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
      <Container maxWidth="xs">
        {" "}
        {/* maxWidth="xs" is better for smaller Login boxes */}
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Login
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Welcome back! Please enter your details.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            <Grid container spacing={2}>
              <FormField
                name="email"
                label="Email"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="password"
                label="Password"
                type="password"
                size={{ sm: 6 }}
                register={register}
                errors={errors}
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              disabled={isPending}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
            >
              {isPending ? "Signing in.." : "Sign In"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
                variant="body2"
                sx={{ fontWeight: "medium", color: "text.secondary" }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="textSecondary">
                New here?{" "}
                <Link
                  component={RouterLink}
                  to="/signup" // Ensure this matches your route path
                  underline="hover"
                  fontWeight="bold"
                >
                  Create an Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
