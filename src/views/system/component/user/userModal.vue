<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label="用户名称" prop="username">
			<el-input v-model="state.ruleForm.username" placeholder="请输入用户名称"></el-input>
		</el-form-item>
		<el-form-item label="关联角色" prop="roleIds">
			<el-select v-model="state.ruleForm.roleIds" clearable multiple class="w100">
				<el-option v-for="item in props.roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="头像" prop='avatar'>
			<SingleUpload :source-url="state.ruleForm.avatar" @change-source-url="changeAvatar" />
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import SingleUpload from '/@/components/Upload/SingleUpload.vue';

const props = defineProps({
	roleList: {
		type: Array,
		required: true
	}
});
const formRef = ref();
const state = reactive({
	ruleForm: {
		username: '',
		roleIds: [],
		avatar: ''
	},
	rules: {
		username: [
			{ required: true, message: '用户名称不能为空', trigger: 'blur'}
		]
	}
});
const changeAvatar = (url: string) => {
	state.ruleForm.avatar = url;
};
defineExpose({
	formRef,
	state
});
</script>

<style scoped lang="scss">

</style>
