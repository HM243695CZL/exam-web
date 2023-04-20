<template>
	<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
		<el-form-item label="题目" prop="question">
			<el-input v-model="state.ruleForm.question" placeholder="请输入题目" clearable></el-input>
		</el-form-item>
		<el-form-item label="分数" prop="score">
			<el-input-number class='w100' v-model="state.ruleForm.score" placeholder="请输入分数" :min='1'></el-input-number>
		</el-form-item>
		<el-form-item label="答案" prop="answer">
			<el-input v-model="state.ruleForm.answer" placeholder="请输入答案" clearable></el-input>
		</el-form-item>
		<el-form-item label="解析" prop="analysis">
			<el-input v-model="state.ruleForm.analysis" placeholder="请输入解析" clearable></el-input>
		</el-form-item>
		<el-form-item label="试题类型" prop="type">
			<el-select class='w100' v-model='state.ruleForm.type' clearable>
				<el-option v-for='item in state.typeList' :key='item.value' :label='item.text' :value='item.value'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="试题分类" prop="questionType">
			<el-select class='w100' v-model='state.ruleForm.questionType' clearable>
				<el-option v-for='item in props.questionTypeList' :key='item.id' :label='item.name' :value='item.id'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="难度" prop="difficulty">
			<el-select class='w100' v-model='state.ruleForm.difficulty' clearable>
				<el-option v-for='item in state.difficultyList' :key='item.value' :label='item.text' :value='item.value'></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label='选项'>
			<div class='question-item' v-for='(item, index) in state.ruleForm.questionItemList' :key='item.key'>
				<div class='option'>{{state.itemIndex[index]}}</div>
				<div class='name'>
					<el-input v-model='item.name' placeholder='请输入选项' clearable></el-input>
				</div>
				<div class='remove-item'>
					<SvgIcon name='ele-Remove'></SvgIcon>
				</div>
			</div>
			<el-button type='default' @click='clickAddItem'>添加选项</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang='ts' setup>

import { reactive, ref } from 'vue';

const props = defineProps({
	questionTypeList: {
		type: Array,
		required: true
	}
});
const formRef = ref();
const state = reactive({
	ruleForm: {
		question: '',
		score: 0,
		answer: '',
		analysis: '',
		type: null,
		questionType: '',
		difficulty: null,
		questionItemList: [] as any
	},
	rules: {
		question: [
			{ required: true, message: '题目不能为空', trigger: 'blur'}
		]
	},
	typeList: [
		{ text: '单选题', value: 1 },
		{ text: '多选题', value: 2 },
		{ text: '判断题', value: 3 },
		{ text: '简答题', value: 4 },
	],
	difficultyList: [
		{ text: '简单', value: 1 },
		{ text: '一般', value: 2 },
		{ text: '困难', value: 3 },
	],
	itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
});
const clickAddItem = () => {
	state.ruleForm.questionItemList.push({
		key: new Date().getTime(),
		name: ''
	})
}
defineExpose({
	formRef,
	state
});
</script>

<style scoped lang='scss'>
	.question-item{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-bottom: 10px;
		.name{
			padding: 0 10px;
			width: 100%;
		}
	}
	.add-item{
		margin-top: 10px;
		padding: 0 10px;
		border: 1px solid #ccc;
		cursor: pointer;
		border-radius: 5px;
		text-align: center;
	}
</style>
