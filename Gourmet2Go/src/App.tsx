import { Routes} from "react-router";
// import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
// import { AddMessagePage } from "./pages/AddMessagePage";
// import { UpdateMessagePage } from "./pages/UpdateMessagePage";
// import { NotFoundPage } from "./pages/NotFoundPage";
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
            {/* <Route path="/" element={<HomePage />} />
            <Route path="/add-message" element={<AddMessagePage />} />
            <Route path="/update-message" element={<UpdateMessagePage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/secret" element={<SecretPage />} />
            <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
      </div>
    </div>
  )
}

export default App