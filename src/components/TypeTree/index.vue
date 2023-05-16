<template>
	<div class='type-tree-container'>
		<el-button v-if='props.hasOperateAuth' type='primary' @click='clickAddNode("", "add", $event)'>新增根分类</el-button>
		<el-tree
			:data='state.dataList'
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
					{{ node.label }}
					<SvgIcon v-if='props.hasOperateAuth && node.level <= 1' name='ele-Plus' @click='clickAddNode(node, "add", $event)'></SvgIcon>
					<SvgIcon v-if='props.hasOperateAuth' name='ele-Edit' @click='clickAddNode(node, "edit", $event)'></SvgIcon>
					<SvgIcon v-if='props.hasOperateAuth && node.childNodes.length === 0' class='delete-icon'  name='ele-Delete' @click='clickDeleteNode(node, $event)'></SvgIcon>
				</span>
			</template>
		</el-tree>
		<TypeTreeModal
			:title='props.title'
			:update-path='props.updatePath'
			:create-path='props.createPath'
			ref='typeTreeModalRef'
			@refreshList='getTreeList'/>
	</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
import { getAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { ElMessage } from 'element-plus';
import TypeTreeModal from './typeTreeModal.vue';

const props = defineProps({
	deletePath: {
		type: String,
		required: true,
	},
	getListPath: {
		type: String,
		required: true,
	},
	createPath: {
		type: String,
		required: true
	},
	updatePath: {
		type: String,
		required: true
	},
	title: {
		type: String
	},
	hasOperateAuth: {
		type: Boolean,
		default: true
	},
	defaultNode: {
		type: String,
		default: ''
	}
});

const emits = defineEmits(['clickNode']);
const typeTreeModalRef = ref();
const state = reactive({
	dataList: [],
	currentNode: null,
});
const getTreeList = () => {
	getAction(props.getListPath, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.dataList = res.data;
			if (res.data.length) {
				if (!props.defaultNode) {
					state.currentNode = res.data[0].id;
					emits('clickNode', {
						node: res.data[0],
						dataList: state.dataList,
					});
				} else {
					state.currentNode = props.defaultNode;
				}
			}
		}
	});
};
const clickAddNode = (data, type, e) => {
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
	typeTreeModalRef.value.openDialog(map);
};
const clickDeleteNode = (data, e) => {
	e.stopPropagation();
	getAction(props.deletePath + '/' + data.data.id, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			ElMessage.success(res.message);
			getTreeList();
		}
	});
};
const clickNode = (data) => {
	state.currentNode = data.id;
	emits('clickNode', {
		node: data.data,
		dataList: state.dataList
	})
}
onMounted(() => {
	getTreeList();
});
</script>

<style scoped lang='scss'>
.type-tree-container{
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
