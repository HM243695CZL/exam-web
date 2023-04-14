<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label='姓名' prop='name'>
			<el-input v-model='state.ruleForm.name' placeholder='请输入姓名' clearable></el-input>
		</el-form-item>
		<el-form-item label='学号' prop='number'>
			<el-input v-model='state.ruleForm.number' placeholder='请输入学号' clearable></el-input>
		</el-form-item>
		<el-form-item label='学院' prop='college'>
			<el-select v-model='state.ruleForm.college' class='w100' @change='changeCollege' filterable>
				<el-option v-for='item in props.collegeList' :key='item.id' :label='item.name' :value='item.id'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='专业' prop='major'>
			<el-select v-model='state.ruleForm.major' class='w100' filterable>
				<el-option v-for='item in state.majorList' :key='item.id' :label='item.name' :value='item.id'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='班级名称' prop='className'>
			<el-input v-model='state.ruleForm.className' placeholder='请输入班级名称' clearable></el-input>
		</el-form-item>
		<el-form-item label='头像' prop='avatar'>
			<SingleUpload :source-url="state.ruleForm.avatar" @change-source-url="changeAvatar" />
		</el-form-item>
		<el-form-item label='生日' prop='birthday'>
			<el-date-picker
				v-model="state.ruleForm.birthday"
				type="date"
				class='w100'
				placeholder="请选择生日"
			/>
		</el-form-item>
		<el-form-item label='手机号' prop='phone'>
			<el-input v-model='state.ruleForm.phone' placeholder='请输入手机号' clearable></el-input>
		</el-form-item>
		<el-form-item label='性别' prop='sex'>
			<el-radio-group v-model="state.ruleForm.sex">
				<el-radio :label="0" size="large">男</el-radio>
				<el-radio :label="1" size="large">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label='状态' prop='status'>
			<el-radio-group v-model="state.ruleForm.sex">
				<el-radio :label="0" size="large">禁用</el-radio>
				<el-radio :label="1" size="large">启用</el-radio>
			</el-radio-group>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
import SingleUpload from '/@/components/Upload/SingleUpload.vue';

const props = defineProps({
	collegeList: {
		type: Array,
		required: true
	}
});

const formRef = ref();
const state = reactive({
	ruleForm: {
		name: '',
		number: '',
		college: '',
		major: '',
		className: '',
		avatar: '',
		birthday: '',
		phone: '',
		sex: null,
		status: null
	},
	rules: {
		name: [
			{ required: true, message: '姓名不能为空', trigger: 'blur'}
		],
		number: [
			{ required: true, message: '学号不能为空', trigger: 'blur'}
		]
	},
	majorList: []
});
const changeCollege = data => {
	props.collegeList.map((item: any) => {
		if (item.id === data) {
			state.majorList = item.children;
		}
	})
};
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
