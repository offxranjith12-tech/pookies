import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Artists from './pages/Artists';
import ArtistProfile from './pages/ArtistProfile';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import Settings from './pages/Settings';

// Admin imports
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBookings from './pages/admin/AdminBookings';
import AdminArtists from './pages/admin/AdminArtists';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReviews from './pages/admin/AdminReviews';
import AdminReports from './pages/admin/AdminReports';

// Artist imports
import ArtistLayout from './components/ArtistLayout';
import ArtistDashboard from './pages/artist/ArtistDashboard';
import ArtistBookings from './pages/artist/ArtistBookings';
import ArtistDashboardProfile from './pages/artist/ArtistProfile';
import ArtistAvailability from './pages/artist/ArtistAvailability';
import ArtistReports from './pages/artist/ArtistReports';
import ArtistReviews from './pages/artist/ArtistReviews';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes with their own layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="artists" element={<AdminArtists />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Artist Routes with their own layout */}
        <Route path="/artist" element={<ArtistLayout />}>
          <Route index element={<ArtistDashboard />} />
          <Route path="bookings" element={<ArtistBookings />} />
          <Route path="pending" element={<ArtistBookings />} />
          <Route path="availability" element={<ArtistAvailability />} />
          <Route path="profile" element={<ArtistDashboardProfile />} />
          <Route path="reports" element={<ArtistReports />} />
          <Route path="reviews" element={<ArtistReviews />} />
          <Route path="settings" element={<ArtistDashboardProfile />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:id" element={<ArtistProfile />} />
                <Route path="/book/:artistId" element={<Booking />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Fallback to prevent admin/artist routes from rendering under public */}
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                <Route path="/artist/*" element={<Navigate to="/artist" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
