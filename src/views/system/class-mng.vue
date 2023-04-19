<template>
	<div class='class-mng-container' ref='classRef'>
		<div class='box h100'>
			<div class='tree-box h100'>
				<CollegeTree ref='collegeTreeRef' @clickNode='clickNode($event)' />
			</div>
			<div class='content-box h100'>
				<CommonTop
					@clickSearch="clickSearch"
					@clickReset="clickReset"
					@clickAdd="clickAdd"
				>
					<template #right>
						<el-form-item label="姓名">
							<el-input v-model="searchParams.name" placeholder="请输入姓名" clearable></el-input>
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
					<vxe-column title="学院名称" field="collegeName" />
					<vxe-column title="专业名称" field="majorName" />
					<vxe-column title="班级名称" field="name" />
				</vxe-table>
				<PaginationCommon
					:page-info='pageInfo'
					@changePageSize='changePageSize'
					@changePageIndex='changePageIndex'
				/>
				<CommonModal
					ref='modalFormRef'
					:title='configObj.title'
					:create-path='configObj.createPath'
					:update-path='configObj.updatePath'
					:view-path='configObj.viewPath'
					@refreshList='getDataList'
				>
					<ClassMngModal
						:college-list='collegeList'
						ref='childRef' />
				</CommonModal>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import CollegeTree from './component/class-mng/collegeTree.vue';
import ClassMngModal from './component/class-mng/classMngModal.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import useCrud from '/@/hooks/useCrud';
import {
	createClassApi,
	deleteClassApi,
	getClassPageApi,
	updateClassApi,
	viewClassApi,
} from '/@/api/system/class-mng';

export default defineComponent({
	name: 'class-mng',
	components: {
		CollegeTree,
		CommonTop,
		PaginationCommon,
		CommonModal,
		ClassMngModal
	},
	setup() {
		const classRef = ref();
		const state = reactive({
			uris: {
				page: getClassPageApi,
				delete: deleteClassApi
			},
			configObj: {
				title: '班级',
				createPath: createClassApi,
				updatePath: updateClassApi,
				viewPath: viewClassApi
			},
			currentNode: '',
			collegeList: [],
			params: {
				collegeId: '',
				majorId: ''
			}
		});
		const clickNode = data => {
			state.params.collegeId = '';
			state.params.majorId = '';
			if (data.node.parentId) {
				// 专业
				state.params.majorId = data.node.id;
			} else {
				// 学院
				state.params.collegeId = data.node.id;
			}
			state.currentNode = data.node.id;
			state.collegeList = data.collegeList;
			getDataList();
		};
		const {
			tableRef,
			modalFormRef,
			childRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			getDataList,
			clickAdd,
			clickEdit,
			clickSearch,
			clickReset,
			clickDelete,
			changePageIndex,
			changePageSize
		} = useCrud({
			uris: state.uris,
			parentRef: classRef,
			isMountedLoad: false,
			otherParams: state.params
		});
		return {
			classRef,
			...toRefs(state),
			clickNode,

			tableRef,
			modalFormRef,
			childRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			getDataList,
			clickAdd,
			clickEdit,
			clickSearch,
			clickReset,
			clickDelete,
			changePageIndex,
			changePageSize
		}
	}
});
class Params {
	collegeId: string | undefined;
	majorId: string | undefined;
}
</script>

<style scoped lang='scss'>
	.class-mng-container{
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
