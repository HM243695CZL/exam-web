<template>
	<div class='update-pass-modal-container'>
		<el-dialog :append-to-body='false'
							 :close-on-click-modal='false'
							 :title='state.title'
							 v-model='state.isShowDialog' width='600px'>
			<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
				<el-form-item label='新密码' prop='password'>
					<el-input v-model='state.ruleForm.password' placeholder='请输入新密码' clearable></el-input>
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
import { nextTick, reactive, ref } from 'vue';
import { postAction } from '/@/api/common';
import { updatePassUserApi } from '/@/api/system/user';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';

	const state = reactive({
		isShowDialog: false,
		title: '修改密码',
		ruleForm: {
			id: '',
			password: ''
		},
		rules: {
			password: [
				{ required: true, message: '新密码不能为空!', trigger: 'blur' }
			]
		}
	});
	const formRef = ref();
	const closeDialog = () => {
		state.isShowDialog = false;
	};
	const openDialog = (id: string) => {
		state.isShowDialog = true;
		nextTick(() => {
			state.ruleForm.id = id;
			formRef.value.resetFields();
		});
	};
	const clickConfirm = () => {
		formRef.value.validate((valid: boolean) => {
			if (valid) {
				postAction(updatePassUserApi, state.ruleForm).then(res => {
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

<style scoped>

</style>
