import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkTableStatus } from '../../api/orderService';
import { startSession } from '../../api/orderService';
import { useCart } from '../../context/CartContext';

const TableEntry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTableNumber } = useCart();
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyTable = async () => {
            try {
                const data = await checkTableStatus(id);

                if (data.isAvailable) {
                    setStatus('available');
                } else {
                    // If active order exists, maybe redirect to status page directly?
                    // For now, let's show a message or redirect if it's THIS user's order
                    setStatus('busy');
                }
            } catch (err) {
                setError('Table invalid or network error');
                setStatus('error');
            }
        };

        verifyTable();
    }, [id]);

    // Confirm table and start session
    const confirmTable = async () => {
        try {
            const data = await startSession(id);
            if (data.sessionToken) {
                // Save token to sessionStorage (tab specific)
                sessionStorage.setItem('tableSessionToken', data.sessionToken);
                // Also save tableNumber to sessionStorage
                sessionStorage.setItem('tableNumber', id);

                // Update context (which syncs to localStorage, but we rely on sessionStorage for security now)
                setTableNumber(id);

                navigate('/menu');
            }
        } catch (error) {
            console.error("Failed to start session", error);
            setError("Impossible de démarrer la session. Réessayez.");
            setStatus('error');
        }
    };

    if (status === 'loading') return <div className="p-8 text-center">Checking table...</div>;
    if (status === 'error') return <div className="p-8 text-center text-red-600">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative font-sans">
            <div className="relative z-10 w-full max-w-sm">
                <div className="bg-white rounded-[30px] shadow-xl p-8 border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-yellow/10 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        🛎️
                    </div>

                    <h1 className="text-2xl font-bold mb-2 text-gray-900">Bienvenue</h1>
                    <p className="mb-8 text-gray-500 font-medium">Confirmez-vous votre installation ?</p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Votre Table</span>
                        <div className="text-4xl font-extrabold text-black mt-1">{id}</div>
                    </div>

                    {status === 'available' ? (
                        <div className="space-y-3">
                            <button
                                onClick={confirmTable}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-gray-900 transition transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                Oui, c'est ma table
                            </button>
                            <button
                                className="w-full bg-white text-gray-500 border border-gray-200 py-4 rounded-xl font-bold hover:bg-gray-50 transition"
                            >
                                Non, scanner à nouveau
                            </button>
                        </div>
                    ) : (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
                            <p className="font-bold mb-1">Table occupée</p>
                            <p className="text-xs">Une commande est déjà en cours.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TableEntry;
