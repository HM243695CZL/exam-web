<template>
	<div class="drawing-container">
		<div id="tui-image-editor"></div>
		<el-button class="save" type="primary" size="small" @click="saveImg">保存</el-button>
	</div>
</template>
<script lang='ts' setup>
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import ImageEditor from "tui-image-editor";
import { locale_zh, customTheme } from './imageConfig';
import { onMounted, reactive } from 'vue';
const state = reactive({
	instance: null as any
});
const init = () => {
	state.instance = new ImageEditor(document.getElementById('tui-image-editor'), {
		includeUI: {
			loadImage: {
				path: "https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c1d7a1feb60346449c1a64893888989a~tplv-k3u1fbpfcp-watermark.image",
				name: "image",
			},
			initMenu: "", // 默认打开的菜单项
			menuBarPosition: "bottom", // 菜单所在的位置
			locale: locale_zh, // 本地化语言为中文
			theme: customTheme, // 自定义样式
		},
		cssMaxWidth: 1000, // canvas 最大宽度
		cssMaxHeight: 400, // canvas 最大高度
	});
}
const saveImg = () => {
	const base64String = state.instance.toDataURL(); // base64 文件
	const data = window.atob(base64String.split(",")[1]);
	const ia = new Uint8Array(data.length);
	for (let i = 0; i < data.length; i++) {
		ia[i] = data.charCodeAt(i);
	}
	const blob = new Blob([ia], { type: "image/png" }); // blob 文件
	const a = document.createElement("a")
	a.href = URL.createObjectURL(blob);
	a.download = 'test';
	a.click();
	URL.revokeObjectURL(a.href);
	a.remove();
	const form = new FormData();

	form.append("image", blob);
	console.log(form);
	// 上传操作
}
onMounted(() => {
	init();
})
</script>

<style lang="scss" scoped>
.drawing-container {
	height: 600px;
	position: relative;
	.save {
		position: absolute;
		right: 50px;
		top: 15px;
	}
}
</style>
