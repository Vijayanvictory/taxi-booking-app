import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import SearchResults from './pages/customer/SearchResults';
import BookingForm from './pages/customer/BookingForm';
import BookingSuccess from './pages/customer/BookingSuccess';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import VehicleManagement from './pages/admin/VehicleManagement';
import BookingManagement from './pages/admin/BookingManagement';

// Placeholder for remaining admin pages
const ComingSoon = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
      <p className="text-gray-600">This page is under construction</p>
      <a href="/admin/dashboard" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Back to Dashboard
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/booking/:vehicleId" element={<BookingForm />} />
        <Route path="/success/:referenceId" element={<BookingSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/vehicles" element={<VehicleManagement />} />
        <Route path="/admin/bookings" element={<BookingManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
