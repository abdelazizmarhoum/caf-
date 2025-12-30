import { useState } from 'react';
import { X, Check } from 'lucide-react';

const OptionModal = ({ item, onClose, onConfirm }) => {
    // State to hold current selections: { "Sucre": "Un peu", "Type": "Verre" }
    const [selections, setSelections] = useState(() => {
        const initial = {};
        item.options.forEach(opt => {
            // Default to first choice
            if (opt.choices && opt.choices.length > 0) {
                initial[opt.name] = opt.choices[0]; // Or make user choose? Default is faster UX.
            }
        });
        return initial;
    });

    const handleSelect = (optionName, choice) => {
        setSelections(prev => ({ ...prev, [optionName]: choice }));
    };

    const handleConfirm = () => {
        // Convert map to array format used by backend/schema
        // [{ name: "Sucre", value: "Un peu" }]
        const optionsArray = Object.entries(selections).map(([name, value]) => ({
            name,
            value
        }));
        onConfirm(item, 1, '', optionsArray);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-slide-up sm:animate-scale-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto mb-6">
                    {item.options.map((opt) => (
                        <div key={opt.name}>
                            <h3 className="font-semibold text-gray-700 mb-2">{opt.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {opt.choices.map((choice) => (
                                    <button
                                        key={choice}
                                        onClick={() => handleSelect(opt.name, choice)}
                                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${selections[opt.name] === choice
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {choice}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3">
                    <span className="flex-1 font-bold text-xl py-3 flex items-center text-blue-600">
                        {item.price} DH
                    </span>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 bg-yellow hover:bg-black hover:text-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 uppercase text-xs tracking-widest"
                    >
                        <Check size={20} strokeWidth={3} />
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionModal;
