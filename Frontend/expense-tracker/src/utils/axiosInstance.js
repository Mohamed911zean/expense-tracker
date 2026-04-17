import axios from 'axios'
import { BASE_URL } from './pathApi'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
        Accept: "application/json"
    }
})

//request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
    
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
},
    (error) => {
        return Promise.reject(error)
    }
)

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle common errors globaly
        if (error.response) {
            if (error.response.status === 401 ) {
                //Redirect to Login page
                window.location.href = "/login"
            } else if (error.response.status === 500) {
                console.log("Server error, please try again")
            }
        } else if (error.code === "ECONNABOARTED") {
            console.log("Request timeout. please try again")
        }
        return Promise.reject(error)
    }
)

export default axiosInstance