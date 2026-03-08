import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../layout/layout";
import NotFound from "../pages/NotFound";
import { PageLoader } from "../components/PageLoader";

// 懒加载页面组件
const Login = lazy(() => import("../pages/login/Login"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Resumes = lazy(() => import("../pages/resumes/Resumes"));
const Candidates = lazy(() => import("../pages/candidates/Candidates"));
const Jobs = lazy(() => import("../pages/jobs/Jobs"));
const Settings = lazy(() => import("../pages/settings/Settings"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/app",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "resumes",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Resumes />
          </Suspense>
        ),
      },
      {
        path: "candidates",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Candidates />
          </Suspense>
        ),
      },
      {
        path: "jobs",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Jobs />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        ),
      },
    ],
    errorElement: <NotFound />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
