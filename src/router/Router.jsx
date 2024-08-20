import {createBrowserRouter} from "react-router-dom";
import HomePage from "../pages/home/Home.jsx";
import LoginPage from "../pages/login/Login.jsx";
import RegisterPage from "../pages/register/Register.jsx";
import QueryPage from "../pages/query/query.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        path: "/home",
        element: <HomePage/>
    },
    {
        path: "/query",
        element: <QueryPage/>
    }
]);

export default router;