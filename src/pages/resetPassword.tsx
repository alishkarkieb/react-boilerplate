import { yupResolver } from "@hookform/resolvers/yup";
import {
    Box,
    Button,
    Container,
    Grid,
    Link,
    Paper,
    Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FormField } from "../components/formField";
import {
    ResetPasswordDocument,
    type ResetPasswordMutation,
    type ResetPasswordMutationVariables
} from "../modules/user/graphql/user.generated";
import { graphqlRequest } from "../utils/axios";
import { useToast } from "../utils/handleToast";
import {
    resetPasswordSchema
} from "../validators/formValidation";

export function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  type resetPasswordType = yup.InferType<typeof resetPasswordSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<resetPasswordType>({
    resolver: yupResolver(resetPasswordSchema),
  });
  const { mutate, isPending } = useMutation<
    ResetPasswordMutation,
    Error,
    ResetPasswordMutationVariables
  >({
    mutationFn: (variables) => graphqlRequest(ResetPasswordDocument, variables),
    onSuccess: (data) => {
      showToast(`${data.resetPassword.message}`, "success");
      navigate("/login");
    },
    onError: (error) => {
      showToast(error.message, "error");
    },
  });

  const onSubmit = (data: resetPasswordType) => {
    mutate({
      resetPasswordDto: {
        email: data.email,
        otp: data.verificationCode,
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
            Reset Password
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            <Grid container spacing={1}>
              <FormField
                name="email"
                label="Email"
                size={{ sm: 12 }}
                register={register}
                errors={errors}
              />
              <FormField
                name="verificationCode"
                label="Verification Code"
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
              {isPending ? " Resetting..." : "Reset Password"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                variant="body2"
                sx={{ fontWeight: "medium", color: "text.secondary" }}
              >
                Back to Login?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
