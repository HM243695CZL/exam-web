<template>
	<div class="role-container h100" ref="roleRef">
		<CommonTop
			@clickSearch="clickSearch"
			@clickReset="clickReset"
			@clickAdd="clickAdd"
		>
			<template #left>
				<el-form-item label="角色名称">
					<el-input v-model="searchParams.name" placeholder="请输入角色名称" clearable></el-input>
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
			<vxe-column title="角色名称" field="name" />
			<vxe-column title="角色key" field="key">
				<template #default="scope">
					<el-tag>{{scope.row.key}}</el-tag>
				</template>
			</vxe-column>
			<vxe-column title="角色描述" field="desc" />
			<vxe-column title="角色状态" field="enabled">
				<template #default="scope">
					<el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
					<el-tag type="info" v-else>禁用</el-tag>
				</template>
			</vxe-column>
			<vxe-column title="创建时间" field="addTime" />
			<vxe-column title="操作" width="200">
				<template #default="scope">
					<el-button size='small' type='default' @click="clickAuth(scope.row.id)">授权</el-button>
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
		<CommonModal
			ref='modalFormRef'
			:title='configObj.title'
			:create-path='configObj.createPath'
			:update-path='configObj.updatePath'
			:view-path='configObj.viewPath'
			@refreshList='getDataList'
		>
			<RoleModal ref='childRef' />
		</CommonModal>
		<AuthModal
			ref="authModalRef"
			:menu-list="menuList"
		/>
	</div>
</template>

<script lang="ts">

import {onMounted, reactive, ref, toRefs} from 'vue';
import { createRoleApi, deleteRoleApi,
	getRolePageApi, updateRoleApi, viewRoleApi } from '/@/api/system/role';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import RoleModal from './component/role/roleModal.vue';
import AuthModal from './component/role/authModal.vue';
import {getAction} from '/@/api/common';
import {StatusEnum} from '/@/common/status.enum';
import {getMenuListApi} from '/@/api/system/menu';

export default {
	name: 'role',
	components: {
		CommonTop,
		PaginationCommon,
		CommonModal,
		RoleModal,
		AuthModal
	},
	setup() {
		const roleRef = ref();
		const authModalRef = ref();
		const state = reactive({
			uris: {
				page: getRolePageApi,
				delete: deleteRoleApi
			},
			menuList: [],
			configObj: {
				title: '博客',
				createPath: createRoleApi,
				updatePath: updateRoleApi,
				viewPath: viewRoleApi
			},
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
			parentRef: roleRef
		});
		const getMenuList = () => {
			getAction(getMenuListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.menuList = res.data;
				}
			})
		};
		const clickAuth = (id: string) => {
			authModalRef.value.openDialog(id);
		};
		onMounted(() => {
			getMenuList();
		});
		return {
			roleRef,
			authModalRef,
			clickAuth,
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

<style scoped lang="scss">
.role-container{
	padding: 20px;
	overflow: auto;
}
</style>
