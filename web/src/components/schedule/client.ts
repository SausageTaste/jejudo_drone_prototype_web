import axios from 'axios';
import Axios, { AxiosInstance, AxiosResponse, CancelToken } from 'axios';
import { instance } from '../clientConfig'

interface schedule {
    id?: string;
    date?: string;
    part?: string;
}
interface student {
    key?: string;
    name?: string;
}

const postStudentToList = (date: string, part: string, payload: student, cancelToken = null) :
Promise<AxiosResponse<schedule>> => {
    return instance.post(`/schedule/${date}/${part}`, payload, {
        cancelToken
    });
};
const postScheduletoAccount = (key: string, payload: schedule, params = {}, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ result: string }>> => {
    return instance.post(`/accounts/${key}/schedule`, payload, {
        params,
        cancelToken
    });
}

const fetchScheduleList = (params = {}, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ schedule: schedule[] }>> => {
    return instance.get(`/schedule`, {
        params,
        cancelToken
    });
};
const fetchStudentsList = (date: string, part: string, params = {}, cancelToken = null) :
Promise<AxiosResponse<{ list: student[] }>> => {
    return instance.get(`/schedule/${date}/${part}`, {
        params,
        cancelToken
    });
};

const fetchSchedulefromAccount = (key: string, params = {}, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ schedule: schedule[] }>> => {
    return instance.get(`/accounts/${key}/schedule`, {
        params,
        cancelToken
    });
}
const cancelScheduleOfAccount = (key: string, id: string, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ result: string }>> => {
    return instance.delete(`/accounts/${key}/schedule/${id}`, {
        cancelToken
    });
}
const deleteStudentOfSchedule = (date: string, part: string, key: string, cancelToken: CancelToken = null) :
Promise<AxiosResponse<{ result: string }>> => {
    return instance.delete(`schedule/${date}/${part}/${key}`, {
        cancelToken
    });
}


export { schedule, student,
    postScheduletoAccount, postStudentToList,
    fetchScheduleList, fetchStudentsList, fetchSchedulefromAccount,
    cancelScheduleOfAccount, deleteStudentOfSchedule }