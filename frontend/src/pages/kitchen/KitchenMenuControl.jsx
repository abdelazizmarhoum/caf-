import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Coffee, AlertCircle, CheckCircle } from 'lucide-react';

const CATEGORIES = [
    'all',
    'salades', 'pates', 'pizza', 'sandwichs', 'paninis',
    'burgers', 'brochettes', 'marocains', 'supplements'
];

const KitchenMenuControl = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            // Use the public endpoint which returns active items. 
            // Wait, we need ALL items even if they are unavailable, to make them available again.
            // But getMenuItems returns find({deletedAt: null}) which includes unavailable.
            const { data } = await api.get('/menu');
            setItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAvailability = async (id, currentStatus) => {
        // Optimistic update
        setItems(items.map(item =>
            item._id === id ? { ...item, isAvailable: !currentStatus } : item
        ));

        try {
            await api.patch(`/menu/${id}/availability`, { isAvailable: !currentStatus });
        } catch (error) {
            console.error('Failed to toggle status');
            // Revert on error
            setItems(items.map(item =>
                item._id === id ? { ...item, isAvailable: currentStatus } : item
            ));
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <header className="bg-black shadow-2xl p-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/kitchen/dashboard')}
                        className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-gray-800 transition-all border border-gray-800 shadow-lg"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-xl tracking-tighter text-white uppercase">Gestion de Menu</h1>
                        <p className="text-[10px] text-yellow font-bold uppercase tracking-widest leading-none">WhatsApp Pool Café</p>
                    </div>
                </div>
                <div className="bg-yellow/10 px-3 py-1 rounded-full border border-yellow/20 hidden sm:block">
                    <span className="text-[10px] text-yellow font-black uppercase tracking-widest leading-none">Chef Dashboard</span>
                </div>
            </header>

            <div className="p-6 flex-1 max-w-7xl mx-auto w-full">
                {/* Search & Filter Section */}
                <div className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-100 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-[1.5]">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-black" size={24} strokeWidth={3} />
                            <input
                                type="text"
                                placeholder="Rechercher un plat..."
                                className="w-full pl-14 pr-6 py-6 bg-gray-100 border-2 border-transparent focus:border-yellow rounded-[20px] focus:bg-white outline-none transition-all font-black text-lg text-gray-900 placeholder-gray-400 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all shadow-sm ${activeCategory === cat
                                        ? 'bg-black text-white scale-105'
                                        : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-white hover:text-black'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Help */}
                <div className="flex gap-4 mb-6 px-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-whatsapp-DEFAULT rounded-full"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Épuisé</span>
                    </div>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow mb-4"></div>
                        <span className="text-gray-400 font-bold tracking-widest">SYNCHRONISATION...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <div
                                key={item._id}
                                onClick={() => toggleAvailability(item._id, item.isAvailable)}
                                className={`
                                    bg-white rounded-[32px] p-6 shadow-xl border-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between
                                    ${!item.isAvailable
                                        ? 'border-red-500 bg-red-50/30'
                                        : 'border-white hover:border-whatsapp-DEFAULT active:scale-95'
                                    }
                                `}
                            >
                                {item.imageUrl && (
                                    <div className="w-full h-32 mb-4 rounded-2xl overflow-hidden shadow-inner">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="mb-4">
                                    <h3 className={`font-black text-xl leading-tight mb-1 ${!item.isAvailable ? 'text-red-700' : 'text-gray-900'}`}>
                                        {item.name}
                                    </h3>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${!item.isAvailable ? 'text-red-400' : 'text-gray-300'}`}>
                                        {item.category}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter ${!item.isAvailable ? 'bg-red-500 text-white' : 'bg-whatsapp-DEFAULT/10 text-whatsapp-DEFAULT'}`}>
                                        {item.isAvailable ? 'EN STOCK' : 'INDISPONIBLE'}
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${item.isAvailable
                                        ? 'bg-whatsapp-DEFAULT text-white group-hover:rotate-12'
                                        : 'bg-red-100 text-red-600'
                                        }`}>
                                        {item.isAvailable ? <CheckCircle size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredItems.length === 0 && (
                    <div className="h-[40vh] flex flex-col items-center justify-center bg-white rounded-[40px] shadow-sm border-2 border-dashed border-gray-200">
                        <Search size={48} className="text-gray-200 mb-4" />
                        <h2 className="text-xl font-black text-gray-300 uppercase tracking-widest text-center px-6">
                            Aucun plat trouvé pour "{searchTerm}"
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenMenuControl;
