<template>
	<div class="user-container h100" ref='userRef'>
		<CommonTop
			@clickSearch='clickSearch'
			@clickReset='clickReset'
			@clickAdd="clickAdd"
		>
			<template #left>
				<el-form-item label='用户名'>
					<el-input v-model='searchParams.username' size='default' placeholder='请输入用户名' clearable></el-input>
				</el-form-item>
				<el-form-item label='用户类型'>
					<el-select v-model='searchParams.userType' placeholder='请选择用户类型' clearable>
						<el-option :value='1' label='老师'></el-option>
						<el-option :value='2' label='学生'></el-option>
					</el-select>
				</el-form-item>
			</template>
		</CommonTop>
		<div class='table-box'>
			<vxe-table
				ref='tableRef'
				:row-config='{
				useKey: true,
				keyField: "id"
			}'
				:data='dataList'
				:max-height='tableHeight'
			>
				<vxe-column type='seq' title='序号' width='60' />
				<vxe-column title='用户名称' field='username' />
				<vxe-column title='用户类型' field='userType'>
					<template #default='scope'>
						{{scope.row.userType === 1 ? '老师' : '学生'}}
					</template>
				</vxe-column>
				<vxe-column title='部门' field='deptName' />
				<vxe-column title='学院' field='collegeName' />
				<vxe-column title='专业' field='majorName' />
				<vxe-column title='班级' field='className' />
				<vxe-column title='用户头像'>
					<template #default='scope'>
						<PreviewImg :img-url='scope.row.avatar' />
					</template>
				</vxe-column>
				<vxe-column title='关联角色'>
					<template #default='scope'>
						<el-tag v-for='item of scope.row.roles' :key='item'>{{item}}</el-tag>
					</template>
				</vxe-column>
				<vxe-column title='创建时间' field='addTime' />
				<vxe-column title='操作' width='260'>
					<template #default='scope'>
						<el-button size='small' type='default' @click='clickUpdatePass(scope.row.id)'>修改密码</el-button>
						<el-button size='small' type='default' @click="clickEdit(scope.row.id)">修改</el-button>
						<el-button size='small' type='danger' @click='clickDelete(scope.row.id)'>删除</el-button>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
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
			<UserModal
				ref='childRef'
				:role-list="roleList"
				:college-list='collegeList'
				:dept-list='deptList'
			/>
		</CommonModal>
		<UpdatePassModal
			ref='updatePassRef'
		/>
	</div>
</template>

<script lang="ts">
import useCrud from '/@/hooks/useCrud';
import {onMounted, reactive, ref, toRefs} from 'vue';
import { createUserApi, deleteUserApi,
	getUserPageApi, updateUserApi, viewUserApi } from '/@/api/system/user';
import PreviewImg from '/@/components/previewImg/index.vue';
import CommonTop from '/@/components/CommonTop/index.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import UserModal from './component/user/userModal.vue';
import UpdatePassModal from './component/user/updatePassModal.vue';
import {getAction} from '/@/api/common';
import {getRoleListApi} from '/@/api/system/role';
import {StatusEnum} from '/@/common/status.enum';
import { getCollegeMajorListApi } from '/@/api/system/class-mng';
import { getDeptListApi } from '/@/api/system/dept';

export default {
	name: 'user',
	components: {
		PreviewImg,
		CommonTop,
		PaginationCommon,
		UserModal,
		CommonModal,
		UpdatePassModal
	},
	setup() {
		const userRef = ref();
		const updatePassRef = ref();
		const state = reactive({
			uris: {
				page: getUserPageApi,
				delete: deleteUserApi
			},
			roleList: [],
			configObj: {
				title: '用户',
				createPath: createUserApi,
				updatePath: updateUserApi,
				viewPath: viewUserApi
			},
			collegeList: [],
			deptList: [],
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
			parentRef: userRef
		});
		const getRoleList = () => {
			getAction(getRoleListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.roleList = res.data;
				}
			})
		};
		const getCollegeList = () => {
			getAction(getCollegeMajorListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.collegeList = res.data;
				}
			})
		};
		const clickUpdatePass = (id: string) => {
			updatePassRef.value.openDialog(id);
		};
		const getDeptList = () => {
			getAction(getDeptListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.deptList = res.data;
				}
			});
		};
		onMounted(() => {
			getRoleList();
			getCollegeList();
			getDeptList();
		});
		return {
			userRef,
			updatePassRef,
			...toRefs(state),
			clickUpdatePass,

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
.user-container{
	padding: 20px;
	overflow: auto;
	.table-box{
		margin-top: 20px;
	}
}
</style>
