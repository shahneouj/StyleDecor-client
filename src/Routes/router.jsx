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
import ServiceDetails from "../Pages/ServiceDetails/ServiceDetails.jsx";
import DashboardLayout from "../Layout/Dashboard/DashboardLayout.jsx";
import UserDashboard from "../Pages/Dashboard/UserDashboard.jsx";
import UserProfile from "../Pages/Dashboard/UserProfile.jsx";
import MyBookings from "../Pages/Dashboard/MyBookings.jsx";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory.jsx";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard.jsx";
import ManageDecorators from "../Pages/Dashboard/ManageDecorators.jsx";
import ManageServices from "../Pages/Dashboard/ManageServices.jsx";
import ManageBookings from "../Pages/Dashboard/ManageBookings.jsx";
import Analytics from "../Pages/Dashboard/Analytics.jsx";
import ManageUsers from "../Pages/Dashboard/ManageUsers.jsx";
import DecoratorDashboard from "../Pages/Dashboard/DecoratorDashboard.jsx";
import AssignedProjects from "../Pages/Dashboard/AssignedProjects.jsx";
import TodaysSchedule from "../Pages/Dashboard/TodaysSchedule.jsx";
import EarningsSummary from "../Pages/Dashboard/EarningsSummary.jsx";
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
      },
      {
        path: "/services/:id",
        element: <ServiceDetails />
      }
     
    ],
    
  }, {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            path: "user",
            element: <UserDashboard />,
            children: [
              { path: "profile", element: <UserProfile /> },
              { path: "bookings", element: <MyBookings /> },
              { path: "payment-history", element: <PaymentHistory /> }
            ]
          },
          {
            path: "admin",
            element: <AdminDashboard />,
            children: [
              { path: "decorators", element: <ManageDecorators /> },
              { path: "services", element: <ManageServices /> },
              { path: "bookings", element: <ManageBookings /> },
              { path: "analytics", element: <Analytics /> },
              { path: "users", element: <ManageUsers /> }
            ]
          },
          {
            path: "decorator",
            element: <DecoratorDashboard />,
            children: [
              { path: "assigned", element: <AssignedProjects /> },
              { path: "schedule", element: <TodaysSchedule /> },
              { path: "earnings", element: <EarningsSummary /> }
            ]
          }
        ]
      }
]);
