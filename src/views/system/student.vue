<template>
	<div class='student-container h100'>
		<div class='box h100'>
			<div class='tree-box h100'>
				<CollegeTree @clickNode='clickNode' />
			</div>
			<div class='content-box h100'>
				list
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import CollegeTree from './component/student/collegeTree.vue';

export default defineComponent({
	name: 'student',
	components: {
		CollegeTree
	},
	setup() {
		const clickNode = data => {
			console.log(data);
		}
		return {
			clickNode
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
			}
		}
	}
</style>
