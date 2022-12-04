import axios from "axios";
import { getEnvVariables } from "../helpers";


const { VITE_API_URL_LH_TP } = getEnvVariables();

const todopoderosoApi = axios.create({
    baseURL: VITE_API_URL_LH_TP,
});

// Interceptores:
todopoderosoApi.interceptors.request.use( config => {

    config.headers = {
        ...config.headers,
        'Authorization': localStorage.getItem('token'),
    };

    return config;
})

export default todopoderosoApi;
