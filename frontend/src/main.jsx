import { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom/client";
// ... rest of your imports
import App from "./pages/App";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { Loader2 } from "lucide-react";
import { RecoilRoot, useRecoilValue } from "recoil";
import {
  isLoggedInAtom,
  isUserLoadingAtom,
  userRoleAtom,
} from "./atoms/userData";
import { ThemeProvider } from "./components/theme-provider";
import UserDetails from "./pages/UserDetails";
import { Toaster } from "sonner";
// Google provider removed

const AddStore = lazy(() => import("./pages/AddStore"));
const Homepage = lazy(() => import("./pages/Homepage"));
const StoreDetails = lazy(() => import("./pages/StoreDetails"));
const EditStore = lazy(() => import("./pages/EditStore"));
const LoginForm = lazy(() => import("./pages/Login"));
const SignupForm = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));

const Users = lazy(() => import("./pages/Users"));
const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard"));

const ProtectedRoute = ({ children, roles }) => {
  const userRole = useRecoilValue(userRoleAtom);
  const isLoading = useRecoilValue(isUserLoadingAtom);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn || !roles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired
};

const router = createBrowserRouter([
  {
    path: "/signup",
    element: (
      <Suspense
        fallback={
          <div className="w-full grid items-center h-screen">
            <Loader2 className="mx-auto  h-10 w-10 animate-spin dark:text-zinc-50" />
          </div>
        }>
        <SignupForm />
      </Suspense>
    ),
  },
  {
    path: "/login",
    element: (
      <Suspense
        fallback={
          <div className="w-full grid items-center h-screen">
            <Loader2 className="mx-auto  h-10 w-10 animate-spin dark:text-zinc-50" />
          </div>
        }>
        <LoginForm />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Navigate to="/stores/" replace />,
      },
      {
        path: "/stores",
        element: (
          <Suspense
            fallback={
              <div className="w-full">
                <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
              </div>
            }>
            <Homepage />
          </Suspense>
        ),
      },
      {
        path: "/stores/add",
        element: (
          <ProtectedRoute roles={["admin", "owner"]}>
            <Suspense
              fallback={
                <div className="w-full">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
                </div>
              }>
              <AddStore />
            </Suspense>
          </ProtectedRoute>
        ),
      },

      {
        path: "/owner",
        element: (
          <ProtectedRoute roles={["owner", "admin"]}>
            <Suspense
              fallback={
                <div className="w-full">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                </div>
              }>
              <OwnerDashboard />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/users",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <Suspense
              fallback={
                <div className="w-full">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
                </div>
              }>
              <Users />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:userId",
        element: (
          <Suspense
            fallback={
              <div className="w-full">
                <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
              </div>
            }>
            <UserDetails />
          </Suspense>
        ),
      },
      {
        path: "/stores/:id",
        element: (
          <Suspense
            fallback={
              <div className="w-full">
                <Loader2 className="mx-auto h-10 w-10 animate-spin dark:text-zinc-50" />
              </div>
            }>
            <StoreDetails />
          </Suspense>
        ),
      },
      {
        path: "/stores/:id/edit",
        element: (
          <ProtectedRoute roles={["admin", "owner"]}>
            <Suspense
              fallback={
                <div className="w-full">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin" />
                </div>
              }>
              <EditStore />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense
        fallback={
          <div className="w-full">
            <Loader2 className="mx-auto h-10 w-10 animate-spin" />
          </div>
        }>
        <NotFound />
      </Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <RecoilRoot>
      <Toaster
        gap="8"
        offset="20px"
        position="top-center"
        theme={"light"}
        richColors
      />
      <RouterProvider router={router} />
    </RecoilRoot>
  </ThemeProvider>
);
