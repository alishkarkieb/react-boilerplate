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
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { FormField } from "../components/formField";
import { forgotPasswordSchema } from "../validators/formValidation";
import { useMutation } from "@tanstack/react-query";
import { graphqlRequest } from "../utils/axios";
import {
  ForgotPasswordDocument,
  type ForgotPasswordMutation,
  type ForgotPasswordMutationVariables,
} from "../modules/user/graphql/user.generated";
import { useToast } from "../utils/handleToast";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  type forgotPasswordType = yup.InferType<typeof forgotPasswordSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordType>({
    resolver: yupResolver(forgotPasswordSchema),
  });
   const {mutate,isPending} = useMutation<
    ForgotPasswordMutation,
    Error,
    ForgotPasswordMutationVariables
  >({
    mutationFn: (variables) =>
      graphqlRequest(ForgotPasswordDocument, variables),
    onSuccess: (data) => {
      showToast(`${data.forgotPassword.message}`,'success');
      navigate('/reset-password')
    },
    onError:(error)=>{
        showToast(error.message,'error')
    }
  });

  const onSubmit =(data:forgotPasswordType)=>{
    mutate({
         forgotPasswordDto:{
            email:data.email,
            deviceId:'123'
        }
    })
  }
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
            Forgot Password
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
            </Grid>

            <Button
              type="submit"
              fullWidth
                disabled={isPending}
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
            >
              {isPending ? "Sending..." : "Send Verification Code to Email"}
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
