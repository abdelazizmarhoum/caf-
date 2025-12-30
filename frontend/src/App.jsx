import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TableProtectedRoute from './components/TableProtectedRoute';

// Customer Pages
import TableEntry from './pages/customer/TableEntry';
import MenuPage from './pages/customer/MenuPage';
import CartPage from './pages/customer/CartPage';
import OrderStatus from './pages/customer/OrderStatus';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import KitchenMenuControl from './pages/kitchen/KitchenMenuControl';
import Home from './pages/Home';
import ThankYou from './pages/customer/ThankYou';
import MenuEditPage from './pages/admin/MenuEditPage';
import StaffEditPage from './pages/admin/StaffEditPage';

// Placeholders for dashboards
const Welcome = () => <div className="p-4"><h1>Welcome to the Café</h1><p>Customer interface coming soon.</p></div>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Customer Routes */}
            {/* Customer Routes - Protected by Table Session */}
            <Route path="/table/:id" element={<TableEntry />} />

            <Route
              path="/menu"
              element={
                <TableProtectedRoute>
                  <MenuPage />
                </TableProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <TableProtectedRoute>
                  <CartPage />
                </TableProtectedRoute>
              }
            />
            <Route
              path="/order/:id/status"
              element={
                <TableProtectedRoute>
                  <OrderStatus />
                </TableProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route path="/login" element={<Login />} />

            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/menu/new" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <MenuEditPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/menu/edit/:id" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <MenuEditPage />
              </ProtectedRoute>
            } />

            <Route path="/admin/staff/new" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <StaffEditPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/staff/edit/:id" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <StaffEditPage />
              </ProtectedRoute>
            } />

            <Route path="/kitchen/dashboard" element={
              <ProtectedRoute allowedRoles={['kitchen', 'manager']}>
                <KitchenDashboard />
              </ProtectedRoute>
            } />

            <Route path="/kitchen/menu-control" element={
              <ProtectedRoute allowedRoles={['kitchen', 'manager']}>
                <KitchenMenuControl />
              </ProtectedRoute>
            } />

            <Route path="/thank-you" element={<ThankYou />} />

            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
