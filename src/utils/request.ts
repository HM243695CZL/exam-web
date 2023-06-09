import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox, ElLoading} from 'element-plus';
import { Session } from '/@/utils/storage';
import axiosRetry from 'axios-retry';

let loadingReqCount = 0;
let loadingInstance: any;
const showLoading = () => {
	if (loadingReqCount === 0) {
		loadingInstance = ElLoading.service({
			target: '#app'
		})
	}
	loadingReqCount += 1;
}

const hideLoading = () => {
	if (loadingReqCount <= 0) return;
	loadingReqCount -= 1;
	if (loadingReqCount === 0) {
		loadingInstance.close();
	}
}

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		showLoading();
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers!['Authorization'] = `Bearer ${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 请求失败重试次数
axiosRetry(service, {
	retries: 3, // 重试次数
	retryCondition: err => { // 触发条件
		return err.message.indexOf('404') > -1 || err.message.indexOf('Network') > -1;
	},
	shouldResetTimeout: true,
	retryDelay: () => {
		return 0.5 * 1000;
	}
});

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		hideLoading();
		// 对响应数据做点什么
		const res = response.data;
		if (res.status && res.status !== 200) {
			// `token` 过期或者账号已在别处登录
			if (res.status === 401 || res.status === 4001) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {})
					.catch(() => {});
			} else {
				ElMessage.error(res.message);
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		hideLoading();
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error('【' + error.response.data.path + '】' + error.response.data.error);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
