<template>
	<div class='paper-container' ref='paperRef'>
		<div class='box h100' v-if='pageStatus === "main"'>
			<div class='tree-box h100'>
				<TypeTree
					:title='configTreeObj.title'
					:create-path='configTreeObj.createPath'
					:update-path='configTreeObj.updatePath'
					:get-list-path='configTreeObj.getListPath'
					:delete-path='configTreeObj.deletePath'
					@clickNode='clickNode($event)'
				/>
			</div>
			<div class='content-box h100'>
				<CommonTop
					@clickSearch="clickSearch"
					@clickReset="clickReset"
					@clickAdd="clickAdd"
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
				>
					<vxe-column type="seq" title="序号" width="60" />
					<vxe-column type='html' title="题目" field="question" />
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
					<vxe-column title="操作" width="200">
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
		<PaperModal v-if='pageStatus === "info"'
								:question-type-list='questionTypeList'
								:data-id='dataId'
								@clickCancel='clickCancel' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import {
	createPaperTypeApi,
	deletePaperTypeApi,
	getPaperTypeListApi,
	updatePaperTypeApi,
} from '/@/api/exam/paper-type';
import TypeTree from '/@/components/TypeTree/index.vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import PaperModal from './component/paperModal.vue';
import { createPaperApi, deletePaperApi, getPaperPageApi, updatePaperApi, viewPaperApi } from '/@/api/exam/paper';
import useCrud from '/@/hooks/useCrud';

export default defineComponent({
	name: 'paper',
	components: {
		TypeTree,
		CommonTop,
		PaginationCommon,
		PaperModal
	},
	setup() {
		const paperRef = ref();
		const state = reactive({
			configTreeObj: {
				title: '试题分类',
				createPath: createPaperTypeApi,
				updatePath: updatePaperTypeApi,
				getListPath: getPaperTypeListApi,
				deletePath: deletePaperTypeApi
			},
			uris: {
				page: getPaperPageApi,
				delete: deletePaperApi
			},
			configObj: {
				title: '试题',
				createPath: createPaperApi,
				updatePath: updatePaperApi,
				viewPath: viewPaperApi
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
		});
		const {
			tableRef,
			modalFormRef,
			childRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			getDataList,
			clickSearch,
			clickReset,
			clickDelete,
			changePageIndex,
			changePageSize
		} = useCrud({
			uris: state.uris,
			parentRef: paperRef
		});
		const clickNode = data => {
			state.questionTypeList = data.dataList;
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
				getDataList();
			}
		}
		return {
			paperRef,
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
			getDataList,
			clickSearch,
			clickReset,
			clickDelete,
			changePageIndex,
			changePageSize
		}
	}
});
</script>

<style scoped lang='scss'>
	.paper-container{
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
