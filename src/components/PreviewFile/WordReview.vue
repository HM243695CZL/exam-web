<template>
	<div class='word-container'>
		<div class='preview'
				 ref='previewWordRef'
				 :style='{height: props.height}'
		></div>
	</div>
</template>

<script lang='ts' setup>
	import { renderAsync } from 'docx-preview';
	import { onMounted, ref } from 'vue';
	import { ArrayBufferAction } from '/@/api/common';

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
	const previewWordRef = ref();
	onMounted(() =>{
		ArrayBufferAction(props.filePath).then(res => {
			renderAsync(res, previewWordRef.value);
		})
	})
</script>

<style scoped lang='scss'>
	.word-container{
		.preview{
			overflow-y: scroll;
			box-shadow: #ccc 0 0 2px 2px;
		}
	}
</style>
