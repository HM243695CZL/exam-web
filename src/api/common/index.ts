import request from '/@/utils/request';
import Other from '/@/utils/other';

export const reviewFileUrl = '';

export function postAction(url: string, data: any) {
	return request({
		url,
		method: 'post',
		data
	})
}

export function getAction(urlStr: string, data) {
	const url = data ? urlStr + '?' + Other.getParams(data) : urlStr;
	return request({
		url,
		method: 'get',
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
