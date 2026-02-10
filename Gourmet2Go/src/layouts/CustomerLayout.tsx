import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const CustomerLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-12">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
