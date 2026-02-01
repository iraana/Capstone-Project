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
function App() {
  return (
    <div className="min-h-screen bg-white text-black transition-opacity duration-700 pt-20">
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold mb-4">Gourmet2Go Admin</h1>
              <p className="text-gray-600 mb-6">Welcome to the admin panel</p>
              <a 
                href="/add-item" 
                className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800 inline-block"
              >
                Go to Add Menu Item
              </a>
            </div>
          } />
          <Route path="/add-item" element={<AddItempage />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/menu" element={<Menupage />} />
          <Route path="/orders" element={<Orderspage />} />
          <Route path="/cart" element={<Cartpage />} />
          <Route path="/login" element={<Loginpage />} />  
          <Route path="/signup" element={<Loginpage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App;
