import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cart from "./page/Cart.tsx";
import NotFoundPage from "./components/NotFoundPage.tsx";
import About from "./page/About.tsx";
import Login from "./page/Login.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/cart", element: <Cart /> },
  { path: "/about", element: <About /> },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <CartProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </CartProvider>,
);
