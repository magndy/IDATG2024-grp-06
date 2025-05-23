// src/App.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyOrdersPage from "./pages/MyOrdersPage";

function App() {
  return (
    // Use the MainLayout component as the main wrapper
    <MainLayout>
      {/* Routes are now nested inside MainLayout */}
      {/* The matched Route's element will be passed as 'children' to MainLayout */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/category/:categoryId" element={<ProductListPage />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />

        {/* Catch-all route - Note: Link is removed as it's now in MainLayout */}
        <Route
          path="*"
          element={
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold text-red-600">
                404 - Not Found
              </h1>
              <p className="mt-2">
                Sorry, the page you are looking for does not exist.
              </p>
              {/* Could add a Link component here if needed, but it's also in the nav */}
            </div>
          }
        />
      </Routes>
    </MainLayout> // Close MainLayout
  );
}

export default App;
