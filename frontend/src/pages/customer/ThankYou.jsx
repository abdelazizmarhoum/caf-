import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, RefreshCw, Home } from 'lucide-react';

const ThankYou = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Attempt to retrieve tableId from state passed during navigation, 
    // or fallback to localStorage if we implemented that.
    // For now, if we don't have it, we might just go to home.
    const tableId = location.state?.tableId;

    const handleOrderAgain = () => {
        if (tableId) {
            navigate(`/table/${tableId}`);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="bg-white p-10 rounded-[40px] shadow-xl max-w-sm w-full border border-gray-100">
                <div className="w-24 h-24 bg-whatsapp-DEFAULT/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Heart size={40} className="text-whatsapp-DEFAULT fill-current" />
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Merci !</h1>
                <p className="text-gray-500 mb-8 font-medium leading-relaxed">
                    Nous espérons que vous avez apprécié votre moment au <br />
                    <span className="text-black font-bold">WhatsApp Pool Café</span>.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleOrderAgain}
                        className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:bg-gray-800 transition transform active:scale-95 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} />
                        Commander à nouveau
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 text-gray-600 font-bold py-4 px-6 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Retour à l'accueil
                    </button>
                </div>
            </div>

            <footer className="mt-8 text-gray-400 text-sm font-medium">
                À bientôt ! 🌴
            </footer>
        </div>
    );
};

export default ThankYou;
