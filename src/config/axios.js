import axios from "axios";

const { REACT_APP_API_URL_DEV } = process.env;

let AXIOS_INSTANCE = null;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    AXIOS_INSTANCE = axios.create({
        baseURL: REACT_APP_API_URL_DEV
    });
} else {
    AXIOS_INSTANCE = axios.create({});
}
export default AXIOS_INSTANCE;