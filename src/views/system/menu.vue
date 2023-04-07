<template>
	<div class="sys-menu-container h100">
		<CommonTop
			@clickAdd="clickAdd"
		/>
		<vxe-table
			border='inner'
			:data='dataList'
			align='left'
			:stripe='false'
			:tree-config='{
        rowField: "id"
      }'
		>
			<vxe-column field='title' title='菜单名称' tree-node />
			<vxe-column field="path" title="路由路径" />
			<vxe-column field="component" title="组件路径" />
			<vxe-column field="roles" title="权限标识" />
			<vxe-column field="isHide" title="是否隐藏">
				<template #default="scope">
					<el-tag>{{scope.row.isHide ? '隐藏' : '显示'}}</el-tag>
				</template>
			</vxe-column>
			<vxe-column field="sort" title="排序" />
			<vxe-column title="操作" width="200">
				<template #default="scope">
					<el-button size="small" type="default" @click="clickEdit(scope.row.id)">修改</el-button>
					<el-button size="small" type="danger" @click="clickDelete(scope.row.id)">删除</el-button>
				</template>
			</vxe-column>
		</vxe-table>
		<CommonModal
			ref='modalFormRef'
			:title='configObj.title'
			:create-path='configObj.createPath'
			:update-path='configObj.updatePath'
			:view-path='configObj.viewPath'
			:modal-width='"800px"'
			@refreshList='getDataList'
		>
			<MenuModal
				ref="childRef"
				:menu-list="dataList"
			/>
		</CommonModal>
	</div>
</template>

<script lang="ts">
import {reactive, toRefs} from 'vue';
import {deleteMenuApi, getMenuListApi,
	createMenuApi, updateMenuApi, viewMenuApi} from '/@/api/system/menu';
import CommonTop from '/@/components/CommonTop/index.vue';
import MenuModal from './component/menu/menuModal.vue';
import CommonModal from '/@/components/CommonModal/index.vue';

import useCrud from '/@/hooks/useCrud';

export default {
	name: 'sys-menu',
	components: {
		MenuModal,
		CommonModal,
		CommonTop
	},
	setup() {
		const state = reactive({
			uris: {
				page: getMenuListApi,
				pageMethod: 'get',
				delete: deleteMenuApi
			},
			configObj: {
				title: '菜单',
				createPath: createMenuApi,
				updatePath: updateMenuApi,
				viewPath: viewMenuApi
			}
		});
		const {
			modalFormRef,
			childRef,
			dataList,
			getDataList,
			clickAdd,
			clickEdit,
			clickDelete
		} = useCrud({
			uris: state.uris,
		})
		return {
			...toRefs(state),

			modalFormRef,
			childRef,
			dataList,
			clickAdd,
			getDataList,
			clickEdit,
			clickDelete
		}
	}
}
</script>

<style scoped lang="scss">
.sys-menu-container{
	padding: 20px;
	overflow: auto;
}
</style>
