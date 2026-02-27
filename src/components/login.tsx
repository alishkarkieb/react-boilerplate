import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Container, Link, Paper, Typography, Divider } from "@mui/material";
import Grid from "@mui/material/Grid"; // Correct import for MUI v6
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  LoginDocument,
  type LoginMutation,
  type LoginMutationVariables,
  LoginWithGoogleDocument,
} from "../modules/auth/graphql/login.generated";
import { useAuth } from "../utils/authContext";
import { graphqlRequest } from "../utils/axios";
import { useMutation as useApolloMutation } from "@apollo/client/react";
import { useToast } from "../utils/handleToast";
import { loginSchema } from "../validators/formValidation";
import { FormField } from "./formField";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { SocialLoginButton } from "./socialLoginButton";

export function Login() {
  type LoginFormData = yup.InferType<typeof loginSchema>;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [loginWithGoogle, { loading: isGoogleLoginLoading }] = useApolloMutation(LoginWithGoogleDocument);

   
  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      
      console.log("Google Login Success! Received token:", codeResponse.access_token);
      
      try {
        const { data } = await loginWithGoogle({
          variables: {
            loginWithGoogle: {
              token: codeResponse.access_token,
            },
          },
        });
        
        login(data?.loginWithGoogle?.payload?.accessToken!);
        showToast("Login Successfully!", "success");
        setTimeout(() => {
          navigate("/", {
            state: { message: "Login Successfully" },
          });
        }, 1000);
      } catch (err: any) {
         console.error("Google Login GraphQL Error:", err);
         showToast(err.message || "Google login failed", "error");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      showToast("Google login failed", "error");
      setIsGoogleLoading(false);
    },
    onNonOAuthError: () => {
       setIsGoogleLoading(false);
    }
  });

  const onGoogleBtnClick = () => {
    setIsGoogleLoading(true);
    handleGoogleSignIn();
  };

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
              disabled={isPending || isGoogleLoading || isGoogleLoginLoading}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
            >
              {isPending ? "Signing in.." : "Sign In"}
            </Button>

            <Box sx={{ width: '100%', my: 2 }}>
              <Divider>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 1 }}>
                  or sign in with
                </Typography>
              </Divider>
            </Box>

            <SocialLoginButton
              provider="google"
              onClick={onGoogleBtnClick}
              isLoading={isGoogleLoading || isGoogleLoginLoading}
              disabled={isPending}
            />

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
