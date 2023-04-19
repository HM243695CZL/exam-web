<template>
	<div class='teacher-container h100' ref='teacherRef'>
		<CommonTop
			@clickSearch="clickSearch"
			@clickReset="clickReset"
			@clickAdd="clickAdd"
		>
			<template #left>
				<el-form-item label="姓名">
					<el-input v-model="searchParams.name" placeholder="请输入姓名" clearable></el-input>
				</el-form-item>
				<el-form-item label="工号">
					<el-input v-model="searchParams.number" placeholder="请输入工号" clearable></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="searchParams.email" placeholder="请输入邮箱" clearable></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="searchParams.phone" placeholder="请输入电话" clearable></el-input>
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
			<vxe-column title="姓名" field="name" />
			<vxe-column title="工号" field="number" />
			<vxe-column title="部门" field="deptName" />
			<vxe-column title="电话" field="phone" />
			<vxe-column title="邮箱" field="email" />
			<vxe-column title="性别" field="sex">
				<template #default='scope'>
					<el-tag>
						{{scope.row.sex === 0 ? '男' : '女'}}
					</el-tag>
				</template>
			</vxe-column>
			<vxe-column title="头像" field="avatar">
				<template #default='scope'>
					<PreviewImg :img-url='scope.row.avatar' />
				</template>
			</vxe-column>
			<vxe-column title='操作' width='260'>
				<template #default='scope'>
					<el-button size='small' type='default' @click="clickEdit(scope.row.id)">修改</el-button>
					<el-button size='small' type='danger' @click='clickDelete(scope.row.id)'>删除</el-button>
				</template>
			</vxe-column>
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
			<TeacherModal :dept-list='deptList' ref='childRef' />
		</CommonModal>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import TeacherModal from './component/teacher/teacherModal.vue';
import PreviewImg from '/@/components/previewImg/index.vue';
import {
	createTeacherApi,
	deleteTeacherApi,
	getTeacherPageApi,
	updateTeacherApi,
	viewTeacherApi,
} from '/@/api/system/teacher';
import useCrud from '/@/hooks/useCrud';
import { getAction } from '/@/api/common';
import { getDeptListApi } from '/@/api/system/dept';
import { StatusEnum } from '/@/common/status.enum';

export default defineComponent({
	name: 'teacher',
	components: {
		CommonTop,
		CommonModal,
		PaginationCommon,
		TeacherModal,
		PreviewImg
	},
	setup() {
		const teacherRef = ref();
		const state = reactive({
			uris: {
				page: getTeacherPageApi,
				delete: deleteTeacherApi
			},
			configObj: {
				title: '老师',
				createPath: createTeacherApi,
				updatePath: updateTeacherApi,
				viewPath: viewTeacherApi
			},
			deptList: []
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
			clickAdd,
			clickEdit,
			clickSearch,
			clickReset,
			clickDelete,
			changePageIndex,
			changePageSize
		} = useCrud({
			uris: state.uris,
			parentRef: teacherRef
		});
		const getDeptList = () => {
			getAction(getDeptListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.deptList = res.data;
				}
			});
		};
		onMounted(() => {
			getDeptList();
		});
		return {
			teacherRef,
			...toRefs(state),

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
</script>

<style scoped lang='scss'>
	.teacher-container{
		padding: 20px;
		overflow: auto;
	}
</style>
