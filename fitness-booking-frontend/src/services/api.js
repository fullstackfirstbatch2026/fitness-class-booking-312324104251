import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8089/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const memberApi = {
    getAll: () => api.get("/members"),
    getById: (id) => api.get(`/members/${id}`),
    create: (data) => api.post("/members", data),
    update: (id, data) => api.put(`/members/${id}`, data),
    delete: (id) => api.delete(`/members/${id}`),
};

export const trainerApi = {
    getAll: () => api.get("/trainers"),
    getById: (id) => api.get(`/trainers/${id}`),
    create: (data) => api.post("/trainers", data),
    update: (id, data) => api.put(`/trainers/${id}`, data),
    delete: (id) => api.delete(`/trainers/${id}`),
};

export const classApi = {
    getAll: () => api.get("/classes"),
    getById: (id) => api.get(`/classes/${id}`),
    create: (data) => api.post("/classes", data),
    update: (id, data) => api.put(`/classes/${id}`, data),
    delete: (id) => api.delete(`/classes/${id}`),
};

export const bookingApi = {
    getAll: () => api.get("/bookings"),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post("/bookings", data),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export default api;