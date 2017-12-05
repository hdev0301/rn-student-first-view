import apisauce from 'apisauce';
import env from '../core/env';

const create = (baseURL = env.baseOneSignalApiUrl) => {
  const api = apisauce.create({
    baseURL,
    timeout: 10000
  });

  const viewDevice = (pushId) => api.get(`/players/${pushId}?app_id=${env.oneSignalAppId}`);

  return {
    viewDevice
  }
}

export default {
  create
}
