<template>
	<div class='pagination-common-container'>
		<el-pagination
			@size-change="changePageSize"
			@current-change="changePageIndex"
			class="mt15"
			:pager-count="5"
			:page-sizes="paginationSizeList"
			v-model:current-page="props.pageInfo.pageIndex"
			background
			v-model:page-size="props.pageInfo.pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="pageInfo.totalRecords"
		/>
	</div>
</template>

<script lang='ts' setup>
	import { paginationSizeList } from '/@/common/pageCommonConfig';

	const props = defineProps({
		pageInfo: {
			type: Object,
			required: true
		}
	});
	const emits = defineEmits([
		'changePageSize', 'changePageIndex'
	]);
	const changePageIndex = (index: number) => {
		emits('changePageIndex', index);
	};
	const changePageSize = (size: number) => {
		emits('changePageSize', size);
	};
</script>

<style scoped>

</style>
