import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, UserCheck, Save, Shield } from 'lucide-react';

const StaffEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'kitchen'
    });

    useEffect(() => {
        if (isEdit) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/users');
            const targetUser = data.find(u => u._id === id);
            if (targetUser) {
                setFormData({
                    fullName: targetUser.fullName,
                    email: targetUser.email,
                    password: '', // Keep blank for edit
                    role: targetUser.role
                });
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            alert('Failed to load staff details');
            navigate('/admin/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;
                await api.put(`/users/${id}`, payload);
            } else {
                await api.post('/users', formData);
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Error saving staff:', error);
            alert(error.response?.data?.message || 'Failed to save staff');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-400 font-bold animate-pulse">Chargement des données...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <div className="max-w-2xl mx-auto">
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
                            {isEdit ? 'Modifier' : 'Ajouter'} <span className="text-blue-600">Staff</span>
                        </h1>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Gestion des accès
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50/50 px-10 py-6 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informations du compte</span>
                        <Shield size={16} className="text-blue-600" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nom Complet</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="ex: Jean Dupont"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email Professionnel</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@poolcafe.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                    {isEdit ? 'Changer le mot de passe (laisser vide pour conserver)' : 'Mot de passe'}
                                </label>
                                <input
                                    type="password"
                                    required={!isEdit}
                                    className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-bold text-gray-800 transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Attribution du Rôle</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'kitchen' })}
                                        className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all ${formData.role === 'kitchen'
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200'
                                                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <User size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Cuisine</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: 'manager' })}
                                        className={`flex items-center justify-center gap-3 p-5 rounded-2xl border transition-all ${formData.role === 'manager'
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/10'
                                                : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <UserCheck size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Manager</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-5 rounded-2xl hover:bg-black transition-all font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Save size={20} strokeWidth={3} />
                                {isEdit ? 'Enregistrer les modifications' : 'Créer le compte staff'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StaffEditPage;
