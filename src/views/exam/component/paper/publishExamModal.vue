<template>
	<div class='publish-exam-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :destroy-on-close='true'
							 :title='state.title'
							 v-model='state.isShowDialog' :width='800'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label="考试班级" prop="classId">
					<el-select multiple filterable class='w100' v-model='state.ruleForm.classId' placeholder='选择考试班级'>
						<el-option v-for='item in props.classList' :key='item.id' :value='item.id' :label='item.name'></el-option>
					</el-select>
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
import {reactive, ref} from 'vue';
import { getAction, postAction } from '/@/api/common';
import { getPublishClassApi, publishPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';
const props = defineProps({
	classList: {
		type: Array,
		required: true
	}
});
const formRef = ref();
const state = reactive({
	title: '选择考试班级',
	isShowDialog: false,
	ruleForm: {
		paperId: '',
		classId: []
	},
	rules: {
		classId: [
			{ required: true, message: '考试班级不能为空', trigger: 'change'}
		]
	}
});
const getPublishClass = () => {
	getAction(getPublishClassApi + '/' + state.ruleForm.paperId, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.ruleForm.classId = res.data;
		}
	})
}
const closeDialog = () => {
	state.isShowDialog = false;
};
const openDialog = id => {
	state.ruleForm.paperId = id;
	state.isShowDialog = true;
	getPublishClass();
};
const clickConfirm = () => {
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			postAction(publishPaperApi, state.ruleForm).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					closeDialog();
				}
			})
		}
	})
};
defineExpose({
	openDialog
});
</script>

<style scoped lang='scss'>

</style>
