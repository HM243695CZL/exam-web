<template>
	<div class='question-container' ref='questionRef'>
		<div class='box h100' v-if='pageStatus === "main"'>
			<div class='tree-box h100'>
				<TypeTree
					:title='configTreeObj.title'
					:create-path='configTreeObj.createPath'
					:update-path='configTreeObj.updatePath'
					:get-list-path='configTreeObj.getListPath'
					:delete-path='configTreeObj.deletePath'
					@clickNode='clickNode($event)'
					:has-operate-auth='!$props.type'
				/>
			</div>
			<div class='content-box h100'>
				<CommonTop
					:button-auth='buttonAuth'
					@clickSearch="clickSearch"
					@clickReset="clickReset"
					@clickAdd="clickAdd"
					@clickBatchDelete='clickBatchDelete'
				>
					<template #left>
						<el-form-item label="题目">
							<el-input v-model="searchParams.question" placeholder="请输入题目" clearable></el-input>
						</el-form-item>
					</template>
				</CommonTop>
				<vxe-table
					ref='tableRef'
					:row-config='{
						useKey: true,
						keyField: "id"
					}'
					:data='dataList'
					:max-height='tableHeight'
					@checkbox-all='selectionChange'
					@checkbox-change='selectionChange'
					@filter-change='filterChange'
				>
					<vxe-column type='checkbox' width='60' />
					<vxe-column type="seq" title="序号" width="60" />
					<vxe-column type='html' title="题目" field="question" width='250' />
					<vxe-column title="题型" field="type">
						<template #default="scope">
							{{typeMap[scope.row.type]}}
						</template>
					</vxe-column>
					<vxe-column title="试题分类" field="questionTypeName" />
					<vxe-column title='难度' field='difficulty'>
						<template #default="scope">
							{{difficultyMap[scope.row.difficulty]}}
						</template>
					</vxe-column>
					<vxe-column title="添加时间" field="addTime" />
					<vxe-column title="操作" width="200" v-if='!$props.isChooseQuestion'>
						<template #default="scope">
							<el-button size='small' type='default' @click="clickEdit(scope.row.id)">修改</el-button>
							<el-button size='small' type='danger' @click="clickDelete(scope.row.id)">删除</el-button>
						</template>
					</vxe-column>
				</vxe-table>
				<PaginationCommon
					:page-info='pageInfo'
					@changePageSize='changePageSize'
					@changePageIndex='changePageIndex'
				/>
			</div>
		</div>
		<QuestionModal v-if='pageStatus === "info"'
								:question-type-list='questionTypeList'
								:data-id='dataId'
								@clickCancel='clickCancel' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import {
	createQuestionTypeApi,
	deletePQuestionTypApi,
	getQuestionTypListApi,
	updateQuestionTypApi,
} from '/@/api/exam/question-type';
import TypeTree from '/@/components/TypeTree/index.vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import QuestionModal from './component/question/questionModal.vue';
import {
	createQuestionApi, deleteBatchQuestionApi, deleteQuestionApi,
	getQuestionPageApi, updateQuestionApi,
	viewQuestionApi,
} from '/@/api/exam/question';
import useCrud from '/@/hooks/useCrud';

export default defineComponent({
	name: 'question',
	components: {
		TypeTree,
		CommonTop,
		PaginationCommon,
		QuestionModal
	},
	props: {
		type: {
			type: Number
		},
		isChooseQuestion: {
			type: Boolean,
			default: false
		}
	},
	setup(props) {
		const questionRef = ref();
		const state = reactive({
			configTreeObj: {
				title: '试题分类',
				createPath: createQuestionTypeApi,
				updatePath: updateQuestionTypApi,
				getListPath: getQuestionTypListApi,
				deletePath: deletePQuestionTypApi
			},
			uris: {
				page: getQuestionPageApi,
				delete: deleteQuestionApi,
				deleteBatch: deleteBatchQuestionApi
			},
			searchParams: {
				type: props.type,
				questionType: ''
			},
			configObj: {
				title: '试题',
				createPath: createQuestionApi,
				updatePath: updateQuestionApi,
				viewPath: viewQuestionApi
			},
			questionTypeList: [],
			typeMap: {
				1: '单选题',
				2: '多选题',
				3: '判断题',
				4: '简答题'
			},
			difficultyMap: {
				1: '简单',
				2: '一般',
				3: '困难'
			},
			pageStatus: 'main',
			dataId: '',
			buttonAuth: ['addBtn', 'searchBtn', 'resetBtn', 'batchDeleteBtn'],
		});
		const clickNode = data => {
			state.questionTypeList = data.dataList;
			state.searchParams.questionType = data.node.id;
			getDataList(state.searchParams);
		};
		const clickAdd = () => {
			state.dataId = '';
			state.pageStatus = 'info';
		};
		const clickEdit = (dataId: string) => {
			state.dataId = dataId;
			state.pageStatus = 'info';
		};
		const clickCancel = (refresh: boolean) => {
			state.pageStatus = 'main';
			if (refresh) {
				getDataList(state.searchParams);
			}
		}
		const {
			tableRef,
			modalFormRef,
			childRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			selectionRows,
			getDataList,
			clickSearch,
			clickReset,
			clickDelete,
			clickBatchDelete,
			changePageIndex,
			changePageSize,
			filterChange,
			selectionChange,
		} = useCrud({
			uris: state.uris,
			parentRef: questionRef,
			isMountedLoad: false
		});
		onMounted(() => {
			if (props.type) {
				state.buttonAuth = ['searchBtn', 'resetBtn'];
			}
			getDataList(state.searchParams);
		});
		return {
			questionRef,
			...toRefs(state),
			clickNode,
			clickCancel,
			clickAdd,
			clickEdit,

			tableRef,
			modalFormRef,
			childRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			selectionRows,
			getDataList,
			clickSearch,
			clickReset,
			clickDelete,
			clickBatchDelete,
			changePageIndex,
			changePageSize,
			filterChange,
			selectionChange,
		}
	}
});
</script>

<style scoped lang='scss'>
	.question-container{
		padding: 20px;
		overflow: auto;
		.box{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.tree-box{
				width: 320px;
			}
			.content-box{
				flex: 1;
				padding: 15px;
			}
		}
	}
</style>
