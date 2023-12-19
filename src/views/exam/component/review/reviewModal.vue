<template>
	<div class='review-modal-container h100'>
	<div class='title'>{{state.ruleForm.id ? '编辑' : '新增'}}</div>
		<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
			<el-form-item label='分类' prop='reviewType'>
				<el-tree-select
					class='w100'
					clearable
					default-expand-all
					v-model='state.ruleForm.reviewType'
					:data='reviewTypeList'
					:props='{children: "children", label: "name", value: "id"}'
					check-strictly
				></el-tree-select>
			</el-form-item>
			<el-form-item label='内容' prop='content'>
				<Editor ref='contentEditorRef' :content='state.ruleForm.content' :height='500' @editorBlur='changeContent' />
			</el-form-item>
			<el-form-item label='原文图片' prop='pictureUrl'>
				<MultiUpload :list='state.ruleForm.pictureUrl' @change-file-list='changeFileList' />
			</el-form-item>
		</el-form>
		<div class='btn'>
			<el-button type='default' @click='clickCancel'>取消</el-button>
			<el-button type='primary' @click='clickConfirm'>确定</el-button>
		</div>
	</div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import Editor from '/@/components/Editor/Wangeditor.vue';
import MultiUpload from '/@/components/Upload/MultiUpload.vue';
import { createReviewApi, updateReviewApi, viewReviewApi } from '/@/api/exam/review';
import { getAction, postAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';
import other, { deepClone } from '/@/utils/other';

const emits = defineEmits([
	'clickCancel'
]);
const props = defineProps({
	reviewTypeList: {
		type: Array,
		required: true
	},
	dataId: {
		type: String
	}
});
const formRef = ref();
const contentEditorRef = ref();
const state = reactive({
	ruleForm: {
		id: '',
		reviewType: '',
		content: '',
		pictureUrl: []
	},
	rules: {
		content: [
			{ required: true, message: '请输入内容', trigger: 'blur'}
		]
	}
})
const clickCancel = () => {
	emits('clickCancel', false);
};
const changeContent = value => {
	state.ruleForm.content = value;
};
const changeFileList = value => {
	state.ruleForm.pictureUrl = value;
};
const clickConfirm = () => {
	formRef.value.validate((valid: boolean) => {
		if (valid) {
			const formData = deepClone(state.ruleForm);
			formData.pictureUrl = state.ruleForm.pictureUrl.map(item => item.url).join(',')
			postAction(state.ruleForm.id ? updateReviewApi : createReviewApi, formData).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
					emits('clickCancel', true);
				}
			})
		}
	})
};
onMounted(() => {
	formRef.value.resetFields();
	state.ruleForm.id = props.dataId as any;
	if (props.dataId) {
		getAction(viewReviewApi + '/' + state.ruleForm.id, '').then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				state.ruleForm = other.formatFormMap(state.ruleForm, res.data) as any;
				contentEditorRef.value.editorRef.setHtml(state.ruleForm.content);
				state.ruleForm.pictureUrl = state.ruleForm.pictureUrl.split(',').map(item => {
					return {
						name: item.substr(item.lastIndexOf('/') + 1),
						url: item
					}
				});
			}
		});
	}
})
</script>

<style scoped lang='scss'>
.review-modal-container{
	padding: 20px;
	.btn{
		margin-top: 20px;
		text-align: center;
	}
}
</style>
