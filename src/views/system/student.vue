<template>
	<div class='student-container h100' ref='studentRef'>
		<CommonTop
			@clickSearch="clickSearch"
			@clickReset="clickReset"
			@clickAdd="clickAdd"
		>
			<template #left>
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
			<vxe-column title="姓名" field="name" />
			<vxe-column title="学号" field="number" />
			<vxe-column title="学院" field="collegeName" />
			<vxe-column title="专业" field="majorName" />
			<vxe-column title="班级" field="className" />
			<vxe-column title="性别" field="sex">
				<template #default='scope'>
					{{scope.row.sex ? '男' : '女'}}
				</template>
			</vxe-column>
			<vxe-column title="生日" field="birthday" />
			<vxe-column title="电话" field="phone" />
			<vxe-column title="头像" field="avatar">
				<template #default='scope'>
					<PreviewImg :img-url='scope.row.avatar' />
				</template>
			</vxe-column>
			<vxe-column title="状态" field="status">
				<template #default='scope'>
					{{scope.row.status ? '禁用' : '启用'}}
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
			<StudentModal ref='childRef' :college-list='collegeList' />
		</CommonModal>
	</div>
</template>

<script lang='ts'>
import { onMounted, reactive, ref, toRefs } from 'vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import StudentModal from './component/student/studentModal.vue';
import PreviewImg from '/@/components/previewImg/index.vue';
import { createStudentApi, deleteStudentApi, getStudentPageApi, updateStudentApi, viewStudentApi } from '/@/api/system/student';
import useCrud from '/@/hooks/useCrud';
import { getAction } from '/@/api/common';
import { getCollegeMajorListApi } from '/@/api/system/class-mng';
import { StatusEnum } from '/@/common/status.enum';

export default {
	name: 'student',
	components: {
		CommonTop,
		CommonModal,
		PaginationCommon,
		StudentModal,
		PreviewImg
	},
	setup() {
		const studentRef = ref();
		const state = reactive({
			uris: {
				page: getStudentPageApi,
				delete: deleteStudentApi
			},
			configObj: {
				title: '学生',
				createPath: createStudentApi,
				updatePath: updateStudentApi,
				viewPath: viewStudentApi
			},
			collegeList: []
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
			parentRef: studentRef
		});
		const getCollegeList = () => {
			getAction(getCollegeMajorListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.collegeList = res.data;
				}
			})
		};
		onMounted(() => {
			getCollegeList();
		});
		return {
			studentRef,
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
}
</script>

<style scoped lang='scss'>
	.student-container{
		padding: 20px;
		overflow: auto;
	}
</style>
