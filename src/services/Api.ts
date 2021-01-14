import axios from 'axios';
import secrets from '../util/Secrets'

const api = axios.create({
  baseURL: secrets.TaskApiUrl
});

export default api;