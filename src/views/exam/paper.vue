<template>
	<div class='paper-container h100' ref='paperRef'>
		<div class='content-box' v-if='pageStatus === "main"'>
			<CommonTop
				@clickSearch="clickSearch"
				@clickReset="clickReset"
				@clickAdd="clickAdd"
			>
				<template #left>
					<el-form-item label="试卷名称">
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
				<vxe-column title="操作" width="280">
					<template #default="scope">
						<el-button size='small' type='default' @click="clickPreview(scope.row.id)">预览</el-button>
						<el-button size='small' type='default' @click="clickPublish(scope.row.id)">发布考试</el-button>
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
			:question-type-list='questionTypeList'
		/>
		<PublishExamModal
			:class-list='classList'
			ref='publishExamModalRef'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { deletePaperApi, getPaperPageApi } from '/@/api/exam/paper';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import PaperModal from './component/paper/paperModal.vue';
import PublishExamModal from './component/paper/publishExamModal.vue';
import { getAction, postAction } from '/@/api/common';
import { getClassListApi } from '/@/api/system/class-mng';
import { StatusEnum } from '/@/common/status.enum';
import { getQuestionTypListApi } from '/@/api/exam/question-type';

export default defineComponent({
	name: 'paper',
	components: {
		CommonTop,
		PaginationCommon,
		PaperModal,
		PublishExamModal
	},
	setup() {
		const paperRef = ref();
		const publishExamModalRef = ref();
		const state = reactive({
			uris: {
				page: getPaperPageApi,
				delete: deletePaperApi
			},
			pageStatus: 'main',
			currentId: '',
			classList: [],
			questionTypeList: []
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
		const clickPreview = id => {
			const { origin, pathname } = window.location;
			window.open(`${origin}${pathname}#/previewPaper?paperId=${id}`);
		};
		const clickPublish = id => {
			publishExamModalRef.value.openDialog(id);
		};
		const clickCancel = (isRefresh: boolean) => {
			state.pageStatus = 'main';
			if (isRefresh) {
				getDataList();
			}
		};
		const getClassList = () => {
			postAction(getClassListApi, {}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.classList = res.data;
				}
			})
		};
		const getQuestionTypeList = () => {
			getAction(getQuestionTypListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.questionTypeList = res.data;
				}
			})
		}
		onMounted(() => {
			getClassList();
			getQuestionTypeList();
		});
		return {
			paperRef,
			publishExamModalRef,
			...toRefs(state),
			clickAdd,
			clickEdit,
			clickCancel,
			clickPreview,
			clickPublish,

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
