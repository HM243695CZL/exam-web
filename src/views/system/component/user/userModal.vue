<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label="用户名称" prop="username">
			<el-input v-model="state.ruleForm.username" placeholder="请输入用户名称"></el-input>
		</el-form-item>
		<el-form-item label='用户类型' prop='userType'>
			<el-radio-group v-model="state.ruleForm.userType" class="ml-4">
				<el-radio-button :label="1" size="large">老师</el-radio-button>
				<el-radio-button :label="2" size="large">学生</el-radio-button>
			</el-radio-group>
		</el-form-item>
		<el-form-item :label='state.ruleForm.userType === 1 ? "工号" : "学号"' prop='number'>
			<el-input v-model='state.ruleForm.number' placeholder='请输入'></el-input>
		</el-form-item>
		<div class='teacher-box' v-if='state.ruleForm.userType === 1'>
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
		</div>
		<div class='student-box' v-if='state.ruleForm.userType === 2'>
			<el-form-item label='学院' prop='collegeId'>
				<el-select v-model='state.ruleForm.collegeId' class='w100' @change='changeCollege' filterable>
					<el-option v-for='item in props.collegeList' :key='item.id' :label='item.name' :value='item.id'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='专业' prop='majorId'>
				<el-select v-model='state.ruleForm.majorId' class='w100' filterable @change='changeMajor'>
					<el-option v-for='item in state.majorList' :key='item.id' :label='item.name' :value='item.id'></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='班级名称' prop='classId'>
				<el-select v-model='state.ruleForm.classId' class='w100' filterable>
					<el-option v-for='item in state.classList' :key='item.id' :label='item.name' :value='item.id'></el-option>
				</el-select>
			</el-form-item>
		</div>
		<el-form-item label="关联角色" prop="roleIds">
			<el-select v-model="state.ruleForm.roleIds" clearable multiple class="w100">
				<el-option v-for="item in props.roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='性别' prop='sex'>
			<el-radio-group v-model="state.ruleForm.sex">
				<el-radio-button :label="0" size="large">男</el-radio-button>
				<el-radio-button :label="1" size="large">女</el-radio-button>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="头像" prop='avatar'>
			<SingleUpload :source-url="state.ruleForm.avatar" @change-source-url="changeAvatar" />
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import SingleUpload from '/@/components/Upload/SingleUpload.vue';
import { postAction } from '/@/api/common';
import { getClassListApi } from '/@/api/system/class-mng';
import { StatusEnum } from '/@/common/status.enum';

const props = defineProps({
	roleList: {
		type: Array,
		required: true
	},
	deptList: {
		type: Array,
		required: true,
	},
	collegeList: {
		type: Array,
		required: true
	}
});
const formRef = ref();
const state = reactive({
	ruleForm: {
		username: '',
		userType: 1,
		number: '',
		collegeId: '',
		majorId: '',
		classId: '',
		deptId: '',
		sex: 0,
		roleIds: [],
		avatar: ''
	},
	rules: {
		username: [
			{ required: true, message: '用户名称不能为空', trigger: 'blur'}
		]
	},
	majorList: [],
	classList: []
});
const changeCollege = data => {
	console.log(1);
	props.collegeList.map((item: any) => {
		if (item.id === data) {
			state.majorList = item.children;
		}
	})
};
const changeMajor = majorId => {
	postAction(getClassListApi, {
		majorId
	}).then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.classList = res.data;
		}
	})
}
const changeAvatar = (url: string) => {
	state.ruleForm.avatar = url;
};
defineExpose({
	formRef,
	state
});
</script>

<style scoped lang="scss">
	.student-box, .teacher-box{
		margin-bottom: 22px;
	}
</style>
