import axios, {AxiosRequestConfig} from 'axios';
import {endsWithAny} from '../';
import {store} from '../../store';
import createAuthRefreshInterceptor from './refreshAuth';
import { setAuthState } from 'CardicApp/src/store/auth';
import Config from "react-native-config";

const baseURL = Config.API_URL;

let axiosExtended = axios.create({
  baseURL,
});

const authNotRequiredURLs = [
  '/register',
  '/login',
];

axiosExtended.interceptors.request.use((config) => {
  if (!getExcludedURLs(config)) {
    const auth = store.getState().auth;
    console.log("Auth State", auth )
    const {
      token
    } = auth;
    if(!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  } else {
    return config;
  }
});

const getExcludedURLs = (config: AxiosRequestConfig) => {
  return config.url && endsWithAny(config.url, authNotRequiredURLs);
};

// axiosExtended.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       const newAccessToken = await refreshToken();
//       store.dispatch({
//         type: ACTION_TYPES.LOGIN_SUCCESS,
//         payload: newAccessToken.Data,
//       });
//       originalRequest.headers.Authorization = `Bearer ${newAccessToken.Data.AccessToken}`;
//       return axios(originalRequest);
//     } else if (error.response && error.response.status === 401) {
//       store.dispatch(signout({accessToken}));
//     } else {
//       return Promise.reject(error);
//     }
//   },
// );

const refreshToken = () => {
  return new Promise((resolve, reject) => {
    const {auth} = store.getState();
    const {
      token,
      // @ts-expect-error
      refreshToken,
    } = auth;
    var myHeaders = new Headers();
    myHeaders.append('Authorization', `bearer ${token}`);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      refreshToken,
      GrantType: 'REFRESH_TOKEN',
    });

    var requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${baseURL}/api/v1/Login`, requestOptions)
      .then((response) => response.json())
      .then((newAccessToken) => {
        setAuthState({
          ...auth,
          token: newAccessToken
        })
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

createAuthRefreshInterceptor(axiosExtended, refreshToken);

export default axiosExtended;
