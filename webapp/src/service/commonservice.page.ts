import axios from 'axios';
import { CommonHelper } from '../helper/helper';

const APIURL = 'http://localhost:8000/api';
export abstract class CommonService {
    private static setHeaders() {
        // debugger
        const userData = CommonHelper.GetUserData();
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData?.api_token ?? ''}`;
        axios.defaults.headers.common['Ip'] = userData?.Ip ?? '';
    }

    private static handleResponse(resolve: Function, reject: Function, error: any) {
        // debugger
        console.error(error); // Log error for debugging
        reject({}); // Reject with an empty object (can be customized)
    }

    public static GetAll(UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .get(`${APIURL}${UrlName}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static GetById(id: any, UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .get(`${APIURL}${UrlName}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPost(model: any, UrlName: string): Promise<any> {
        // debugger
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .post(`${APIURL}${UrlName}`, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static Delete(id: string, UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .delete(`${APIURL}${UrlName}/${id}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static PostWithParameter(model: any, UrlName: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            let url = `${APIURL}${UrlName}`;
            params.forEach((e: any) => {
                url = `${url}/${e.params}`;
            });
            axios
                .post(url, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static GetWithParameter(UrlName: string, params: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            let url = `${APIURL}${UrlName}`;
            params.forEach((e: any) => {
                url = `${url}/${e.params}`;
            });
            axios
                .get(url)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static FullUrlGet(UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .get(UrlName)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPatch(model: any, UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .patch(`${APIURL}${UrlName}`, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonPut(model: any, UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .put(`${APIURL}${UrlName}`, model)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static CommonDelete(UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .delete(`${APIURL}${UrlName}`)
                .then((response) => resolve(response.data))
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static ExcelDownloadGet(UrlName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.setHeaders();
            axios
                .get(`${APIURL}${UrlName}`, { responseType: 'blob' })
                .then((response) => {
                    console.log('Full Response:', response); // Debugging
                    resolve(response); // Pass full response
                })
                .catch((error) => this.handleResponse(resolve, reject, error));
        });
    }

    public static async DownloadPost(model: any, UrlName: string): Promise<any> {
        try {
            const response = await axios.post(`${APIURL}/${UrlName}`, model, {
                responseType: 'blob',
            });
            return response;
        } catch (error) {
            console.error('DownloadPost Error:', error);
            throw error;
        }
    }

    // public static async DownloadGet(id: any, UrlName: string): Promise<any> { // *need to add blob 
    //     try {
    //         const response = await axios.get(`${APIURL}${UrlName}/${id}`, {
    //             responseType: 'blob',
    //         });
    //         return response.data; // Return only the Blob data
    //     } catch (error) {
    //         console.error('DownloadGet Error:', error);
    //         throw error;
    //     }
    // }
}
