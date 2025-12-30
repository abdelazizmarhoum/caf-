import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CustomerNavbar = ({ title, showBack = false, showCart = true }) => {
    const navigate = useNavigate();
    const { cart } = useCart();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="bg-white px-6 py-4 sticky top-0 z-50 shadow-sm flex justify-between items-center transition-all duration-300">
            <div className="flex items-center gap-4">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 transition text-gray-700"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}

                {!showBack && (
                    <div className="bg-whatsapp-DEFAULT/10 p-2 rounded-full">
                        <Utensils size={20} className="text-whatsapp-DEFAULT" />
                    </div>
                )}

                <h1 className="text-xl font-bold text-gray-800 tracking-tight font-sans">
                    {title || 'WhatsApp Café'}
                </h1>
            </div>

            {showCart && (
                <button
                    onClick={() => navigate('/cart')}
                    className="relative p-2 rounded-full hover:bg-gray-50 transition group"
                >
                    <ShoppingCart size={24} className="text-gray-700 group-hover:text-whatsapp-DEFAULT transition" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-bounce">
                            {cartCount}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
};

export default CustomerNavbar;
