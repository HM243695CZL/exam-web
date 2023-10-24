<template>
	<div class='review-container' ref='reviewRef'>
		<div class='box h100' v-if='pageStatus === "main"'>
			<div class='tree-box h100'>
				<TypeTree
					:title='configTreeObj.title'
					:create-path='configTreeObj.createPath'
					:update-path='configTreeObj.updatePath'
					:get-list-path='configTreeObj.getListPath'
					:delete-path='configTreeObj.deletePath'
					@clickNode='clickNode($event)'
					:default-node='otherSearchParams.reviewType'
				/>
			</div>
			<div class='content-box h100'>
				<CommonTop
					@clickSearch="getDataList"
					@clickReset="clickReset"
					@clickAdd="clickAdd"
					@clickBatchDelete='clickBatchDelete'
					:button-auth='["addBtn", "batchDeleteBtn", "searchBtn", "resetBtn"]'
				>
					<template #left>
						<el-form-item label="内容">
							<el-input v-model="searchParams.content" placeholder="请输入内容" clearable></el-input>
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
					<vxe-column field='reviewTypeName' title='分类名称' />
					<vxe-column type='html' field='content' title='内容' />
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
		<ReviewModal
			v-if='pageStatus === "info"'
			:review-type-list='reviewTypeList'
			:data-id='dataId'
			@clickCancel='clickCancel'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import {
	createReviewTypeApi,
	deleteReviewTypeApi,
	getReviewTypeListApi,
	updateReviewTypeApi,
} from '/src/api/exam/review-type';
import TypeTree from '/@/components/TypeTree/index.vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import { deleteBatchReviewApi, deleteReviewApi, getReviewPageApi } from '/@/api/exam/review';
import ReviewModal from '/@/views/exam/component/review/reviewModal.vue';
import useCrud from '/@/hooks/useCrud';

export default defineComponent({
	name: 'review',
	components: {
		PaginationCommon,
		CommonTop,
		TypeTree,
		ReviewModal
	},
	setup() {
		const reviewRef = ref();
		const state = reactive({
			configTreeObj: {
				title: '复习分类',
				createPath: createReviewTypeApi,
				updatePath: updateReviewTypeApi,
				getListPath: getReviewTypeListApi,
				deletePath: deleteReviewTypeApi
			},
			uris: {
				page: getReviewPageApi,
				delete: deleteReviewApi,
				deleteBatch: deleteBatchReviewApi
			},
			pageStatus: 'main',
			otherSearchParams: {
				reviewType: ''
			},
			dataId: '',
			reviewTypeList: []
		});
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
			clickReset,
			clickDelete,
			clickBatchDelete,
			changePageIndex,
			changePageSize,
			filterChange,
			selectionChange,
		} = useCrud({
			uris: state.uris,
			parentRef: reviewRef,
			otherParams: state.otherSearchParams
		});
		const clickNode = data => {
			state.reviewTypeList = data.dataList;
			state.otherSearchParams.reviewType = data.node.id;
			getDataList();
		};
		const clickAdd = () => {
			state.dataId = '';
			state.pageStatus = 'info';
		};
		const clickEdit = dataId => {
			state.dataId = dataId;
			state.pageStatus = 'info';
		}
		const clickCancel = (refresh: boolean) => {
			state.pageStatus = 'main';
			if (refresh) {
				getDataList();
			}
		};
		return {
			reviewRef,
			...toRefs(state),
			clickNode,
			clickAdd,
			clickCancel,
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
			clickReset,
			clickDelete,
			clickBatchDelete,
			changePageIndex,
			changePageSize,
			filterChange,
			selectionChange,
		};
	}
});
</script>

<style scoped lang='scss'>
	.review-container{
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
