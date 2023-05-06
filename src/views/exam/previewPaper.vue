<template>
	<div class='preview-paper-container'>
		预览试卷
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { getAction } from '/@/api/common';
import { viewPaperApi } from '/@/api/exam/paper';

export default defineComponent({
	name: 'previewPaper',
	setup() {
		const state = reactive({
			id: ''
		});
		const getPaperInfo = () => {
			getAction(viewPaperApi + '/' + state.id, '').then(res => {
				console.log(res);
			})
		}
		onMounted(() => {
			state.id = window.location.href.split('=')[1];
			getPaperInfo();
		})
		return {
			...toRefs(state)
		}
	}
});
</script>

<style scoped>

</style>
