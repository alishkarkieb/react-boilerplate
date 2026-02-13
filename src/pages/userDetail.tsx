import {
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserDocument,
  type UserQuery,
} from "../modules/user/graphql/user.generated";
import { graphqlRequest } from "../utils/axios";

export function UserDetail() {
  const { id } = useParams<{ id: string }>(); // 1. Catch the ID from URL
  const navigate = useNavigate();

  // 2. Fetch only THIS user (assumes you have a GetUserById query)
  const { data, isLoading, isError, error } = useQuery<UserQuery, Error>({
    queryKey: ["user", id],
    queryFn: () => graphqlRequest(UserDocument, { userId: id }),
    enabled: !!id, // Only run if ID exists
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography color="error">{error.message}</Typography>;
  if (!data?.user) return <Typography>User not found.</Typography>;

  const { user } = data;
  console.log({ user });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate(-1)} variant="outlined" sx={{ mb: 2 }}>
        Back to List
      </Button>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary">
          User Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid>
            <Typography variant="subtitle2" color="textSecondary">
              Full Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.name}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" color="textSecondary">
              Email Address
            </Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" color="textSecondary">
              Phone Number
            </Typography>
            <Typography variant="body1">
              {user?.phoneNumber || "N/A"}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" color="textSecondary">
              Address
            </Typography>
            <Typography variant="body1">{user?.address}</Typography>
          </Grid>
          <Grid>
            <Typography variant="subtitle2" color="textSecondary">
              Status
            </Typography>
            <Typography variant="body1">
              {user?.status ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
