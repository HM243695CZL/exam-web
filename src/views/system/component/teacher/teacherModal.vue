<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label='姓名' prop='name'>
			<el-input v-model='state.ruleForm.name' placeholder='请输入姓名' clearable></el-input>
		</el-form-item>
		<el-form-item label='工号' prop='number'>
			<el-input v-model='state.ruleForm.number' placeholder='请输入工号' clearable></el-input>
		</el-form-item>
		<el-form-item label='部门' prop='deptId'>
			<el-tree-select
				class='w100'
				clearable
				default-expand-all
				v-model='state.ruleForm.deptId'
				:data='props.deptList'
				:props='{children: "children", label: "name", value: "id"}'
				check-strictly
			></el-tree-select>
		</el-form-item>
		<el-form-item label='头像' prop='avatar'>
			<SingleUpload :source-url="state.ruleForm.avatar" @change-source-url="changeAvatar" />
		</el-form-item>
		<el-form-item label='邮箱' prop='email'>
			<el-input v-model='state.ruleForm.email' placeholder='请输入邮箱' clearable></el-input>
		</el-form-item>
		<el-form-item label='电话' prop='phone'>
			<el-input v-model='state.ruleForm.phone' placeholder='请输入电话' clearable></el-input>
		</el-form-item>
		<el-form-item label='性别' prop='sex'>
			<el-radio-group v-model="state.ruleForm.sex">
				<el-radio :label="0" size="large">男</el-radio>
				<el-radio :label="1" size="large">女</el-radio>
			</el-radio-group>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import SingleUpload from '/@/components/Upload/SingleUpload.vue';

const props = defineProps({
	deptList: {
		type: Array,
		required: true,
	},
});
const formRef = ref();
const state = reactive({
	ruleForm: {
		name: '',
		number: '',
		deptId: '',
		avatar: '',
		sex: '',
		email: '',
		phone: '',
	},
	rules: {
		name: [
			{ required: true, message: '姓名不能为空', trigger: 'blur' },
		],
		number: [
			{ required: true, message: '工号不能为空', trigger: 'blur' },
		],
	},
});
const changeAvatar = (url: string) => {
	state.ruleForm.avatar = url;
};
defineExpose({
	formRef,
	state,
});
</script>

<style scoped lang='scss'>

</style>
