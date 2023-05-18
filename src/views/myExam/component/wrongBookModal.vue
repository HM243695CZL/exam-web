<template>
	<el-dialog :append-to-body='false'
						 :close-on-click-modal='false'
						 :title='state.title'
						 v-model='state.isShowDialog' width='800'>
		<div class='question-list-row'>
			<div class='question-name'>
				<div class='question-name-text' v-html='"题目：" + state.questionMap.question'></div>
			</div>
			<div class='question-item-list'>
				<div :class='["question-item", state.questionMap.answer === e.id ? "active" : ""]' v-for='(e, i) in state.questionMap.questionItemList' :key='e.id'>
					<span class='option-item'>{{state.itemIndex[i]}}.</span><span v-html='e.name'></span>
				</div>
			</div>
			<div class='analysis'>
				解析：
				<div class='analysis-html' v-html='state.questionMap.analysis'></div>
			</div>
		</div>
		<template #footer>
			<div class='dialog-footer'>
				<el-button @click='closeDialog'>关闭</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
import { getAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { viewQuestionApi } from '/@/api/exam/question';

const state = reactive({
	isShowDialog: false,
	title: '查看错题',
	questionMap: {},
	itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
});
const closeDialog = () => {
	state.isShowDialog = false;
};
const openDialog = id => {
	state.isShowDialog = true;
	getAction(viewQuestionApi + '/' + id, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.questionMap = res.data;
		}
	})
};
defineExpose({
	openDialog
})
</script>

<style scoped lang='scss'>
.question-list-row{
	.question-name{
		display: flex;
		justify-content: space-between;
		color: #126ac6;
		padding: 10px 0;
		.question-name-text{
			flex: 1;
			padding-right: 20px;
			line-height: 25px;
			::v-deep p{
				display: inline-block;
				color: #000;
			}
		}
	}
	.question-item-list{
		margin-left: 40px;
		.question-item{
			padding: 10px 0;
			display: flex;
			align-items: flex-start;
			&.active{
				color: #dd4a68;
			}
			.option-item{
				margin-right: 3px;
			}
			::v-deep {
				img{
					width: 100px;
					height: 100px;
				}
				p{
					display: inline-block;
				}
			}
		}
	}
	.analysis{
		padding: 10px 0;
		margin-left: 20px;
		color: #f40;
		line-height: 25px;
		.analysis-html{
			margin-left: 10px;
			margin-top: 10px;
			:deep(img) {
				display: block;
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>
