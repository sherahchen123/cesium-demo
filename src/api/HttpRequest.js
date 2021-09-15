import axios from "axios";
import ViewUI from "view-design";
// import toQueryUrl from "@/utils/base";
// axios.defaults.withCredentials = true;

/**
 * @class HttpRequest
 * @param {Object} options { BASEURL, TIMEOUT }
 * @description 基于axios二次封装类，提供给不同地址实例使用
 * 目前有三个实例（基础，dataeye，mock），共用一种拦截器
 */
export default class HttpRequest {
  constructor({ BASEURL, TIMEOUT = 60000 * 3, ERRORHOOK = function() {} }) {
    this.config = {
      baseURL: BASEURL,
      timeout: TIMEOUT === "" ? 0 : TIMEOUT, // 0 则为不限制时长
      withCredentials: true
    };
    this.instance = axios.create(this.config);
    // 新增一个错误回调钩子函数
    this.errorHook = ERRORHOOK;
    // 安装拦截器
    this.interceptors();
    return this.instance;
  }
  // 拦截器
  interceptors(instance = this.instance) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        config.crossDomain = true;
        return config;
      },
      error => {
        // 请求失败
        this.errorHook(error);
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      response => {
        const { status, config, headers } = response;
        let { showErrorMessage } = config;
        // showErrorMessage 不传，默认展示错误信息
        if (showErrorMessage === undefined) {
          showErrorMessage = true;
        }
        if (status === 200) {
          const { data } = response;
          const { code, status, message, error } = data; // error 兼容soe
          if (!code && !error) {
            // 兼容普通的arcgis rest请求,只有status状态,不存在code和error返回码
            return Promise.resolve(response);
          }
          // 后端约定
          if (code !== 1000) {
            showErrorMessage && ViewUI.Message.error(`${status} ${message}`);
            this.errorHook(data);
            return Promise.reject(message);
          }
          if (error) {
            showErrorMessage &&
              ViewUI.Message.error(`${error.code} ${error.message}`);
            this.errorHook(data);
            return Promise.reject(error.message);
          }
          let xAuthToken = headers["x-auth-token"];
          if (xAuthToken) {
            data.xAuthToken = xAuthToken;
          }
          return Promise.resolve(data);
        } else {
          this.errorHook(response);
          return showErrorMessage && ViewUI.Message.error(status);
        }
      },
      error => {
        // axios 捕获服务器异常
        this.errorHook(error.response);
        ViewUI.Message.error(error.message);
        return Promise.reject(error.response);
      }
    );
  }

  getInstance() {
    return this.instance;
  }

  static get(...args) {
    return axios.get(...args);
  }
}
