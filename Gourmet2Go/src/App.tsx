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

function App() {
  return (
    // Outer div to style the whole app, then the Navbar and the main content area 
    <div className="min-h-screen bg-white text-black transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/*All the routes are defined here*/}
          <Routes>
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/" element={<p>Welcome to Gourmet2Go!</p>} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/terms-of-service" element={<ToSPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Admin only routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/admin/analytics" element={<AnalyticsPage />} />
              <Route path="/admin/add-dish" element={<AddDishPage />} />
            </Route>

          </Routes>
      </div>
    </div>
  )
}

export default App