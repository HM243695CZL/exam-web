/**
 * 富文本编辑器相关
 */

/**
 * 从html代码中匹配返回img的src值的集合
 * @param htmlData
 * @return Array
 */
export function findAllImgSrcsFromHtml(htmlData: string) {
	let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
	let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配图片中的src

	let arr = htmlData.match(imgReg); //筛选出所有的img
	if (!arr || (Array.isArray(arr) && !arr.length)) {
		return false;
	}

	let srcArr = [];
	for (let i = 0; i < arr.length; i++) {
		let src = arr[i].match(srcReg);
		// 获取图片地址
		if (src) {
			// @ts-ignore
			srcArr.push(src[1]);
		}
	}

	return srcArr;
}


/**
 * 从rtf内容中匹配返回图片数据的集合
 * @param rtfData
 * @return Array
 */
export function extractImageDataFromRtf(rtfData: string) {
	if (!rtfData) {
		return [];
	}
	const regexPictureHeader = /{\\pict[\s\S]+?({\\\*\\blipuid\s?[\da-fA-F]+)[\s}]*/
	const regexPicture = new RegExp('(?:(' + regexPictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g');
	const images = rtfData.match(regexPicture);
	const result = [] as any;

	if (images) {
		for (const image of images) {
			let imageType;
			if (image.includes('\\pngblip')) {
				imageType = 'image/png';
			} else if (image.includes('\\jpegblip')) {
				imageType = 'image/jpeg';
			}
			if (imageType) {
				result.push({
					hex: image.replace(regexPictureHeader, '').replace(/[^\da-fA-F]/g, ''),
					type: imageType
				});
			}
		}
	}
	return result;
}


/**
 * 将html内容中的img标签的属性值替换
 * @param htmlData html内容
 * @param imageSrcs html中img的src值的集合
 * @param imagesHexSources rtf中的图片数据的集合，与html内容中的img标签对应
 * @param isBase64Data 是否是Base的图片数据
 * @return String
 */
export function replaceImagesFileSourceWithInlineRepresentation(htmlData, imageSrcs, imagesHexSources, isBase64Data:boolean = true){
	if (imageSrcs.length === imagesHexSources.length) {
		for (let i = 0; i < imageSrcs.length; i++) {
			const newSrc = isBase64Data ?
				`data:${imagesHexSources[i].type};base64,${_convertHexToBase64(imagesHexSources[i].hex)}` :
				imagesHexSources[i];

			htmlData = htmlData.replace(imageSrcs[i], newSrc);
		}
	}
	return htmlData;
}


/**
 * 十六进制转base
 */
export function _convertHexToBase64(hexString) {
	return btoa(hexString.match(/\w{2}/g).map(char => {
		return String.fromCharCode(parseInt(char, 16));
	}).join(''));
}


/**
 * 将base转为blob
 */
export function base64ToBlob(baseStr) {
	let arr = baseStr.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}
