<template>
	<div class='student-container h100'>
		<div class='box h100'>
			<div class='tree-box h100'>
				<div class='title'>学院/专业管理</div>
				<el-button type='primary' @click='clickAddCollege'>新增学院</el-button>
				<el-tree
					:data='collegeMajorList'
					node-key='id'
					:props='{
						label: "name"
					}'
				>
					<template #default='{node}'>
						<span>
							{{node.label}}
							<SvgIcon v-if='!node.parentId' name='ele-Plus'></SvgIcon>
						</span>
					</template>
				</el-tree>
			</div>
			<div class='content-box h100'>
				list
			</div>
		</div>
		<CommonModal
			ref='modalFormRef'
			:title='configTreeObj.title'
			:create-path='configTreeObj.createPath'
			:update-path='configTreeObj.updatePath'
			:view-path='configTreeObj.viewPath'
		>
			<CollegeMajorModal ref='childRef'/>
		</CommonModal>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import CollegeMajorModal from './component/student/collegeMajorModal.vue';
import CommonModal from '/@/components/CommonModal/index.vue';
import {
	createCollegeMajorApi,
	getCollegeMajorListApi,
	updateCollegeMajorApi,
	viewCollegeMajorApi,
} from '/@/api/system/student';
import { getAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';

export default defineComponent({
	name: 'student',
	components: {
		CollegeMajorModal,
		CommonModal
	},
	setup() {
		const collegeMajorModalRef = ref();
		const state = reactive({
			collegeMajorList: [],
			configTreeObj: {
				title: '学院/专业',
				createPath: createCollegeMajorApi,
				updatePath: updateCollegeMajorApi,
				viewPath: viewCollegeMajorApi
			}
		});
		const clickAddCollege = () => {

		};
		const getCollegeMajorList = () => {
			getAction(getCollegeMajorListApi, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.collegeMajorList = res.data;
				}
			})
		};
		onMounted(() => {
			getCollegeMajorList();
		});
		return {
			...toRefs(state),
			collegeMajorModalRef,
			clickAddCollege,
			getCollegeMajorList,
		}
	}
});
</script>

<style scoped lang='scss'>
	.student-container{
		padding: 20px;
		overflow: auto;
		.box{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.tree-box{
				width: 320px;
				.title{
					font-weight: 700;
					margin: 10px 0;
				}
			}
			.content-box{
				flex: 1;
			}
		}
	}
</style>
