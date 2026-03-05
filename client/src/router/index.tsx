import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/layout";
import Test from "../pages/test";
import Login from "../pages/login/Login";
const router = createBrowserRouter([
    {
        path: "/login", // 登录路由放在顶级
        element: <Login />,
    },
  {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Test />,
            },
        ],
  },
  
//   {
//     path: "*",
//     element: <NotFound />,
//   }
]);

export default router;