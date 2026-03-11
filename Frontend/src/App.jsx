import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    user
                        ? <Navigate to={user.role === 'brand' ? '/dashboard' : '/marketplace'} replace />
                        : <Navigate to="/login" replace />
                }
            />
            <Route
                path="/login"
                element={user ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={user ? <Navigate to="/" replace /> : <Register />}
            />
            <Route
                path="/marketplace"
                element={
                    <ProtectedRoute allowedRoles={['customer']}>
                        <Marketplace />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/product/:id"
                element={
                    <ProtectedRoute>
                        <ProductDetail />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={['brand']}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-product"
                element={
                    <ProtectedRoute allowedRoles={['brand']}>
                        <CreateProduct />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/edit-product/:id"
                element={
                    <ProtectedRoute allowedRoles={['brand']}>
                        <EditProduct />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ProductProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: {
                                background: '#1a1a2e',
                                color: '#e0e0e0',
                                border: '1px solid rgba(255,255,255,0.08)',
                            },
                        }}
                    />
                    <AppRoutes />
                </ProductProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
