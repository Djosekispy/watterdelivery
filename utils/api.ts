import axios from 'axios';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const api = axios.create({
    baseURL: apiUrl,
});


export { api};
