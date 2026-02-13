import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/layout";
import { Login } from "./components/login";
import { SignUp } from "./components/signUp";
import { HomePage } from "./pages/home";
import { UserDetail } from "./pages/userDetail";
import { UserEdit } from "./pages/userEdit";
import UserTable from "./pages/userTable";
import { AuthProvider } from "./utils/authContext";
import { ToastProvider } from "./utils/handleToast";
import { ProtectedRoute } from "./utils/routeProtector";
import { ForgotPassword } from "./pages/forgotPassword";
import { ResetPassword } from "./pages/resetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Navbar is always visible
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "user",
            element: <UserTable />,
          },
          {
            path: "user/:id",
            element: <UserDetail />,
          },
          { path: "user/edit/:id", element: <UserEdit /> },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: global config like disabling automatic refetch on window focus
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
  // return <RouterProvider router={router} />;
}

export default App;
