import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2, QrCode, ExternalLink } from 'lucide-react';

const TableManagement = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTableNumber, setNewTableNumber] = useState('');

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const { data } = await api.get('/tables');
            setTables(data);
        } catch (error) {
            console.error('Failed to load tables');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/tables', { tableNumber: newTableNumber });
            setTables([...tables, data].sort((a, b) => a.tableNumber - b.tableNumber));
            setNewTableNumber('');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add table');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Certain ?')) return;
        try {
            await api.delete(`/tables/${id}`);
            setTables(tables.filter(t => t._id !== id));
        } catch (error) {
            alert('Delete failed');
        }
    };

    if (loading) return <div className="p-8">Chargement...</div>;

    return (
        <div>
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Tables</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configuration des QR Codes</p>
                </div>
                <form onSubmit={handleAddTable} className="flex gap-3">
                    <input
                        type="number"
                        placeholder="N° TABLE"
                        className="w-32 bg-gray-50 border border-gray-100 p-4 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none font-black text-gray-800 transition-all text-center"
                        value={newTableNumber}
                        onChange={(e) => setNewTableNumber(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-black font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                        <Plus size={20} strokeWidth={3} /> Créer
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-32">N° Table</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut QR-Code</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 uppercase">
                        {tables.map(table => (
                            <tr key={table._id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-6 text-center">
                                    <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-slate-200">
                                        {table.tableNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                            <QrCode size={16} className="text-gray-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-500 mb-1">LIEN CLIENT:</span>
                                            <code className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black lowercase">
                                                /table/{table.tableNumber}
                                            </code>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex justify-end gap-2 text-right">
                                        <button
                                            onClick={() => window.open(`/table/${table.tableNumber}`, '_blank')}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            title="Tester le lien"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(table._id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Supprimer la table"
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

            {tables.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                    Aucune table configurée. Ajoutez-en une pour commencer.
                </div>
            )}
        </div>
    );
};

export default TableManagement;
