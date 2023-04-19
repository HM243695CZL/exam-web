<template>
	<div class='dept-container'>
		<CommonTop @clickAdd="clickAdd" />
		<vxe-table
			border='inner'
			:data='dataList'
			align='left'
			:stripe='false'
			:tree-config='{
        rowField: "id"
      }'
		>
			<vxe-column field='name' title='部门名称' tree-node />
			<vxe-column field='remark' title='备注'/>
			<vxe-column title="操作" width="200">
				<template #default="scope">
					<el-button size="small" type="default" @click="clickEdit(scope.row.id)">修改</el-button>
					<el-button v-if='scope.row.children.length === 0' size="small" type="danger" @click="clickDelete(scope.row.id)">删除</el-button>
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
			<DeptModal
				ref='childRef'
				:dept-list='dataList'
			/>
		</CommonModal>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';
import useCrud from '/@/hooks/useCrud';
import { createDeptApi, deleteDeptApi, getDeptListApi, updateDeptApi, viewDeptApi } from '/@/api/system/dept';
import CommonTop from '/@/components/CommonTop/index.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import DeptModal from './component/dept/deptModal.vue';

export default defineComponent({
	name: 'dept',
	components: {
		CommonTop,
		CommonModal,
		DeptModal
	},
	setup() {
		const state = reactive({
			uris: {
				page: getDeptListApi,
				pageMethod: 'get',
				delete: deleteDeptApi
			},
			configObj: {
				title: '部门',
				createPath: createDeptApi,
				updatePath: updateDeptApi,
				viewPath: viewDeptApi
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
		});
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
});
</script>

<style scoped lang='scss'>
	.dept-container{
		padding: 20px;
		overflow: auto;
	}
</style>
