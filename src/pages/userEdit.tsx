import {
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UpdateUserDocument,
  UserDocument,
  type UpdateUserMutation,
  type UpdateUserMutationVariables,
  type UserQuery,
} from "../modules/user/graphql/user.generated";
import { graphqlRequest } from "../utils/axios";
import { useToast } from "../utils/handleToast";
// Assuming you have an UpdateUser mutation generated
// import { UpdateUserDocument } from "../modules/user/graphql/user.generated";

export function UserEdit() {
  const { showToast } = useToast();

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
  });

  // 1. Fetch current data
  const { data, isLoading } = useQuery<UserQuery>({
    queryKey: ["user", id],
    queryFn: () => graphqlRequest(UserDocument, { userId: id }),
    enabled: !!id,
  });

  // Populate form when data arrives
  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data?.user?.name,
        email: data.user.email,
        address: data.user.address,
        phoneNumber: data?.user?.phoneNumber!,
      });
    }
  }, [data]);

  // 2. Setup Mutation
  const mutation = useMutation<
    UpdateUserMutation,
    Error,
    UpdateUserMutationVariables
  >({
    mutationFn: (variables) => graphqlRequest(UpdateUserDocument, variables),
    onSuccess: () => {
      showToast("User updated!", "success");
      // Refresh the cache so the Table and Detail pages show new data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      setTimeout(() => navigate("/user"), 1000);
    },
    onError:(error)=>{
        showToast(error.message,'error')
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      updateUserId: id!,
      updateUserInput: {
        name: formData.name,
        email: formData.email,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
      },
    });
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Address"
            margin="normal"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              loading={mutation.isPending}
            >
              Save Changes
            </Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
