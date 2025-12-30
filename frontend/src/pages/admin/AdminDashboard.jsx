import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MenuManagement from './MenuManagement';
import StaffManagement from './StaffManagement';
import TableManagement from './TableManagement';
import OrderHistory from './OrderHistory';

import { LayoutDashboard, ShoppingBag, Users, Table as TableIcon, LogOut, Coffee } from 'lucide-react';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('menu');

    const navItems = [
        { id: 'menu', label: 'Gestion du Menu', icon: Coffee },
        { id: 'history', label: 'Historique', icon: ShoppingBag },
        { id: 'staff', label: 'Gestion du Staff', icon: Users },
        { id: 'tables', label: 'Gestion des Tables', icon: TableIcon },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-60 bg-slate-900 flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <LayoutDashboard className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-black text-white tracking-tight">ADMIN PANEL</h1>
                    </div>
                    <div className="flex items-center gap-3 px-1">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                            {user?.fullName?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-slate-200 truncate">{user?.fullName}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manager</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 mt-8 px-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                                `}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 relative">
                <main className="p-10 max-w-[1600px] mx-auto">
                    {activeTab === 'menu' && <MenuManagement />}
                    {activeTab === 'history' && <OrderHistory />}
                    {activeTab === 'staff' && < StaffManagement />}
                    {activeTab === 'tables' && <TableManagement />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
