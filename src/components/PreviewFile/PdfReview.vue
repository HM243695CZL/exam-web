<template>
	<div class='pdf-container'>
		<div :class='["preview", state.isFullScreen ? "full-screen" : ""]'
				 :style='state.pdfStyle'
		>
			<div :class='["pdf-page", state.isFullScreen ? "full-screen-pdf" : ""]'>
				<div class='page-tool'>
					<div class='page-item' @click='clickPrevPage'>上一页</div>
					<div class='page-item' @click='clickNextPage'>下一页</div>
					<div class='page-item'>{{state.pageIndex}} / {{state.totalRecords}}</div>
					<div class='page-item' @click='clickZoomOut'>放大</div>
					<div class='page-item' @click='clickZoomIn'>缩小</div>
					<div class='page-item' @click='clickScreen'>{{state.isFullScreen ? '取消全屏' : '全屏'}}</div>
				</div>
			</div>
			<VuePdfEmbed
				:source='props.filePath'
				:page='state.pageIndex'
				:style='scalePage'
			/>
		</div>
	</div>
</template>

<script lang='ts' setup>
	import { computed, onMounted, reactive } from 'vue';
	import VuePdfEmbed from 'vue-pdf-embed';
	import { createLoadingTask } from 'vue3-pdfjs'; // 获得总页数

	const props = defineProps({
		height: {
			type: String,
			default: '400px'
		},
		filePath: {
			type: String,
			required: true
		}
	});

	const state = reactive({
		pdfStyle: {
			height: props.height
		},
		isFullScreen: false,
		pageIndex: 1, // 当前页
		scale: 1, // 缩放比例
		totalRecords: 0 // 总页数
	});
	const scalePage = computed(() => `transform: scale(${state.scale})`);
	const clickPrevPage = () => {
		if (state.pageIndex > 1) {
			state.pageIndex -= 1;
		}
	};
	const clickNextPage = () => {
		if (state.pageIndex < state.totalRecords) {
			state.pageIndex += 1;
		}
	};
	const clickZoomOut = () => {
		if (state.scale < 2) {
			state.scale += .1;
		}
	};
	const clickZoomIn = () => {
		if (state.isFullScreen && state.scale <= 1) {
			state.scale = 1;
			return false;
		}
		if (state.scale > .8) {
			state.scale -= .1;
		}
	};
	const clickScreen = () => {
		state.isFullScreen = !state.isFullScreen;
		if (!state.isFullScreen) {
			state.pdfStyle = {
				height: props.height
			}
		} else {
			state.scale = 1;
			state.pdfStyle = {} as any;
		}
	};
	onMounted(() => {
		/**
		 * 注意：此处会请求两次文件，一次是给source赋值展示文件，一次是获取文件总页数
		 */
		const loadingTask = createLoadingTask(props.filePath);
		loadingTask.promise.then(pdf => {
			state.totalRecords = pdf.numPages;
		});
	})
</script>

<style scoped lang='scss'>
	.pdf-container{
		position: relative;
		.preview{
			overflow-y: scroll;
			box-shadow: #ccc 0 0 2px 2px;
			.pdf-page{
				position: absolute;
				user-select: none;
				width: 100%;
				display: flex;
				justify-content: center;
				top: 5px;
				left: 0;
				z-index: 99;
				.page-tool{
					display: flex;
					justify-content: flex-start;
					align-items: center;
					background: rgb(66, 66, 66);
					border-radius: 20px;
					.page-item{
						padding: 8px 15px;
						cursor: pointer;
						color: #fff;
						&:hover{
							color: #40a9ff;
						}
					}
				}
			}
			.full-screen-pdf{
				position: fixed;
			}
		}
		.full-screen{
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			z-index: 999;
			background: #fff;
		}
	}
</style>
