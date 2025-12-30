import { useState, useEffect } from 'react';
import api from '../../api/axios';
import socket from '../../api/socket';
import { useAuth } from '../../context/AuthContext';
import { Coffee, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const KitchenDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();

        socket.on('new_order', (newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
            playNotification();
        });

        return () => {
            socket.off('new_order');
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            // Filter inactive orders (pending/preparing). 
            // We sort by newest first (descending createdAt)
            const activeOrders = data.filter(o => o.status !== 'ready' && o.status !== 'cancelled');
            activeOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(activeOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (orderId) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: 'preparing' });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'preparing' } : o));
        } catch (error) {
            console.error('Failed to confirm', error);
        }
    };

    const handleFinish = async (orderId) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: 'ready' });

            // Visual update to "Terminé"
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'ready' } : o));

            // Auto-remove after 10s
            setTimeout(() => {
                setOrders(prev => prev.filter(o => o._id !== orderId));
            }, 10000);

        } catch (error) {
            console.error('Failed to finish', error);
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) return;
        try {
            await api.patch(`/orders/${orderId}/status`, { status: 'cancelled' });
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch (error) {
            console.error('Failed to cancel', error);
        }
    };

    const playNotification = () => {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play failed', e));
    };

    const getTimeElapsed = (dateString) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        return `${minutes} min`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <header className="bg-black shadow-2xl p-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="bg-yellow p-2 rounded-xl">
                        <Coffee className="text-black w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="font-black text-xl tracking-tighter text-white uppercase">Kitchen Display</h1>
                        <p className="text-[10px] text-yellow font-bold uppercase tracking-widest leading-none">WhatsApp Pool Café</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/kitchen/menu-control')}
                        className="bg-yellow text-black px-6 py-2.5 rounded-xl font-black hover:bg-white transition-all text-xs border border-yellow shadow-lg shadow-yellow/20 uppercase tracking-widest"
                    >
                        Contrôle de Menu
                    </button>
                    <div className="h-10 w-px bg-gray-800"></div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-yellow/70 uppercase tracking-widest">Session active</p>
                            <p className="text-sm font-black text-white uppercase tracking-tighter">{user?.fullName}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition-all font-bold text-sm border border-red-500/20"
                        >
                            Quitter
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-6 flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow mb-4"></div>
                        <span className="text-gray-400 font-bold tracking-widest">SÉCURISATION DU FLUX...</span>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest leading-normal border-b border-gray-100">
                                    <th className="py-5 px-8">Table</th>
                                    <th className="py-5 px-8">Commande</th>
                                    <th className="py-5 px-8 w-48">Notes</th>
                                    <th className="py-5 px-8 w-32">Temps</th>
                                    <th className="py-5 px-8 w-60 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-800">
                                {orders.map(order => {
                                    const isReady = order.status === 'ready';
                                    const isPreparing = order.status === 'preparing';

                                    return (
                                        <tr key={order._id} className={`border-b border-gray-50 transition-colors ${isReady ? 'bg-whatsapp-DEFAULT/5' : isPreparing ? 'bg-yellow/5' : 'hover:bg-gray-50'}`}>
                                            <td className="py-8 px-8">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black shadow-md ${isReady ? 'bg-whatsapp-DEFAULT text-white' : isPreparing ? 'bg-yellow text-black' : 'bg-black text-white'}`}>
                                                    {order.tableNumber}
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-300 mt-2 text-center uppercase">#{order._id.slice(-4)}</p>
                                            </td>
                                            <td className="py-8 px-8 align-top">
                                                <div className="flex flex-col gap-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="pb-2 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
                                                            <div className="flex items-start gap-4">
                                                                <span className="bg-black text-white w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-sm">
                                                                    {item.quantity}
                                                                </span>
                                                                <div className="flex-1">
                                                                    <p className="font-bold text-lg text-gray-900 leading-tight">{item.name}</p>

                                                                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                                                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                                                            {item.selectedOptions.map((opt, i) => (
                                                                                <span key={i} className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200">
                                                                                    {opt.name}: {opt.value}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {item.specialInstructions && (
                                                                        <div className="mt-2 bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-black border border-red-100 italic">
                                                                            NB: {item.specialInstructions}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-8 px-8 align-top">
                                                {order.customerNotes ? (
                                                    <div className="bg-yellow/5 border border-yellow/10 text-yellow-800 p-4 rounded-2xl text-xs font-bold leading-relaxed relative">
                                                        <span className="absolute -top-2 left-4 bg-yellow text-black text-[8px] px-2 py-0.5 rounded font-black uppercase">Note client</span>
                                                        {order.customerNotes}
                                                    </div>
                                                ) : <span className="text-gray-200">-</span>}
                                            </td>
                                            <td className="py-8 px-8 align-top">
                                                <div className="flex items-center gap-2 text-black font-black mb-1">
                                                    <Clock size={16} />
                                                    <span>{getTimeElapsed(order.createdAt)}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="py-8 px-8 text-center align-middle">
                                                <div className="flex flex-col gap-2">
                                                    {!isReady && !isPreparing && (
                                                        <>
                                                            <button
                                                                onClick={() => handleConfirm(order._id)}
                                                                className="w-full bg-yellow text-black h-12 rounded-xl font-black text-sm shadow-lg hover:bg-white transition-all active:scale-95 flex items-center justify-center uppercase tracking-widest"
                                                            >
                                                                Commencer
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(order._id)}
                                                                className="w-full bg-transparent text-red-500 py-2 rounded-xl font-bold text-xs hover:bg-red-50 transition-all"
                                                            >
                                                                Annuler
                                                            </button>
                                                        </>
                                                    )}

                                                    {isPreparing && (
                                                        <button
                                                            onClick={() => handleFinish(order._id)}
                                                            className="w-full bg-black text-white h-14 rounded-xl font-black text-sm shadow-xl hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-3 border-b-4 border-yellow uppercase tracking-widest"
                                                        >
                                                            <CheckCircle size={18} />
                                                            Terminer
                                                        </button>
                                                    )}

                                                    {isReady && (
                                                        <div className="flex flex-col items-center justify-center text-whatsapp-DEFAULT font-black animate-pulse">
                                                            <CheckCircle size={28} className="mb-1" />
                                                            <span className="text-sm">BIENTÔT RETIRÉ</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-32 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="bg-gray-50 p-8 rounded-full mb-6">
                                                    <Coffee size={48} className="text-gray-200" />
                                                </div>
                                                <p className="text-2xl font-black text-gray-200 uppercase tracking-widest">Cuisine en Pause</p>
                                                <p className="text-gray-400 font-medium mt-2 italic">Aucune commande en attente pour le moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard;
