import { Routes, Route } from "react-router";
// import { HomePage } from "./pages/HomePage";
// import { Navbar } from "./components/Navbar";
// import { AddMessagePage } from "./pages/AddMessagePage";
// import { UpdateMessagePage } from "./pages/UpdateMessagePage";
// import { NotFoundPage } from "./pages/NotFoundPage";
// import { UserListPage } from "./pages/UserListPage";
// import { SecretPage } from "./pages/SecretPage";
import { AddItempage } from "./pages/AddItempage";
import { Aboutpage } from "./pages/Aboutpage";
import { Menupage } from "./pages/Menupage";
import { Orderspage } from "./pages/Orderspage";
import { Cartpage } from "./pages/Cartpage";
import { Loginpage } from "./pages/Loginpage";
import { CustomerLayout } from "./layouts/CustomerLayout";

function App() {
  return (
    <Routes>
      
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl font-bold mb-4 text-gray-900">Gourmet2Go</h1>
              <p className="text-gray-600 mb-8 text-lg">
                Fresh meals prepared by Sault College culinary students
              </p>
              
                <a href="/about"
                className="bg-sault-blue text-white px-8 py-3 rounded-md hover:bg-sault-blue-dark inline-block font-medium transition-colors"
              >
                Explore Gourmet2Go
              </a>
            </div>
          </div>
        }
      />

      
      <Route path="/add-item" element={<AddItempage />} />

      
      <Route element={<CustomerLayout />}>
        <Route path="/about" element={<Aboutpage />} />
        <Route path="/menu" element={<Menupage />} />
        <Route path="/orders" element={<Orderspage />} />
        <Route path="/cart" element={<Cartpage />} />
      </Route>

      
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<Loginpage />} />
    </Routes>
  );
}

export default App;