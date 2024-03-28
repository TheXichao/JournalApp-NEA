import axios, { AxiosInstance } from 'axios';
import getAuthTokenFromCookie from './getAuthTokenFromCookie';


export const myApiCall: AxiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/", 
    timeout: 5000, // time before the request times out in milliseconds
    headers: {
        "Content-Type": "application/json", // I use json as the default content type 
        
    },
});

// Add a request interceptor to add the token to the request header
myApiCall.interceptors.request.use(config => {
    const { token } = getAuthTokenFromCookie();
    if (token) {
        config.headers
    }
    return config;
}
);


