<template>
	<div class='paper-container'>
		<div class='box h100'>
			<div class='tree-box h100'>
				<TypeTree
					:title='configTreeObj.title'
					:create-path='configTreeObj.createPath'
					:update-path='configTreeObj.updatePath'
					:get-list-path='configTreeObj.getListPath'
					:delete-path='configTreeObj.deletePath'
					@clickNode='clickNode($event)'
				/>
			</div>
			<div class='content-box h100'>
				试题库
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';
import {
	createPaperTypeApi,
	deletePaperTypeApi,
	getPaperTypeListApi,
	updatePaperTypeApi,
} from '/@/api/exam/paper-type';
import TypeTree from '/@/components/TypeTree/index.vue';

export default defineComponent({
	name: 'paper',
	components: {
		TypeTree
	},
	setup() {
		const state = reactive({
			configTreeObj: {
				title: '试题分类',
				createPath: createPaperTypeApi,
				updatePath: updatePaperTypeApi,
				getListPath: getPaperTypeListApi,
				deletePath: deletePaperTypeApi
			}
		});
		const clickNode = data => {
			console.log(data);
		}
		return {
			...toRefs(state),
			clickNode
		}
	}
});
</script>

<style scoped lang='scss'>
	.paper-container{
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
