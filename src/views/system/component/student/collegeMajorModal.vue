<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label='名称' prop='name'>
			<el-input v-model='state.ruleForm.name' placeholder='请输入名称' clearable></el-input>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>
import { reactive, ref } from 'vue';
const formRef = ref();
const state = reactive({
	ruleForm: {
		id: '',
		name: '',
		parentId: null,
		type: '0',
	},
	rules: {
		name: [
			{ required: true, message: '名称不能为空', trigger: 'blur'}
		]
	}
});
defineExpose({
	formRef,
	state
});
</script>

<style scoped lang='scss'>

</style>
