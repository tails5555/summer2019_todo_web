import axios from 'axios';
import { BASE_URL } from './url_base';

export const TODO_LIST_API = axios.get(`${ BASE_URL }/api/todos/`);

export const TODO_CREATE_API = (form) => axios({
    method: 'post',
    data: {
        todo_form: {
            ...form, deadline: form.deadline === '' ? null: form.deadline
        }
    },
    url: `${ BASE_URL }/api/todos/`
});

export const TODO_UPDATE_API = (form) => axios({
    method: 'put',
    data: {
        todo_form: {
            ...form, deadline: form.deadline === '' ? null: form.deadline
        }
    },
    url: `${ BASE_URL }/api/todos/${form.id}/`
});

export const TODO_CHECK_API = (pk) => axios.put(`${ BASE_URL }/api/checker/${pk}/`);

export const TODO_DELETE_API = (pk) => axios.delete(`${ BASE_URL }/api/todos/${pk}/`);