import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import Home from "./pages/Home";

const dashboardRoutes = [
    {
      path: "/login",
      name: "login",
      component: LoginForm
    },
    {
      path: "/register",
      name: "register",
      component: RegisterForm
    },
    {
      path: "/home",
      name: "home",
      component: Home
    },
    // {
    //   path: "/edit-service",
    //   name: "Edit Service",
    //   component: Dashboard
    // },

  ];
  
  export default dashboardRoutes;
  