<template>
	<el-dialog :append-to-body='false'
						 :close-on-click-modal='false'
						 :title='state.title'
						 v-model='state.isShowDialog' width='600px'>
		<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
			<el-form-item label='父节点'>
				{{state.ruleForm.parentName}}
			</el-form-item>
			<el-form-item label='名称' prop='name'>
				<el-input v-model='state.ruleForm.name' placeholder='请输入名称' clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class='dialog-footer'>
				<el-button @click='closeDialog'>取 消</el-button>
				<el-button type='primary' @click='clickConfirm'>确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { postAction } from '/@/api/common';
import { createCollegeMajorApi, updateCollegeMajorApi } from '/@/api/system/class-mng';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['refreshList']);
const formRef = ref();
const state = reactive({
	title: '',
	isShowDialog: false,
	ruleForm: {
		id: '',
		name: '',
		parentId: null,
		parentName: '',
		type: 0,
	},
	rules: {
		name: [
			{ required: true, message: '名称不能为空', trigger: 'blur'}
		]
	}
});
const openDialog = (row: any) => {
	state.isShowDialog = true;
	state.ruleForm = row;
	state.ruleForm.type = row.parendId ? 0 : 1;
	if (row.id) {
		// 编辑
		state.title = '编辑学院/专业';
	} else {
		state.title = '新增学院/专业';
	}
};
const closeDialog = () => {
	state.isShowDialog = false;
};
const clickConfirm = () => {
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			postAction(state.ruleForm.id ? updateCollegeMajorApi : createCollegeMajorApi, state.ruleForm).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					emits('refreshList');
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
