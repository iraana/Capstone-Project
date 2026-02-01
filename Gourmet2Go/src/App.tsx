import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AdminMenuPage } from "./pages/AdminMenuPage";
import { AdminAddMenuPage } from "./pages/AdminAddMenuPage";
import { AdminEditMenuPage } from "./pages/AdminEditMenuPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SignInPage } from "./pages/SignInPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ToSPage } from "./pages/ToSPage";

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
            <Route path="/menu" element={<AdminMenuPage />} />       
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/terms-of-service" element={<ToSPage />} />
            <Route path="/menu/add/:date" element={<AdminAddMenuPage />} />
            <Route path="/menu/edit/:date" element={<AdminEditMenuPage />} />
          </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App