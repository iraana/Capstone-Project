import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ToSPage } from "./pages/ToSPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { AdminHomePage } from "./pages/admin/AdminHomePage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { AddDishPage } from "./pages/admin/AddDishPage";
import { AddMenuPage } from "./pages/admin/AddMenuPage";
import { MenuPage } from "./pages/MenuPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { EditMenuPage } from "./pages/admin/EditMenuPage";
import { Footer } from "./components/Footer";
import { ManageUsersPage } from "./pages/admin/ManageUsersPage";
import { ManageAdminsPage } from "./pages/admin/ManageAdminsPage";
import { VirtualTourPage } from "./pages/VirtualTourPage";
import { CartSidebar } from "./components/CartSidebar";
import { CheckoutPage } from "./pages/CheckoutPage";
import { SuccessfulOrderPage } from "./pages/SuccessfulOrderPage";
import { PendingOrdersPage } from "./pages/admin/PendingOrdersPage";
import { ContactPage } from "./pages/ContactPage";
import { ArchivedOrdersPage } from "./pages/admin/ArchivedOrdersPage";
import { CancelledOrdersPage } from "./pages/admin/CancelledOrdersPage";
import { ContactPage } from "./pages/ContactPage";
import { UserOrdersPage } from "./pages/UserOrdersPage";
import { OrderDetailsPage } from "./pages/admin/OrderDetailsPage";
import { AdminScannerPage } from "./pages/admin/AdminScannerPage";

function App() {
  return (
    // Outer div to style the whole app, then the Navbar and the main content area
    <div className="min-h-screen flex flex-col font-serif bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-700 pt-20">
      <Navbar />
      <CartSidebar />
      <div className="container mx-auto px-4 py-6 grow">
        {/*All the routes are defined here*/}
          <Routes>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<MenuPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/terms-of-service" element={<ToSPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/virtualtour" element={<VirtualTourPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/successful-order" element={<SuccessfulOrderPage />} />
              <Route path="/my-orders" element={<UserOrdersPage />} />
            </Route>

            {/* Admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/add-dish" element={<AddDishPage />} />
              <Route path="/admin/add-menu" element={<AddMenuPage />} />
              <Route path="/admin/edit-menu" element={<EditMenuPage />} />
              <Route path="/admin/edit-menu/:date" element={<EditMenuPage />} />
              <Route path="/admin/user-manager" element={<ManageUsersPage />} />
              <Route path="/admin/admin-manager" element={<ManageAdminsPage />} />
              <Route path="/admin/pending-orders" element={<PendingOrdersPage />} />
              <Route path="/admin/archived-orders" element={<ArchivedOrdersPage />} />
              <Route path="/admin/cancelled-orders" element={<CancelledOrdersPage />} />
              <Route path="/admin/order/:order_number" element={<OrderDetailsPage />} />
              <Route path="/admin/scanner" element={<AdminScannerPage />} />
            </Route>

          </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App