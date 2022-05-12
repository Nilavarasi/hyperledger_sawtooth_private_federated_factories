import axios from 'axios';
import { API_URL } from '../config';


axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export const  queryAPI = (url, data, method) => {
    const req_data = {
        url: API_URL+url,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    }

    if(method === "POST" || method === "PUT") {
        req_data['method'] = method
        req_data['data'] = JSON.stringify(data)
        req_data['headers'] = {'Content-Type': 'application/json'}
    }

    return axios.request(req_data)
        .then(res => res.data)
        .catch(err => err)
}
