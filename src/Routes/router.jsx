import { createBrowserRouter } from "react-router";
import App from "../Layout/App/App.jsx";
// import ErrorPage from "../ErrorPage";
import Home from "../Pages/Home/Home.jsx";
import About from "../Pages/About/About.jsx";
import Contact from "../Pages/Contact/Contact.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
]);
