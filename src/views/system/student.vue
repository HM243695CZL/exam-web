<template>
	<div class='student-container h100'>
		学生管理
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';

export default defineComponent({
	name: 'student',
	components: {},
	setup() {
		const collegeTreeRef = ref();
		const state = reactive({
		});
		return {
			collegeTreeRef,
			...toRefs(state),
		}
	}
});
</script>

<style scoped lang='scss'>
	.student-container{
		padding: 20px;
		overflow: auto;
		.box{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.tree-box{
				width: 320px;
			}
			.content-box{
				flex: 1;
				padding: 15px;
			}
		}
	}
</style>
