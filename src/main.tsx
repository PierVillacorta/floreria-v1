import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./page/Cart.tsx";
import NotFoundPage from "./page/NotFoundPage.tsx";
import About from "./page/About.tsx";
import Login from "./page/Login.tsx";
import Register from "./page/Register.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import InfoProduct from "./page/InfoProduct.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/cart", element: <Cart /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  {path:"/product/:name",element:<InfoProduct/>},
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CartProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CartProvider>
  </StrictMode>,
);
