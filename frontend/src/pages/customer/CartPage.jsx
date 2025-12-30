import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../api/orderService';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import CustomerNavbar from '../../components/CustomerNavbar';

const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, totalAmount, tableNumber, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customerNotes, setCustomerNotes] = useState('');

    const handleCheckout = async () => {
        if (!tableNumber) {
            alert('Table number missing. Please rescan QR.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                tableNumber,
                items: cart,
                customerNotes
            };

            const order = await placeOrder(orderData);
            clearCart();
            navigate(`/order/${order._id}/status`);
        } catch (error) {
            console.error('Order failed:', error);
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <CustomerNavbar title="Panier" showBack={true} />
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                    <div className="bg-white p-6 rounded-full shadow-md mb-6 animate-float">
                        <span className="text-6xl">🛒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
                    <p className="text-gray-500 mb-8 max-w-xs">Ajoutez de délicieux plats pour commencer votre commande.</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg transform active:scale-95"
                    >
                        Explorer le Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32 font-sans">
            <CustomerNavbar title="Mon Panier" showBack={true} showCart={false} />

            {/* Items */}
            <div className="p-6 space-y-4">
                {cart.map((item) => (
                    <div key={`${item._id}-${item.specialInstructions}`} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                                {item.selectedOptions && item.selectedOptions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                        {item.selectedOptions.map((opt, i) => (
                                            <span key={i} className="bg-yellow/10 text-black text-xs font-bold px-2 py-1 rounded-md border border-yellow/20">
                                                {opt.name}: {opt.value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-sm text-gray-400 font-medium">Prix unitaire: {item.price} DH</p>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold text-xl text-yellow">{item.price * item.quantity} DH</span>
                            </div>
                        </div>

                        {item.specialInstructions && (
                            <div className="mt-3 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-600">
                                <span className="font-bold text-xs uppercase text-gray-400 block mb-1">Note:</span>
                                {item.specialInstructions}
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                            <button
                                onClick={() => removeFromCart(item._id, item.specialInstructions)}
                                className="text-red-400 hover:text-red-600 transition p-2 rounded-full hover:bg-red-50"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1, item.specialInstructions)}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-700 hover:text-black transition"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="w-10 text-center font-bold text-gray-800">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1, item.specialInstructions)}
                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold text-gray-700 hover:text-black transition"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="p-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Instructions pour la cuisine (optionnel)</label>
                    <textarea
                        className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition resize-none text-sm"
                        placeholder="Ex: Pas de sauce, allergie..."
                        rows={3}
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                    />
                </div>
            </div>

            {/* Bottom Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl z-50">
                <div className="flex justify-between items-end mb-4 px-2">
                    <span className="text-gray-500 font-medium">Total à payer</span>
                    <span className="text-3xl font-extrabold text-gray-900">{totalAmount} <span className="text-lg text-gray-500 font-bold">DH</span></span>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className={`w-full py-5 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 shadow-2xl transform active:scale-95 transition-all uppercase tracking-widest ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-900'
                        }`}
                >
                    {loading ? (
                        <span>Validation en cours...</span>
                    ) : (
                        <>
                            <span>Confirmer la Commande</span>
                            <ArrowRight size={22} strokeWidth={3} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CartPage;
