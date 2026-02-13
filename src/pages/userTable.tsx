import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, IconButton } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenericTable, type ColumnConfig } from "../components/table";
import {
  DeleteUserDocument,
  GetUsersDocument,
  type DeleteUserMutation,
  type DeleteUserMutationVariables,
  type GetUsersQuery,
} from "../modules/user/graphql/user.generated";
import { graphqlRequest } from "../utils/axios";
import { useToast } from "../utils/handleToast";

export default function UserTable() {
  const { showToast } = useToast();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { mutate, isPending } = useMutation<
    DeleteUserMutation,
    Error,
    DeleteUserMutationVariables
  >({
    mutationFn: (variables) => graphqlRequest(DeleteUserDocument, variables),
    onSuccess: () => {
      showToast("User deleted!", "success");
    },
    onError: (error) => {
      showToast(error?.message ?? "Fail to delete user", "error");
    },
  });

  const navigate = useNavigate();
  const {
    data,
    error = { message: "Unknown Message" },
    isLoading,
    isError,
  } = useQuery<GetUsersQuery, Error>({
    queryKey: ["users", page, rowsPerPage],
    queryFn: () =>
      graphqlRequest(GetUsersDocument, {
        usersInput: {
          skip: page * rowsPerPage,
          limit: rowsPerPage,
        },
      }),
  });

  const columns: ColumnConfig[] = [
    { field: "name", headerName: "Name", minWidth: 150 },
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "address", headerName: "Address", minWidth: 200 },
    {
      field: "actions",
      // type: "actions",
      headerName: "Actions",
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: "-ms-flexbox", gap: 1 }}>
          <IconButton
            color="info"
            onClick={() => navigate(`/user/${params.id}`)}
          >
            <VisibilityIcon />
          </IconButton>
          {/* New Edit Button */}
          <IconButton
            color="primary"
            onClick={() => navigate(`/user/edit/${params.id}`)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete user?")) {
                mutate({ deleteUserId: params.id });
              }
            }}
            disabled={isPending}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows = data?.users?.items ?? [];
  const totalCount = data?.users?.totalCount ?? 0;

  return (
    <GenericTable
      title="User Management"
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      error={error?.message}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      onPageChange={(newPage) => setPage(newPage)}
      onRowsPerPageChange={(newLimit) => {
        setRowsPerPage(newLimit);
        setPage(0);  
      }}
    />
  );
}
