import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        fetchHistory();
    }, [page]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/orders/history?page=${page}&limit=${limit}`);
            setOrders(data.orders);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const calculateDuration = (start, end) => {
        if (!start || !end) return '-';
        const diff = new Date(end) - new Date(start);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Historique</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Archive des commandes traitées</p>
                </div>
                <div className="bg-blue-50 px-5 py-3 rounded-2xl flex items-center gap-3 border border-blue-100/50">
                    <Clock className="text-blue-600" size={20} />
                    <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Temps Réel</span>
                </div>
            </div>

            {loading ? (
                <div className="p-10 text-center text-gray-400">Chargement...</div>
            ) : (
                <>
                    <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Table</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Cuisinier</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commande</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Montant</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Timing</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Détails Temps</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 uppercase">
                                    {orders.map(order => (
                                        <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6 text-center">
                                                <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                                                    {order.tableNumber}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <User size={14} strokeWidth={3} />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-900">
                                                        {order.kitchenStaffId?.fullName || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    {order.items.slice(0, 2).map((item, i) => (
                                                        <div key={i} className="text-[10px] font-bold text-gray-600">
                                                            <span className="text-blue-600">{item.quantity}×</span> {item.name}
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <span className="text-[9px] font-black text-gray-300">+{order.items.length - 2} ARTICLES</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-gray-900">
                                                {order.totalAmount} <span className="text-[10px] text-gray-400 uppercase">DHS</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                {order.startedAt && order.readyAt ? (
                                                    <div className="inline-flex items-center bg-whatsapp-DEFAULT/10 text-whatsapp-DEFAULT px-3 py-1 rounded-full text-[10px] font-black border border-whatsapp-DEFAULT/20">
                                                        {calculateDuration(order.startedAt, order.readyAt)}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-300">-</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end gap-1 font-mono text-[10px] font-bold text-gray-400">
                                                    <div className="flex gap-2"><span>REÇU:</span> <span className="text-gray-800">{formatDate(order.createdAt)}</span></div>
                                                    <div className="flex gap-2"><span>PRÊT:</span> <span className="text-blue-600 font-black">{formatDate(order.readyAt)}</span></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
                            >
                                <ChevronLeft size={16} strokeWidth={3} /> Précédent
                            </button>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                Page <span className="text-black">{page}</span> / {totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-black hover:text-white transition-all shadow-sm"
                            >
                                Suivant <ChevronRight size={16} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderHistory;
