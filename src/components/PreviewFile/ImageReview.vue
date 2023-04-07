<template>
	<div class='image-container' :style='{height: props.height}'>
		<img :src='props.filePath' alt=''>
	</div>
</template>

<script lang='ts' setup>

	const props = defineProps({
		filePath: {
			type: String,
			required: true
		},
		height: {
			type: String,
			default: '400px'
		}
	});
</script>

<style scoped lang='scss'>
	.image-container{
		overflow-y: scroll;
	}
</style>
