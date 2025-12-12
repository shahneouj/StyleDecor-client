import { createBrowserRouter } from "react-router";
import App from "../Layout/App/App.jsx";
// import ErrorPage from "../ErrorPage";
import Home from "../Pages/Home/Home.jsx";
import About from "../Pages/About/About.jsx";
import Contact from "../Pages/Contact/Contact.jsx";
import Service from "../Pages/Service/Service.jsx";
import ErrorPage from "../Pages/ErrorPage/ErrorPage.jsx";
import LoginPage from "../Pages/Login/Login.jsx";
import RegisterPage from "../Pages/Register/Register.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    ErrorBoundary: ErrorPage,
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/service",
        element: <Service />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      }
    ],
  },
]);
