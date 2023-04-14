<template>
	<div class='college-tree'>
		<div class='title'>学院/专业管理</div>
		<el-button type='primary' @click='clickAddCollege("", "add", $event)'>新增学院</el-button>
		<el-tree
			:data='state.collegeMajorList'
			node-key='id'
			default-expand-all
			highlight-current
			:current-node-key='state.currentNode'
			:props='{
				label: "name"
			}'
		>
			<template #default='{node}'>
				<span class='node-text' @click='clickNode(node)'>
					{{node.label}}
					<SvgIcon v-if='node.level <= 1' name='ele-Plus' @click='clickAddCollege(node, "add", $event)'></SvgIcon>
					<SvgIcon name='ele-Edit' @click='clickAddCollege(node, "edit", $event)'></SvgIcon>
					<SvgIcon class='delete-icon' v-if='node.childNodes.length === 0' name='ele-Delete' @click='clickDeleteCollege(node, $event)'></SvgIcon>
				</span>
			</template>
		</el-tree>
		<CollegeMajorModal ref='collegeMajorModalRef' @refreshList='getCollegeMajorList' />
	</div>
</template>

<script lang='ts' setup>
import {
	createCollegeMajorApi, deleteCollegeMajorApi,
	getCollegeMajorListApi,
	updateCollegeMajorApi,
	viewCollegeMajorApi,
} from '/@/api/system/class-mng';
import CollegeMajorModal from './collegeMajorModal.vue';
import { onMounted, reactive, ref } from 'vue';
import { getAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';

const emits = defineEmits(['clickNode']);

const collegeMajorModalRef = ref();
const state = reactive({
	collegeMajorList: [],
	configTreeObj: {
		title: '学院/专业',
		createPath: createCollegeMajorApi,
		updatePath: updateCollegeMajorApi,
		viewPath: viewCollegeMajorApi
	},
	currentNode: null
});
const getCollegeMajorList = () => {
	getAction(getCollegeMajorListApi, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.collegeMajorList = res.data;
			if (res.data.length) {
				state.currentNode = res.data[0].id;
				emits('clickNode', {
					node: res.data[0],
					collegeList: state.collegeMajorList
				});
			}
		}
	})
};

const clickAddCollege = (data, type, e) => {
	e.stopPropagation();
	const map = {
		id: '',
		name: '',
		parentId: '',
		parentName: ''
	}
	if (!data) {
		// 添加根节点
		map.parentName = '根节点';
	} else if (type === 'add') {
		// 添加子节点
		map.parentId = data.data.id;
		map.parentName = data.data.name;
	} else {
		// 编辑
		map.id = data.data.id;
		map.name = data.data.name;
		if (data.level === 1) {
			map.parentId = '';
			map.parentName = '根节点';
		} else {
			map.parentId = data.parent.data.id;
			map.parentName = data.parent.data.name;
		}
	}
	collegeMajorModalRef.value.openDialog(map);
};

const clickDeleteCollege = (data, e) => {
	e.stopPropagation();
	getAction(deleteCollegeMajorApi + '/' + data.data.id, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			ElMessage.success(res.message);
			getCollegeMajorList();
		}
	})
};
const clickNode = (data) => {
	state.currentNode = data.id;
	emits('clickNode', {
		node: data.data,
		collegeList: state.collegeMajorList
	});
};
onMounted(() => {
	getCollegeMajorList();
});

</script>

<style scoped lang='scss'>
	.college-tree{
		.title{
			font-weight: 700;
			margin: 10px 0;
		}
		.node-text{
			.el-icon{
				margin-right: 5px;
				&:hover{
					color: #126ac6;
				}
			}
			.delete-icon{
				color: #f40;
			}
		}
	}
</style>
