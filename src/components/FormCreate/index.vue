<template>
	<div class='form-create-container'>
		<form-create v-model="state.value" :rule="props.formConfig"
								 :option='state.options'
								 v-model:api="state.fApi"/>
	</div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';

	const props = defineProps({
		formConfig: {
			type: Object,
			required: true
		}
	});
	const state = reactive({
		value: {},
		fApi: {} as any,
		options: {
			submitBtn: false,
		},
	});
	defineExpose({
		state
	})
</script>
<style lang='scss' scoped>
	.form-create-container{
		:deep(.el-col-24){
			margin-bottom: 30px;
		}
	}
</style>
