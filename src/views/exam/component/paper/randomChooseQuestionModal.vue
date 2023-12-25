<template>
	<div class='random-choose-question-modal'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :destroy-on-close='true'
							 :title='state.title'
							 v-model='state.isShowDialog' :width='800'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label="试题类型" prop="type">
					<el-select class='w100' v-model='state.ruleForm.type' clearable disabled>
						<el-option v-for='item in state.typeList' :key='item.value' :label='item.text' :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="试题分类" prop="questionType">
					<el-select class='w100' v-model='state.ruleForm.questionType' clearable>
						<el-option v-for='item in props.questionTypeList' :key='item.id' :label='item.name' :value='item.id'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label='抽题数' prop='randomCount'>
					<el-input-number v-model='state.ruleForm.randomCount' placeholder='请输入需要抽题的数量' :min='1'></el-input-number>
				</el-form-item>
			</el-form>
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
import { postAction } from '/@/api/common';
import { randomChoseQuestionApi } from '/@/api/exam/question';
import { StatusEnum } from '/@/common/status.enum';

const emits = defineEmits([
	'clickConfirmChoose'
]);
const props = defineProps({
	questionTypeList: {
		type: Array,
		required: true
	},
});
const formRef = ref();
const state = reactive({
	isShowDialog: false,
	title: '随机抽题',
	ruleForm: {
		type: '',
		questionType: '',
		randomCount: 1
	},
	rules: {
		questionType: [
			{ required: true, message: '请选择试题分类', trigger: 'blur' }
		],
	},
	typeList: [
		{ text: '单选题', value: 1 },
		{ text: '多选题', value: 2 },
		{ text: '判断题', value: 3 },
		{ text: '简答题', value: 4 },
	],
	selectedQuestionType: []
});
const openDialog = data => {
	state.isShowDialog = true;
	state.ruleForm.type = data.type;
	state.ruleForm.questionType = '';
	state.ruleForm.randomCount = 1;
	state.selectedQuestionType = data.selectedQuestionType;
};
const clickConfirm = () => {
	formRef.value.validate((valid: boolean) =>{
		if (valid) {
			postAction(randomChoseQuestionApi, {
				type: state.ruleForm.type,
				questionType: state.ruleForm.questionType,
				randomCount: state.ruleForm.randomCount
			}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					emits('clickConfirmChoose', res.data);
					state.isShowDialog = false;
				}
			})
		}
	})
};
const closeDialog = () => {
	state.isShowDialog = false;
};
defineExpose({
	openDialog
})
</script>

<style scoped>

</style>
