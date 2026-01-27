import { Routes, Route } from "react-router-dom";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ToSPage } from "./pages/ToSPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AdminHomePage } from "./pages/AdminHomePage";
import { AdminMenuPage } from "./pages/AdminMenuPage";
import { AdminAddMenuPage } from "./pages/AdminAddMenuPage";
import { AdminEditMenuPage } from "./pages/AdminEditMenuPage";
import { AdminEditMenuItemPage } from "./pages/AdminEditMenuItemPage";
import { AdminNewMenuItemPage } from "./pages/AdminNewMenuItemPage";
// import { HomePage } from "./pages/HomePage";
// import { Navbar } from "./components/Navbar";
// import { AddMessagePage } from "./pages/AddMessagePage";
// import { UpdateMessagePage } from "./pages/UpdateMessagePage";
// import { UserListPage } from "./pages/UserListPage";
// import { SecretPage } from "./pages/SecretPage";

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
            <Route path="/home" element={<AdminHomePage />} />
            <Route path="/menu" element={<AdminMenuPage />} />
            <Route path="/menu/add/:date" element={<AdminAddMenuPage />} />
            <Route path="/menu/edit/:date" element={<AdminEditMenuPage />} />
            <Route path="/menu/item/edit/:name" element={<AdminEditMenuItemPage />} />
            <Route path="/menu/item/new" element={<AdminNewMenuItemPage />} />
          </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App