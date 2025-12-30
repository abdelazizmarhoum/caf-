import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, User, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StaffManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Certain ?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            alert('Delete failed');
        }
    };

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-10 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Équipe</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gestion des comptes staff</p>
                </div>
                <button
                    onClick={() => navigate('/admin/staff/new')}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-blue-700 font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    <Plus size={20} className="mr-2" strokeWidth={3} /> Nouvel Utilisateur
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Membre du Staff</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rôle</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 uppercase">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${user.role === 'manager' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-gray-900">{user.fullName}</div>
                                            <div className="text-[10px] font-bold text-gray-400 lowercase">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'manager' ? <UserCheck size={14} className="text-purple-500" /> : <User size={14} className="text-blue-500" />}
                                        <span className={`text-[10px] font-black tracking-widest ${user.role === 'manager' ? 'text-purple-600' : 'text-blue-600'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-whatsapp-DEFAULT/10 text-whatsapp-DEFAULT text-[9px] font-black border border-whatsapp-DEFAULT/10">
                                        ACTIF
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/staff/edit/${user._id}`)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Modifier"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {user._id !== currentUser._id && (
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StaffManagement;
