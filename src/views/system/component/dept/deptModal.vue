<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label='上级部门' prop='parentId'>
			<el-tree-select
				class='w100'
				clearable
				default-expand-all
				v-model='state.ruleForm.parentId'
				:data='props.deptList'
				:props='{children: "children", label: "name", value: "id"}'
				check-strictly
			></el-tree-select>
		</el-form-item>
		<el-form-item label='部门名称' prop='name'>
			<el-input v-model='state.ruleForm.name' placeholder='部门名称' clearable></el-input>
		</el-form-item>
		<el-form-item label='备注' prop='remark'>
			<el-input v-model='state.ruleForm.remark' placeholder='备注' clearable></el-input>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';

const props = defineProps({
	deptList: {
		type: Array,
		required: true,
	},
});
const formRef = ref();
const state = reactive({
	ruleForm: {
		parentId: '',
		name: '',
		remark: '',
	},
	rules: {
		name: [
			{ required: true, message: '部门名称不能为空', trigger: 'blur' },
		],
	},
});
defineExpose({
	formRef,
	state,
});
</script>

<style scoped lang='scss'>

</style>
