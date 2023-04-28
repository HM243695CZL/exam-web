<template>
	<div class='page-modal-container h100'>
		<div class='title'>{{state.ruleForm.id ? '编辑' : '新增'}}题目</div>
		<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
			<el-form-item label="题目" prop="question">
				<Editor ref='questionEditorRef' :content='state.ruleForm.question' :height='300' @editorBlur='changeQuestion' />
			</el-form-item>
			<el-row>
				<el-col :span='12'>
					<el-form-item label="试题分类" prop="questionType">
						<el-select class='w100' v-model='state.ruleForm.questionType' clearable>
							<el-option v-for='item in props.questionTypeList' :key='item.id' :label='item.name' :value='item.id'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label="试题类型" prop="type">
						<el-select class='w100' v-model='state.ruleForm.type' clearable @change='changeType'>
							<el-option v-for='item in state.typeList' :key='item.value' :label='item.text' :value='item.value'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span='12'>
					<el-form-item label="难度" prop="difficulty">
						<el-select class='w100' v-model='state.ruleForm.difficulty' clearable>
							<el-option v-for='item in state.difficultyList' :key='item.value' :label='item.text' :value='item.value'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span='12'>
					<el-form-item label="分数" prop="score">
						<el-input-number class='w100' v-model="state.ruleForm.score" placeholder="请输入分数" :min='1'></el-input-number>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item v-if='[1, 2, 3].includes(state.ruleForm.type)' label='选项'>
				<div class='question-item' v-for='(item, index) in state.ruleForm.questionItemList' :key='item.key'>
					<el-checkbox v-if='state.ruleForm.type === 2' v-model="item.check" :label="state.itemIndex[index]" />
					<el-radio-group v-else v-model="state.ruleForm.answer">
						<el-radio  :label="state.ruleForm.type === 3 ? state.determineList[index] : state.itemIndex[index]" size="large"></el-radio>
					</el-radio-group>
					<div class='name'>
						<el-input v-model='item.name' placeholder='请输入选项' clearable></el-input>
					</div>
					<div class='remove-item' @click='clickRemoveItem(index)'>
						<SvgIcon name='ele-Remove'></SvgIcon>
					</div>
				</div>
				<el-button type='default' @click='clickAddItem'>添加选项</el-button>
			</el-form-item>
			<div v-if='[1, 2, 3].includes(state.ruleForm.type)' class='tip'>注：选中的选项为正确答案，至少有两项</div>
			<el-form-item label="解析" prop="analysis">
				<Editor ref='analysisEditorRef' :content='state.ruleForm.analysis' :height='300' @editorBlur='changeAnalysis' />
			</el-form-item>
		</el-form>
		<div class='btn'>
			<el-button type='default' @click='clickCancel'>取消</el-button>
			<el-button type='primary' @click='clickConfirm'>确定</el-button>
		</div>
	</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
import Editor from '/@/components/Editor/Wangeditor.vue';
import { getAction, postAction } from '/@/api/common';
import { createPaperApi, updatePaperApi, viewPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';
import other from '/@/utils/other';
const emits = defineEmits([
	'clickCancel'
]);
const props = defineProps({
	questionTypeList: {
		type: Array,
		required: true
	},
	dataId: {
		type: String
	}
});
const formRef = ref();
const questionEditorRef = ref();
const analysisEditorRef = ref();
const state = reactive({
	ruleForm: {
		id: '',
		question: '',
		score: 5,
		answer: '' as any,
		analysis: '',
		type: null as any,
		questionType: '',
		difficulty: null,
		questionItemList: [] as any
	},
	rules: {
		question: [
			{ required: true, message: '题目不能为空', trigger: 'blur'}
		],
		questionType: [
			{ required: true, message: '试题分类不能为空', trigger: 'change'}
		],
		type: [
			{ required: true, message: '试题类型不能为空', trigger: 'change'}
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
	itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
	determineList: ['对', '错']
});
const clickCancel = () => {
	emits('clickCancel', false);
};
const clickConfirm = () => {
	if (state.ruleForm.type === 2) {
		const answerArr = [];
		state.ruleForm.questionItemList.map((item, index) => {
			if (item.check) {
				answerArr.push(state.itemIndex[index]);
			}
		});
		state.ruleForm.answer = answerArr.join(',');
	}
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			if (state.ruleForm.type !== 4) {
				if (!state.ruleForm.answer) {
					ElMessage.error('请选择答案');
					return false;
				}
				if (state.ruleForm.type === 2) {
					if (state.ruleForm.answer.split(',').length < 2) {
						ElMessage.error('至少需要两个答案');
						return false;
					}
				}
				if (state.ruleForm.questionItemList.length < 2) {
					ElMessage.error('选项至少两个');
					return false;
				}
			}
			postAction(state.ruleForm.id ? updatePaperApi : createPaperApi, state.ruleForm).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					emits('clickCancel', true);
				}
			})
		}
	})
};
const changeQuestion = (value: string) => {
	state.ruleForm.question = value;
};
const changeType = value => {
	if (value === 3) {
		state.ruleForm.questionItemList = state.ruleForm.questionItemList.slice(0, 2);
	}
};
const clickAddItem = () => {
	state.ruleForm.questionItemList.push({
		key: new Date().getTime(),
		name: '',
		check: false
	})
};
const clickRemoveItem = (index: number) => {
	state.ruleForm.questionItemList.splice(index, 1);
};
const changeAnalysis = (value: string) => {
	state.ruleForm.analysis = value;
};
onMounted(() => {
	formRef.value.resetFields();
	state.ruleForm.id = props.dataId as string;
	if (props.dataId) {
		getAction(viewPaperApi + '/' + state.ruleForm.id, '').then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.ruleForm = other.formatFormMap(state.ruleForm, res.data) as any;
				questionEditorRef.value.editorRef.setHtml(state.ruleForm.question);
				analysisEditorRef.value.editorRef.setHtml(state.ruleForm.analysis);
				if (state.ruleForm.type === 2) {
					const answerIndex = [];
					state.itemIndex.map((item, index) => {
						if (state.ruleForm.answer.split(',').includes(item)) {
							answerIndex.push(index);
						}
					})
					state.ruleForm.questionItemList.map((item, index) => {
						if (answerIndex.includes(index)) {
							item.check = true;
						}
					})
				}
			}
		});
	}
})
</script>

<style scoped lang='scss'>
	.page-modal-container{
		padding: 20px;
		.title{
			font-weight: 700;
			font-size: 20px;
			width: fit-content;
			margin-bottom: 10px;
		}
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
		.tip{
			font-size: 14px;
			color: #f40;
		}
		.add-item{
			margin-top: 10px;
			padding: 0 10px;
			border: 1px solid #ccc;
			cursor: pointer;
			border-radius: 5px;
			text-align: center;
		}
		.remove-item{
			cursor: pointer;
			&:hover{
				color: #126ac6;
			}
		}
		.el-row{
			margin-bottom: 10px;
		}
		.btn{
			margin-top: 20px;
			text-align: center;
		}
	}
</style>
