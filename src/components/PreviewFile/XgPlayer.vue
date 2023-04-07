<template>
	<div class='xg-player-container'>
		<div v-show='state.isPlay' class='video' :id='state.elId'></div>
	</div>
</template>

<script lang='ts' setup>
	import FlvJsPlayer from 'xgplayer-flv.js';
	import _ from 'lodash';
	import { onMounted, onUnmounted, reactive } from 'vue';
	const state = reactive({
		isPlay: false,
		player: null as any,
		elId: '',
	});
	const createPlayer = (url: any) => {
		if (!url) return;
		if (state.player) {
			changeVideo(url);
			return;
		}
		state.isPlay = true;
		state.player = new FlvJsPlayer({
			id: state.elId,
			url,
			// fitVideoSize: 'auto',
			fluid: true,
			autoplay: true,
			isLive: true,
			playsinline: false,
			screenShot: true,
			whitelist: [''],
			ignores: ['time'],
			closeVideoClick: true,
			errorTips: `<span>视频源出错</span>`,
			closeInactive: true,
			customConfig: {
				isClickPlayBack: false
			},
			flvOptionalConfig: {
				enableWorker: true,
				enableStashBuffer: true, //启用缓存
				stashInitialSize: 4096, //缓存大小4m
				lazyLoad: false,
				lazyLoadMaxDuration: 40 * 60,
				autoCleanupSourceBuffer: true,
				autoCleanupMaxBackwardDuration: 35 * 60,
				autoCleanupMinBackwardDuration: 30 * 60
			}
		});
	};
	const changeVideo = (url: string) => {
		state.player.src = url;
	};
	const closePlayer = () => {
		state.isPlay = false;
		if (state.player) {
			state.player.destroy();
		}
	};
	// 调用播放器截图方法
	const screenShot = () => {
		state.player.screenShot();
	};
	onUnmounted(() => {
		if (state.player) {
			state.player.destroy();
		}
	})
	onMounted(() => {
		state.elId = _.uniqueId();
	});
	defineExpose({
		createPlayer,
		screenShot,
	})
</script>

<style scoped lang='scss'>
	.xg-player-container{
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.video{
			position: relative !important;
			height: 100% !important;
			width: 100% !important;
			padding-top: 0 !important;
		}
	}
</style>
