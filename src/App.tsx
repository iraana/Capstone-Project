import { Routes, Route } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignUpPage } from "./pages/auth/SignUpPage.tsx";
import { SignInPage } from "./pages/auth/SignInPage.tsx";
import { NotFoundPage } from "./pages/error/NotFoundPage.tsx";
import { ToSPage } from "./pages/legal/ToSPage.tsx";
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicyPage.tsx";
import { Navbar } from "./components/Navbar";
import { AboutPage } from "./pages/AboutPage";
import { AdminHomePage } from "./pages/admin/AdminHomePage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { AddDishPage } from "./pages/admin/menu/AddDishPage.tsx";
import { AddMenuPage } from "./pages/admin/menu/AddMenuPage.tsx";
import { MenuPage } from "./pages/MenuPage";
import { UnauthorizedPage } from "./pages/error/UnauthorizedPage.tsx";
import { EditMenuPage } from "./pages/admin/menu/EditMenuPage.tsx";
import { Footer } from "./components/Footer";
import { ManageUsersPage } from "./pages/admin/users/ManageUsersPage.tsx";
import { ManageAdminsPage } from "./pages/admin/users/ManageAdminsPage.tsx";
import { VirtualTourPage } from "./pages/VirtualTourPage";
import { CartSidebar } from "./components/CartSidebar";
import { CheckoutPage } from "./pages/checkout/CheckoutPage.tsx";
import { SuccessfulOrderPage } from "./pages/checkout/SuccessfulOrderPage.tsx";
import { PendingOrdersPage } from "./pages/admin/orders/PendingOrdersPage.tsx";
import { ArchivedOrdersPage } from "./pages/admin/orders/ArchivedOrdersPage.tsx";
import { CancelledOrdersPage } from "./pages/admin/orders/CancelledOrdersPage.tsx";
import { ContactPage } from "./pages/ContactPage";
import { UserOrdersPage } from "./pages/UserOrdersPage";
import { OrderDetailsPage } from "./pages/admin/orders/OrderDetailsPage.tsx";
import { AdminScannerPage } from "./pages/admin/orders/AdminScannerPage.tsx";
import { EditDishPage } from "./pages/admin/menu/EditDishPage.tsx";
import { ListDishesPage } from "./pages/admin/menu/ListDishesPage.tsx";
import { AddToGalleryPage } from "./pages/admin/gallery/AddToGalleryPage.tsx";
import { GalleryPage } from "./pages/GalleryPage";
import { ManageGalleryPage } from "./pages/admin/gallery/ManageGalleryPage.tsx";
import { AdminReviewsPage } from "./pages/admin/AdminReviewsPage";
import { ReviewPage } from "./pages/ReviewPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage.tsx";
import { TrashBinPage } from "./pages/admin/menu/TrashBinPage.tsx";
import { AdminInboxPage } from "./pages/admin/AdminInboxPage";
import { Toaster } from "sonner";

function App() {
  return (
    // Outer div to style the whole app, then the Navbar and the main content area
    <div className="min-h-screen flex flex-col font-serif bg-white dark:bg-zinc-900 text-black dark:text-white transition-colors duration-700 pt-20">
      <Navbar />
      <CartSidebar />
      <Toaster position="bottom-right" theme="dark" />
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
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Auth only routes */}
            <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/successful-order" element={<SuccessfulOrderPage />} />
              <Route path="/my-orders" element={<UserOrdersPage />} />
              <Route path="/review" element={<ReviewPage />} />
            </Route>

            {/* Admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/add-dish" element={<AddDishPage />} />
              <Route path="/admin/add-menu" element={<AddMenuPage />} />
              <Route path="/admin/edit-menu" element={<EditMenuPage />} />
              <Route path="/admin/user-manager" element={<ManageUsersPage />} />
              <Route path="/admin/admin-manager" element={<ManageAdminsPage />} />
              <Route path="/admin/pending-orders" element={<PendingOrdersPage />} />
              <Route path="/admin/archived-orders" element={<ArchivedOrdersPage />} />
              <Route path="/admin/cancelled-orders" element={<CancelledOrdersPage />} />
              <Route path="/admin/order/:order_number" element={<OrderDetailsPage />} />
              <Route path="/admin/scanner" element={<AdminScannerPage />} />
              <Route path="/admin/edit-dish/:dishId" element={<EditDishPage />} />
              <Route path="/admin/list-dishes" element={<ListDishesPage />} />
              <Route path="/admin/add-to-gallery" element={<AddToGalleryPage />} />
              <Route path="/admin/inbox" element={<AdminInboxPage />} />
              <Route path="/admin/gallery-manager" element={<ManageGalleryPage />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} /> 
              <Route path="/admin/trash-bin" element={<TrashBinPage />} />
            </Route>

          </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
