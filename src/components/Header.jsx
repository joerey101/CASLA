'use client';

import { Search, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const SHIELD_URL = '/logos/CASLA_logo.png';

export default function Header({
    currentUser,
    onSearch,
    onLogout,
    onHomeClick,
    onToggleMobile,
}) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchQuery);
        }
    };

    const handleSearchClick = () => {
        onSearch(searchQuery);
    };

    return (
        <header className="bg-[#002D58] text-white shadow-xl sticky top-0 z-50 border-b-4 border-[#E30613]">
            <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
                {/* Left: Logo & Brand */}
                <div className="flex items-center gap-3">
                    <button onClick={onToggleMobile} className="md:hidden p-2 hover:bg-white/10 rounded-lg">
                        <Menu size={24} />
                    </button>
                    <div
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 cursor-pointer"
                        onClick={onHomeClick}
                    >
                        <img src={SHIELD_URL} className="w-full h-full object-contain" alt="CASLA" />
                    </div>
                    <div className="leading-tight">
                        <h1 className="text-sm md:text-lg font-black uppercase tracking-tight">
                            PORTAL <span className="text-red-500">ADM</span>
                        </h1>
                        <p className="hidden md:block text-[10px] tracking-widest uppercase opacity-70 font-bold">
                            {currentUser.role.toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Center: Search */}
                <div className="hidden md:flex items-center gap-2 bg-blue-950/50 p-2 rounded-xl border border-blue-800">
                    <input
                        type="text"
                        placeholder="DNI, N° Socio o Apellido..."
                        className="bg-transparent text-sm w-64 outline-none px-2 text-white placeholder-blue-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button onClick={handleSearchClick} className="bg-red-600 hover:bg-red-700 p-2 rounded-lg shadow-lg">
                        <Search size={18} />
                    </button>
                </div>

                {/* Right: User info & Logout */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col text-right mr-2">
                        <span className="text-xs font-bold">{currentUser.name}</span>
                        <span className="text-[10px] opacity-70 uppercase">{currentUser.role}</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center font-bold text-xs border border-blue-400">
                        {currentUser.avatar}
                    </div>
                    <button onClick={onLogout} className="p-2 hover:bg-red-600/20 rounded-lg text-red-400">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
