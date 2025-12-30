import { useEffect, useState } from 'react';
import { getMenu } from '../../api/orderService';
import { useCart } from '../../context/CartContext';
import { Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OptionModal from '../../components/OptionModal';
import CustomerNavbar from '../../components/CustomerNavbar';

const MenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedItemForOptions, setSelectedItemForOptions] = useState(null);
    const { addToCart, cart } = useCart();
    const navigate = useNavigate();

    // Helper to check if item is in cart
    const getItemCountInCart = (itemId) => {
        return cart.reduce((count, cartItem) => cartItem._id === itemId ? count + cartItem.quantity : count, 0);
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const data = await getMenu();
                // Filter by Day Availability
                const today = new Date().getDay();
                const visibleItems = data.filter(item => {
                    if (item.availableDays && item.availableDays.length > 0) {
                        return item.availableDays.includes(today);
                    }
                    return true;
                });
                setMenuItems(visibleItems);
            } catch (error) {
                console.error('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    const handleAddToCartClick = (item) => {
        if (item.options && item.options.length > 0) {
            setSelectedItemForOptions(item);
        } else {
            addToCart(item);
        }
    };

    const handleOptionConfirm = (item, qty, notes, options) => {
        addToCart(item, qty, notes, options);
        setSelectedItemForOptions(null);
    };

    const categories = [
        'all', 'salades', 'pates', 'pizza', 'sandwichs', 'paninis', 'burgers', 'brochettes', 'marocains', 'supplements', 'boissons'
    ];

    const filteredItems = activeCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-whatsapp-DEFAULT"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-28">
            <CustomerNavbar title="Menu" />

            {/* Categories */}
            <div className="sticky top-[72px] z-40 bg-gray-50/95 backdrop-blur-sm py-4 pl-4 border-b border-gray-100 shadow-sm">
                <div className="flex overflow-x-auto gap-3 pr-4 no-scrollbar pb-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full whitespace-nowrap capitalize text-sm font-bold transition-all duration-300 transform hover:scale-105 ${activeCategory === cat
                                ? 'bg-black text-white shadow-lg ring-2 ring-black/20'
                                : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {cat === 'all' ? 'Tout' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu List (Horizontal Cards) */}
            <div className="p-4 flex flex-col gap-4">
                {filteredItems.map(item => {
                    const count = getItemCountInCart(item._id);
                    return (
                        <div
                            key={item._id}
                            className={`bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex gap-4 ${!item.isAvailable ? 'opacity-60 pointer-events-none' : ''}`}
                        >
                            {/* Image (Left) */}
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 relative overflow-hidden">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-gray-400 font-bold text-sm">{item.name.slice(0, 2).toUpperCase()}</span>
                                    </div>
                                )}
                                {count > 0 && (
                                    <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/50 flex items-center justify-center">
                                        <div className="bg-yellow text-black w-8 h-8 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white">
                                            {count}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content (Right) */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-gray-900 leading-tight mb-1">{item.name}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                </div>

                                <div className="flex justify-between items-end mt-2">
                                    <span className="font-bold text-yellow text-lg">{item.price} Dh</span>

                                    {item.isAvailable ? (
                                        <button
                                            onClick={() => handleAddToCartClick(item)}
                                            className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-yellow hover:text-black transition-all shadow-lg active:scale-95"
                                        >
                                            <Plus size={24} strokeWidth={3} />
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                            Épuisé
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Action Button for Cart */}
            {cartCount > 0 && (
                <div className="fixed bottom-6 left-0 w-full px-6 z-50">
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-black text-white py-4 rounded-2xl shadow-2xl flex justify-between items-center px-6 font-bold text-lg transform hover:scale-[1.02] active:scale-95 transition duration-300 ring-4 ring-white/20 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                                {cartCount}
                            </div>
                            <span>Voir ma commande</span>
                        </div>
                        <span className="text-yellow">{cart.reduce((s, i) => s + i.price * i.quantity, 0)} Dh</span>
                    </button>
                </div>
            )}

            {/* Option Modal */}
            {selectedItemForOptions && (
                <OptionModal
                    item={selectedItemForOptions}
                    onClose={() => setSelectedItemForOptions(null)}
                    onConfirm={handleOptionConfirm}
                />
            )}
        </div>
    );
};

export default MenuPage;
