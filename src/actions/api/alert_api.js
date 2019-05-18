import axios from 'axios';
import { BASE_URL } from './url_base';

export const ALERT_VIEW_API = axios.get(`${ BASE_URL }/api/alerts/`);