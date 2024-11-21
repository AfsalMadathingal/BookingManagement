import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});


export const getBook = async (id) => {
    try {
        const response = await api.get(`/api/books/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const addBook = async (data) => {
    try {
        const response = await api.post("/api/books", data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const getBooks = async () => {
    try {
        const response = await api.get("/api/books");
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



export const deleteBook = async (id)=>{
    try {

        const response = await api.delete(`/api/books/${id}`);
        
        return response.data
        
    } catch (error) {
        console.error(error)
        throw error
    }
}


export const updateBook = async (data,id ) => {
    try {


        const response = await api.put(`/api/books/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const searchBooks = async (query) => {
    try {
        const response = await api.get(`/api/books/search/q?keyword=${query}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
