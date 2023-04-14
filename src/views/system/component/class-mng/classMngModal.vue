<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label="班级名称" prop="name">
			<el-input v-model="state.ruleForm.name" placeholder="请输入班级名称" clearable></el-input>
		</el-form-item>
		<el-form-item label='学院' prop='collegeId'>
			<el-select class='w100' v-model='state.ruleForm.collegeId' placeholder='请选择学院' filterable @change='changeCollege($event)'>
				<el-option v-for='item in props.collegeList' :label='item.name' :value='item.id' :key='item.id'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='专业' prop='majorId'>
			<el-select class='w100' v-model='state.ruleForm.majorId' placeholder='请选择专业' filterable>
				<el-option v-for='item in state.majorList' :label='item.name' :value='item.id' :key='item.id'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='备注' prop='remark'>
			<el-input v-model='state.ruleForm.remark' placeholder='请输入备注' clearable></el-input>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>
import {reactive, ref} from 'vue';

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
		collegeId: '',
		majorId: '',
		remark: ''
	},
	rules: {
		name: [
			{ required: true, message: '班级名称不能为空!', trigger: 'blur' }
		],
		collegeId: [
			{ required: true, message: '学院不能为空!', trigger: 'change' }
		],
		majorId: [
			{ required: true, message: '专业不能为空!', trigger: 'change' }
		]
	},
	majorList: []
});
const changeCollege = collegeId => {
	props.collegeList.map((item: any) => {
		if (item.id === collegeId) {
			state.majorList = item.children;
		}
	})
}
defineExpose({
	formRef,
	state
});
</script>

<style scoped lang='less'>

</style>
