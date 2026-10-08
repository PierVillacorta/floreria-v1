import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import NotFoundPage from "./components/NotFoundPage.tsx";


import { InfoProduct } from "./pages/InfoProduct.tsx";
import Layout from "./components/Layout.tsx";
import { Categories } from "./pages/Categories.tsx";
import { Checkout } from "./pages/payments/Chekout.tsx";
import { PaymentError } from "./pages/payments/PaymentError.tsx";
import { PaymentSuccess } from "./pages/payments/PaymentSucess.tsx";
import { AdminLayout } from "./pages/admin/AdminLayaout.tsx";
import {Dashboard} from "./components/Dashboard.tsx";
import { AdminUsers } from "./pages/admin/AdminUsers.tsx";
import { AdminProducts } from "./pages/admin/AdminProducts.tsx";
import { Offers } from "./pages/Offers.tsx";
import { AdminCategories } from "./pages/admin/AdminCategories.tsx";
import { BlogsPage } from "./pages/BlogPage.tsx";
import { BlogDetail } from "./pages/BlogDetail.tsx";
import { Cart } from "./pages/Cart.tsx";
import { About } from "./pages/About.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "cart", element: <Cart /> },
      { path: "categories", element: <Categories /> },
      { path: "checkout", element: <Checkout /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-error", element: <PaymentError /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "product/:product_id", element: <InfoProduct /> },
      { path: "offers", element: <Offers /> },
      { path: "blogs", element: <BlogsPage /> },
      { path: "blogs/:id", element: <BlogDetail /> },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "products", element: <AdminProducts /> },
          { path: "categories", element: <AdminCategories /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
