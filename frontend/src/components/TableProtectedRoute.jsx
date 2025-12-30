import { Navigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { validateSession } from '../api/orderService';

const TableProtectedRoute = ({ children }) => {
    const { tableNumber } = useCart();
    const [isValid, setIsValid] = useState(null); // null = loading

    useEffect(() => {
        const checkSession = async () => {
            const storedTable = sessionStorage.getItem('tableNumber') || localStorage.getItem('tableNumber');
            const token = sessionStorage.getItem('tableSessionToken');

            if (!storedTable || !token) {
                setIsValid(false);
                return;
            }

            const valid = await validateSession(storedTable, token);
            setIsValid(valid);
        };

        checkSession();
    }, [tableNumber]);

    if (isValid === null) {
        return <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>;
    }

    if (isValid === false) {
        return <Navigate to="/" state={{ message: 'Session expirée ou invalide. Veuillez scanner à nouveau le QR Code.' }} replace />;
    }

    return children;
};

export default TableProtectedRoute;
