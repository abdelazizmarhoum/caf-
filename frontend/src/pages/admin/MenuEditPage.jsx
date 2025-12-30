import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, Calendar, Save } from 'lucide-react';

const CATEGORIES = [
    'salades', 'pates', 'pizza', 'sandwichs', 'paninis',
    'burgers', 'brochettes', 'marocains', 'supplements'
];

const DAYS = [
    { id: 1, label: 'Lun' },
    { id: 2, label: 'Mar' },
    { id: 3, label: 'Mer' },
    { id: 4, label: 'Jeu' },
    { id: 5, label: 'Ven' },
    { id: 6, label: 'Sam' },
    { id: 0, label: 'Dim' },
];

const MenuEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'salades',
        description: '',
        imageUrl: '',
    });
    const [selectedDays, setSelectedDays] = useState([0, 1, 2, 3, 4, 5, 6]);

    useEffect(() => {
        if (isEdit) {
            fetchItem();
        }
    }, [id]);

    const fetchItem = async () => {
        try {
            const { data } = await api.get(`/menu/${id}`);
            setFormData({
                name: data.name,
                price: data.price,
                category: data.category,
                description: data.description || '',
                imageUrl: data.imageUrl || '',
            });
            if (!data.availableDays || data.availableDays.length === 0) {
                setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
            } else {
                setSelectedDays(data.availableDays);
            }
        } catch (error) {
            console.error('Error fetching item:', error);
            alert('Failed to load item details');
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const toggleDay = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            availableDays: selectedDays.length === 7 ? [] : selectedDays
        };

        try {
            if (isEdit) {
                await api.put(`/menu/${id}`, payload);
            } else {
                await api.post('/menu', payload);
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-400 font-bold animate-pulse">Chargement des données...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold group"
                    >
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        Retour
                    </button>
                    <div className="text-right">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
                            {isEdit ? 'Modifier' : 'Ajouter'} <span className="text-blue-600">Article</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Configuration du menu
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 px-10 py-6 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Détails de l'article</span>
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom du Plat</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all text-lg"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ex: Pizza Royale"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Prix (DHS)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all text-lg"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">URL de l'Image</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    className="flex-1 bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                />
                                {formData.imageUrl && (
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                        <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Catégorie</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, category: cat })}
                                        className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.category === cat
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                                            : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                            <textarea
                                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ingrédients, taille, allergènes..."
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-gray-400" />
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Disponibilité Hebdomadaire</label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {DAYS.map(day => {
                                    const isSelected = selectedDays.includes(day.id);
                                    return (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => toggleDay(day.id)}
                                            className={`px-5 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${isSelected
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                                }`}
                                        >
                                            {day.label.toUpperCase()}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 italic">
                                * L'article ne sera visible par les clients que les jours sélectionnés.
                            </p>
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button
                                type="submit"
                                className="w-full md:w-auto bg-blue-600 text-white px-12 py-5 rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Save size={20} strokeWidth={3} />
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MenuEditPage;
