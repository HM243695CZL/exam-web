import request from '/@/utils/request';

export const reviewFileUrl = '';

export function postAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data
	})
}

export function getAction(url: string, data: any) {
	return request({
		url,
		method: 'get',
		data
	})
}

export function uploadAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

export function ArrayBufferAction(url: string) {
	return request({
		url,
		method: 'get',
		responseType: 'arraybuffer'
	})
}
