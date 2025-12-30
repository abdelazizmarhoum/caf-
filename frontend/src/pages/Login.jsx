import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            if (user.role === 'manager') {
                navigate('/admin/dashboard');
            } else if (user.role === 'kitchen') {
                navigate('/kitchen/dashboard');
            } else {
                navigate(from);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-whatsapp-DEFAULT/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-gray-100">

                    <h2 className="text-3xl font-black text-center text-gray-900 mb-2 uppercase tracking-tight">Staff Access</h2>
                    <p className="text-center text-gray-400 font-medium mb-10">WhatsApp Pool Café Management</p>

                    {error && (
                        <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-2xl border border-red-100 font-bold flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest" htmlFor="email">
                                Email Professional
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-gray-800 placeholder-gray-300"
                                placeholder="name@poolcafe.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 ml-4 tracking-widest" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all font-bold text-gray-800 placeholder-gray-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-gray-800 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                            type="submit"
                        >
                            <span>Connexion</span>
                            <div className="w-6 h-6 bg-yellow rounded-full flex items-center justify-center">
                                <span className="text-black text-xs font-bold font-sans">→</span>
                            </div>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Login;
