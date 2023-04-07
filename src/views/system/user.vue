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
			<vxe-column type='seq' title='序号' width='60' />
			<vxe-column title='用户名称' field='username' />
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
			}
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
		const clickUpdatePass = (id: string) => {
			updatePassRef.value.openDialog(id);
		};
		onMounted(() => {
			getRoleList();
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
}
</style>
