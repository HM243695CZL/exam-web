<template>
	<div class='paper-container h100' ref='paperRef'>
		<div class='content-box' v-if='pageStatus === "main"'>
			<CommonTop
				@clickSearch="clickSearch"
				@clickReset="clickReset"
				@clickAdd="clickAdd"
			>
				<template #left>
					<el-form-item label="题目">
						<el-input v-model="searchParams.name" placeholder="请输入试卷名称" clearable></el-input>
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
				<vxe-column title="试卷名称" field='name'/>
				<vxe-column title="试题信息" field='questionInfo'/>
				<vxe-column title="总分" field='score'/>
				<vxe-column title="添加时间" field='addTime'/>
				<vxe-column title="操作" width="270">
					<template #default="scope">
						<el-button size='small' type='default' @click="clickPreview(scope.row.id, 1)">预览</el-button>
						<el-button size='small' type='default' @click="clickPreview(scope.row.id, 2)">去考试</el-button>
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
		<PaperModal
			v-if='pageStatus === "info"'
			@clickCancel='clickCancel'
			:id='currentId'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { deletePaperApi, getPaperPageApi } from '/@/api/exam/paper';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import PaperModal from './component/paperModal.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'paper',
	components: {
		CommonTop,
		PaginationCommon,
		PaperModal
	},
	setup() {
		const router = useRouter();
		const paperRef = ref();
		const state = reactive({
			uris: {
				page: getPaperPageApi,
				delete: deletePaperApi
			},
			pageStatus: 'main',
			currentId: ''
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

		const clickAdd = () => {
			state.currentId = '';
			state.pageStatus = 'info';
		};
		const clickEdit = id => {
			state.currentId = id;
			state.pageStatus = 'info';
		};
		/**
		 *
		 * @param type  1 预览   2 考试
		 */
		const clickPreview = (id, type) => {
			const { origin, pathname } = window.location;
			window.open(`${origin}${pathname}#/previewPaper?id=${id}&type=${type}`);
		};
		const clickCancel = (isRefresh: boolean) => {
			state.pageStatus = 'main';
			if (isRefresh) {
				getDataList();
			}
		};

		return {
			paperRef,
			...toRefs(state),
			clickAdd,
			clickEdit,
			clickCancel,
			clickPreview,

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
	}
</style>
