import { useState, useEffect } from 'react';
import { Coffee, Cookie, Pizza, Sandwich, Cake, Croissant, RotateCw } from 'lucide-react';

const ICONS = [Coffee, Cookie, Pizza, Sandwich, Cake, Croissant];

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [moves, setMoves] = useState(0);

    const shuffleCards = () => {
        const shuffled = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));

        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setDisabled(false);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || matched.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setDisabled(true);
            const [first, second] = newFlipped;

            if (cards[first].icon === cards[second].icon) {
                setMatched((prev) => [...prev, first, second]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 800);
            }
        }
    };

    const isGameOver = matched.length === cards.length && cards.length > 0;

    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto font-sans">
            {/* Stats */}
            <div className="flex justify-between w-full mb-6 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coups</p>
                    <p className="text-xl font-black text-black">{moves}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Paires</p>
                    <p className="text-xl font-black text-whatsapp-DEFAULT">{matched.length / 2}/6</p>
                </div>
                <button
                    onClick={shuffleCards}
                    className="flex flex-col items-center justify-center text-gray-400 hover:text-black transition"
                >
                    <RotateCw size={18} />
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3 w-full">
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    const isMatched = matched.includes(card.id);
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleClick(card.id)}
                            className={`
                                relative aspect-square rounded-2xl cursor-pointer transition-all duration-500 preserve-3d
                                ${isFlipped ? 'rotate-y-180' : ''}
                                ${isMatched ? 'opacity-50' : 'hover:scale-105'}
                            `}
                        >
                            {/* Front (Hidden) */}
                            <div className={`
                                absolute inset-0 bg-white border-2 border-gray-100 flex items-center justify-center rounded-2xl shadow-sm text-gray-200 text-xl font-bold
                                backface-hidden transition-opacity ${isFlipped ? 'opacity-0' : 'opacity-100'}
                            `}>
                                ?
                            </div>

                            {/* Back (Icon) */}
                            <div className={`
                                absolute inset-0 bg-yellow flex items-center justify-center rounded-2xl shadow-inner text-black
                                backface-hidden transform rotate-y-180 transition-opacity ${isFlipped ? 'opacity-100' : 'opacity-0'}
                            `}>
                                {isFlipped && <Icon size={24} strokeWidth={2.5} />}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isGameOver && (
                <div className="mt-8 text-center animate-bounce-slow">
                    <p className="font-black text-whatsapp-DEFAULT text-xl mb-3">Excellent ! 🎉</p>
                    <button
                        onClick={shuffleCards}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-gray-800 transition transform active:scale-95"
                    >
                        Recommencer
                    </button>
                </div>
            )}
        </div>
    );
};

export default MemoryGame;
