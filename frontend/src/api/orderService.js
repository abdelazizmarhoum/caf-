import api from './axios';

export const checkTableStatus = async (tableNumber) => {
    const { data } = await api.get(`/tables/${tableNumber}`);
    return data;
};

export const placeOrder = async (orderData) => {
    const { data } = await api.post('/orders', orderData);
    return data;
};

export const getOrderStatus = async (orderId) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
};

export const getMenu = async () => {
    const { data } = await api.get('/menu');
    return data;
};

export const startSession = async (tableNumber) => {
    const { data } = await api.post(`/tables/${tableNumber}/session`);
    return data;
};

export const validateSession = async (tableNumber, sessionToken) => {
    try {
        const { data } = await api.post('/tables/validate-session', { tableNumber, sessionToken });
        return data.valid;
    } catch (error) {
        return false;
    }
};
