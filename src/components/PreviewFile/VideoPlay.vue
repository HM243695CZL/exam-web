<template>
	<div class='video-play-container'>
		<div class='video-dom' id='video-dom'></div>
	</div>
</template>

<script lang='ts' setup>
import Player from 'xgplayer';
import { reactive } from 'vue';

const state = reactive({
	player: null as any
});
const init = () => {
	state.player = new Player({
		id: 'video-dom',
		url: 'http://192.168.1.15:8888/src/assets/filename.mp4',
		autoplay: true,
		lastPlayTime: 20
	})
}
defineExpose({
	init
})
</script>

<style scoped lang='scss'>

</style>
