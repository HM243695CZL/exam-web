<template>
	<div class='choose-question-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :destroy-on-close='true'
							 :title='state.title'
							 v-model='state.isShowDialog' :width='1200'>
			<Question ref='questionRef' :type='state.type' is-choose-question />
			<template #footer>
			<div class='dialog-footer'>
				<el-button @click='closeDialog'>取 消</el-button>
				<el-button type='primary' @click='clickConfirm'>确 定</el-button>
			</div>
</template>
		</el-dialog>
	</div>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { PageEntity } from '/@/common/page.entity';
import Question from '../question.vue';

const emits = defineEmits([
	'clickConfirmChoose'
]);
const questionRef = ref();
const state = reactive({
	title: '选择试题',
	isShowDialog: false,
	pageInfo: new PageEntity(),
	type: null,
	questionList: []
});

const closeDialog = () => {
	state.isShowDialog = false;
};
const openDialog = data => {
	state.type = data.type;
	state.isShowDialog = true;
};
const clickConfirm = () => {
	state.questionList = questionRef.value.selectionRows;
	emits('clickConfirmChoose', state.questionList);
	state.isShowDialog = false;

};
defineExpose({
	openDialog
});
</script>

<style scoped lang='scss'>

</style>
