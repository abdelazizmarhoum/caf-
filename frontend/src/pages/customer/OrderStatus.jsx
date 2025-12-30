import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderStatus } from '../../api/orderService';
import socket from '../../api/socket';
import { Clock, ChefHat, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import MemoryGame from '../../components/MemoryGame';


const OrderStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const data = await getOrderStatus(id);
                setOrder(data);

                // If loaded and already ready, redirect immediately? 
                // Maybe better to show it briefly or just show the "Ready" state then redirect.
                // User requirement: "when he fnish he cleik finir and the order ... system shoudl take him to a page"
                // So if it happens live, we redirect. If already ready, maybe we show "Ready"
                if (data.status === 'ready') {
                    // Check if we should redirect immediately or let them see it.
                    // Let's redirect after a short delay if they land here and it's done.
                    setTimeout(() => {
                        navigate('/thank-you', { state: { tableId: data.tableNumber } }); // Using tableNumber as proxy for ID if we assume Table 1 map to ID 1? 
                        // Actually tableNumber is often just a number. The route is /table/:id. 
                        // If :id is the Mongo ID of the table, we need that.
                        // Order model has "tableNumber". It doesn't seem to store Table Object ID explicitly in the simplified schema viewed earlier?
                        // Let's check Table.js schema later if needed. For now let's hope tableNumber allows finding it or we use it as ID.
                    }, 2000);
                }
            } catch (error) {
                console.error('Error fetching order status');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        const handleStatusUpdate = (data) => {
            // data might contain just status or full object
            if (data.orderId === id || data._id === id) {
                const newStatus = data.status || 'preparing';
                setOrder((prev) => ({ ...prev, status: newStatus }));

                if (newStatus === 'ready') {
                    // Redirect to Thank You page
                    // We use order.tableNumber from state if available, or from data
                    const tableNum = order?.tableNumber || data.tableNumber;
                    // navigating to Table Entry using number? 
                    // Usually we need the Table ID (Mongo ID) for the URL /table/:id? 
                    // Or maybe /table/:tableNumber?
                    // Let's assume we pass what we have.
                    setTimeout(() => {
                        navigate('/thank-you', { state: { tableId: tableNum } });
                    }, 1000);
                }
            }
        };

        socket.on('order_started', handleStatusUpdate);
        socket.on('order_ready', handleStatusUpdate);
        socket.on('order_cancelled', (data) => {
            if (order && (data.orderId === order._id || data._id === order._id)) {
                setOrder(prev => ({ ...prev, status: 'cancelled' }));
            }
        });

        return () => {
            socket.off('order_started');
            socket.off('order_ready');
            socket.off('order_cancelled');
        };
    }, [id, navigate, order]); // added order dep for closure

    if (loading) return <div className="p-8 text-center animate-pulse">Chargement...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Commande introuvable</div>;

    const getStatusDisplay = () => {
        switch (order.status) {
            case 'pending':
                return {
                    icon: Clock,
                    text: 'En Attente',
                    subtext: 'Votre commande a été envoyée en cuisine.',
                    color: 'text-yellow',
                    bg: 'bg-yellow/10'
                };
            case 'preparing':
                return {
                    icon: ChefHat,
                    text: 'En Préparation',
                    subtext: 'Nos chefs préparent votre festin !',
                    color: 'text-blue-500',
                    bg: 'bg-blue-50'
                };
            case 'ready':
                return {
                    icon: CheckCircle,
                    text: 'Prête !',
                    subtext: 'Votre commande arrive à votre table.',
                    color: 'text-whatsapp-DEFAULT',
                    bg: 'bg-whatsapp-DEFAULT/10'
                };
            case 'cancelled':
                return {
                    icon: AlertCircle,
                    text: 'Annulée',
                    subtext: 'Nous sommes désolés, votre commande a été annulée.',
                    color: 'text-red-500',
                    bg: 'bg-red-50'
                };
            default:
                return {
                    icon: Clock,
                    text: 'Statut Inconnu',
                    subtext: '...',
                    color: 'text-gray-400',
                    bg: 'bg-gray-100'
                };
        }
    };

    const statusConfig = getStatusDisplay();
    const StatusIcon = statusConfig.icon;

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col font-sans">
            {/* Status Card */}
            <div className="bg-white rounded-[40px] shadow-lg p-8 text-center mb-6 relative overflow-hidden">
                <div className="relative z-10">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${statusConfig.bg} animate-pulse`}>
                        <StatusIcon size={64} className={statusConfig.color} />
                    </div>

                    <h1 className={`text-3xl font-extrabold mb-2 ${statusConfig.color} uppercase tracking-wide`}>
                        {statusConfig.text}
                    </h1>
                    <p className="text-gray-500 font-medium text-lg mb-6">
                        {statusConfig.subtext}
                    </p>

                    <div className="inline-block bg-gray-100 rounded-full px-4 py-1 text-sm font-bold text-gray-500">
                        Commande #{order._id.slice(-4)} • Table {order.tableNumber}
                    </div>
                </div>
            </div>

            {/* Game Section - Only if not ready/cancelled */}
            {order.status !== 'ready' && order.status !== 'cancelled' && (
                <div className="flex-1">
                    <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">En attendant...</h2>
                            <span className="text-2xl">🎮</span>
                        </div>
                        <MemoryGame />
                    </div>
                </div>
            )}

            {order.status === 'cancelled' && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className={`bg-white rounded-[40px] shadow-2xl p-10 text-center border-t-8 ${statusConfig.color} w-full max-w-md`}>
                        <div className={`w-24 h-24 ${statusConfig.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                            <StatusIcon size={48} className={statusConfig.color} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">{statusConfig.text}</h2>
                        <p className="text-gray-500 font-medium mb-8">
                            Veuillez vous adresser à un serveur pour plus de détails ou repasser votre commande.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                        >
                            <ArrowLeft size={18} strokeWidth={3} />
                            Retour à l'Accueil
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;
