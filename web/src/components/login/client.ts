import axios from 'axios';
import Axios, { AxiosInstance, AxiosResponse, CancelToken } from 'axios';
import { instance } from '../clientConfig'

interface Account {
    id?: string;
    name?: string;
    authority?: string;
    phoneNum?: string;
    curriculum?: string;

    schedule?: Date[];

}

const fetchAccountList = (params = {}, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ accounts: Account[] }>> => {
    return instance.get(`/accounts`, {
        params,
        cancelToken
    });
};
const postAccount = (payload: Account, cancelToken: CancelToken = null) : 
Promise<AxiosResponse<Account>> => {
    return instance.post(`/accounts`, payload, {
        cancelToken
    });
};
const fetchAccount = (key: string, params = {}, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ account: Account }>> => {
    return instance.get(`/accounts/${key}`, {
        params,
        cancelToken
    });
}

export { Account, fetchAccountList, postAccount, fetchAccount }