import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

const MenuManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data } = await api.get('/menu/manager');
            setItems(data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Certain ?')) {
            try {
                await api.delete(`/menu/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Menu</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Catalogue complet des produits</p>
                </div>
                <button
                    onClick={() => navigate('/admin/menu/new')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-blue-700 font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    Nouveal Article
                </button>
            </div>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Article</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Catégorie</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Prix</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Disponibilité</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item) => (
                                <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 shadow-sm">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-gray-300">NO IMG</div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors truncate">{item.name}</div>
                                                {item.description && <div className="text-xs text-gray-400 font-medium truncate max-w-[200px]">{item.description}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 text-[10px] font-black rounded-full bg-gray-100 text-gray-500 uppercase tracking-widest border border-gray-200">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-gray-900 whitespace-nowrap">
                                        {item.price} <span className="text-[10px] text-gray-400">DHS</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-center gap-1">
                                            {item.availableDays && item.availableDays.length > 0 ? (
                                                <div className="flex items-center gap-1.5 text-blue-600">
                                                    <Calendar size={12} strokeWidth={3} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {item.availableDays.length === 1 && item.availableDays[0] === 5 ? 'VENDREDI' :
                                                            item.availableDays.length === 1 && item.availableDays[0] === 3 ? 'MERCREDI' :
                                                                `${item.availableDays.length} JOURS`}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Permanent</span>
                                            )}
                                            {!item.isAvailable && (
                                                <span className="text-[9px] font-black text-red-500 uppercase tracking-tight bg-red-50 px-2 py-0.5 rounded border border-red-100 mt-1">Épuisé</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/menu/edit/${item._id}`)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Modifier"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
