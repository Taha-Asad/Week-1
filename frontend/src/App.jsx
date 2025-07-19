import { BrowserRouter, Routes, Route } from "react-router";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Navbar from "./components/navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardHome from "./components/admin/DashboardHome";
import ReservationsPage from "./components/admin/ReservationsPage";
import MenuPage from "./components/admin/MenuPage";
import StatsPage from "./components/admin/StatsPage";
import SettingsPage from "./components/admin/SettingsPage";
import BlogPage from "./components/admin/BlogPage";
import ContactPage from "./components/admin/ContactPage";
import ProtectedRoute from "./components/admin/protectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;