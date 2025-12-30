import { useNavigate, useLocation } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            alert(location.state.message);
            // Clear state so it doesn't show again on refresh? 
            // React Router state persists on refresh? No, usually it doesn't unless explicitly handled.
            // But we can clear it by replacing history.
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    return (
        <div className="relative -mt-8 bg-white lg:w-full min-h-screen flex items-center">
            <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
                {/* Text Content */}
                <div className="flex flex-col justify-center px-4 py-12 md:py-16 lg:col-span-7 lg:gap-x-6 lg:px-6 lg:py-24 xl:col-span-6">
                    <div className="flex items-center p-1 space-x-2 bg-gray-100 rounded-full max-w-max mb-8">
                        <div className="bg-white rounded-full p-1">
                            <Utensils size={14} className="text-whatsapp-DEFAULT" />
                        </div>
                        <p className="text-sm font-medium pr-2">
                            Bienvenue au Café &rarr;
                        </p>
                    </div>

                    <h1 className="text-3xl font-normal tracking-tight text-black md:text-4xl lg:text-6xl">
                        Commandez Votre
                        <div className="font-serif text-4xl font-bold text-yellow md:text-6xl">
                            {" "}
                            Boisson Préférée
                        </div>
                    </h1>

                    <p className="mt-8 text-lg text-gray-700 leading-relaxed">
                        "Satisfaites vos envies, élevez votre goût. Bienvenue au{" "}
                        <span className="font-semibold text-whatsapp-DEFAULT">WhatsApp Café</span>,
                        où chaque gorgée est un délice !"
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        {/* QR Code Action (Mock Search) */}
                        <div className="relative flex-grow max-w-md">
                            <div className="flex w-full px-4 py-3 text-sm bg-transparent border rounded-md border-black/30 text-gray-500 items-center">
                                <span>Scanner le QR Code sur votre table...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative px-2 lg:col-span-5 xl:col-span-6 lg:mb-9 flex items-center">
                    <img
                        className="aspect-square bg-white object-contain lg:h-[400px] xl:aspect-[1/1] rounded-3xl transform hover:scale-105 transition duration-700"
                        src="/logo.png"
                        alt="WhatsApp Café Logo"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
