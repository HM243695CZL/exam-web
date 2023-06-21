<template>
	<vxe-modal v-model="state.isShowDialog" :title="state.title" width="1000px">
		<el-row> 1、下载导入模板 <el-tag @click="clickDownloadTemplate">点击下载</el-tag> </el-row>
		<el-row> 2、按条件填写信息 </el-row>
		<vxe-table :data="state.dataList">
			<vxe-column field="question" title="题目名称">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.question }}</span>
				</template>
			</vxe-column>
			<vxe-column field="questionType" title="题目分类">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.questionType }}</span>
				</template>
			</vxe-column>
			<vxe-column field="type" title="题目类型">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.type }}</span>
				</template>
			</vxe-column>
			<vxe-column field="difficulty" title="题目难度">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.difficulty }}</span>
				</template>
			</vxe-column>
			<vxe-column field="score" title="题目分数">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.score }}</span>
				</template>
			</vxe-column>
			<vxe-column field="itemA" title="题目选项A">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.itemA }}</span>
				</template>
			</vxe-column>
			<vxe-column field="itemB" title="题目选项B">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.itemB }}</span>
				</template>
			</vxe-column>
			<vxe-column field="itemC" title="题目选项C">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.itemC }}</span>
				</template>
			</vxe-column>
			<vxe-column field="itemD" title="题目选项D">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.itemD }}</span>
				</template>
			</vxe-column>
			<vxe-column field="answer" title="题目答案">
				<template #default="scope">
					<span class="no-blank">{{ scope.row.answer }}</span>
				</template>
			</vxe-column>
			<vxe-column field="analysis" title="题目解析" />
		</vxe-table>
		<el-row>
			3、上传填好的文档
			<el-upload :auto-upload="false" :on-change="handleChange" :on-remove="handleRemove" accept=".xls,.xlsx">
				<template #trigger>
					<el-tag>点击上传</el-tag>
				</template>
			</el-upload>
		</el-row>
		<el-row> 4、点击确定按钮导入文档 </el-row>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="closeDialog">取 消</el-button>
				<el-button type="primary" @click="clickConfirm">确 定</el-button>
			</div>
		</template>
	</vxe-modal>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { uploadAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';
import { downloadQuestionTemplateApi, importQuestionApi } from '/@/api/exam/question';

const emits = defineEmits(['refreshList']);
const state = reactive({
	isShowDialog: false,
	title: '导入试题',
	dataList: [
		{
			question: '必填',
			type: '必填',
			questionType: '必填',
			difficulty: '必填',
			score: '必填',
			itemA: '必填',
			itemB: '必填',
			itemC: '必填',
			itemD: '必填',
			answer: '必填',
			analysis: '非必填',
		},
	],
	baseUrl: import.meta.env.VITE_API_URL as any,
	fileMap: null,
});
const closeDialog = () => {
	state.isShowDialog = false;
};
const openDialog = () => {
	state.isShowDialog = true;
};
const clickDownloadTemplate = () => {
	window.open(state.baseUrl + downloadQuestionTemplateApi);
};
const handleChange = (file) => {
	state.fileMap = file.raw;
};
const handleRemove = () => {
	state.fileMap = null;
};
const clickConfirm = () => {
	if (!state.fileMap) {
		ElMessage.error('请选择填写完成的模板文件');
		return false;
	}
	const formData = new FormData();
	formData.append('file', state.fileMap);
	uploadAction(importQuestionApi, formData).then((res) => {
		if (res.status === StatusEnum.SUCCESS) {
			ElMessage.success(res.message);
			closeDialog();
			emits('refreshList');
		}
	});
};
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.el-row {
	margin-top: 10px;
	margin-bottom: 10px;
}
.el-tag {
	margin-left: 20px;
	cursor: pointer;
}
.no-blank {
	color: #d9001b;
}
</style>
