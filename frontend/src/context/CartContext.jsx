import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);

    // Load cart from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        const savedTable = localStorage.getItem('tableNumber');
        if (savedTable) {
            setTableNumber(savedTable);
        }
    }, []);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (tableNumber) {
            localStorage.setItem('tableNumber', tableNumber);
        }
    }, [tableNumber]);


    const addToCart = (item, quantity = 1, specialInstructions = '', selectedOptions = []) => {
        setCart((prev) => {
            // Helper to compare options arrays
            const optionsMatch = (opts1, opts2) => {
                if (opts1.length !== opts2.length) return false;
                // Sort by name ensures consistent comparison
                const s1 = [...opts1].sort((a, b) => a.name.localeCompare(b.name));
                const s2 = [...opts2].sort((a, b) => a.name.localeCompare(b.name));
                return s1.every((o, i) => o.name === s2[i].name && o.value === s2[i].value);
            };

            const existing = prev.find(
                (i) => i._id === item._id &&
                    i.specialInstructions === specialInstructions &&
                    optionsMatch(i.selectedOptions || [], selectedOptions)
            );

            if (existing) {
                return prev.map((i) =>
                    (i._id === item._id &&
                        i.specialInstructions === specialInstructions &&
                        optionsMatch(i.selectedOptions || [], selectedOptions))
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            return [...prev, { ...item, quantity, specialInstructions, selectedOptions }];
        });
    };

    const removeFromCart = (itemId, specialInstructions = '', selectedOptions = []) => {
        const optionsMatch = (opts1, opts2) => {
            if (opts1.length !== opts2.length) return false;
            const s1 = [...opts1].sort((a, b) => a.name.localeCompare(b.name));
            const s2 = [...opts2].sort((a, b) => a.name.localeCompare(b.name));
            return s1.every((o, i) => o.name === s2[i].name && o.value === s2[i].value);
        };

        setCart((prev) => prev.filter((i) => !(i._id === itemId &&
            i.specialInstructions === specialInstructions &&
            optionsMatch(i.selectedOptions || [], selectedOptions))));
    };

    const updateQuantity = (itemId, quantity, specialInstructions = '', selectedOptions = []) => {
        const optionsMatch = (opts1, opts2) => {
            if (opts1.length !== opts2.length) return false;
            const s1 = [...opts1].sort((a, b) => a.name.localeCompare(b.name));
            const s2 = [...opts2].sort((a, b) => a.name.localeCompare(b.name));
            return s1.every((o, i) => o.name === s2[i].name && o.value === s2[i].value);
        };

        setCart((prev) =>
            prev.map((i) =>
                i._id === itemId &&
                    i.specialInstructions === specialInstructions &&
                    optionsMatch(i.selectedOptions || [], selectedOptions)
                    ? { ...i, quantity: Math.max(0, quantity) }
                    : i
            ).filter(i => i.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('cart');
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalAmount,
            tableNumber,
            setTableNumber
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
