<template>
	<div class='wrong-book-container' ref='wrongBookRef'>
		<CommonTop
			@clickSearch="clickSearch"
			@clickReset="clickReset"
			:button-auth='["searchBtn", "resetBtn"]'
		>
			<template #left>
				<el-form-item label="题目">
					<el-input v-model="searchParams.name" placeholder="请输入题目" clearable></el-input>
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
			<vxe-column title="试题名称" field='questionName' type='html'/>
			<vxe-column title="出错次数" field='wrongCount'/>
		</vxe-table>
		<PaginationCommon
			:page-info='pageInfo'
			@changePageSize='changePageSize'
			@changePageIndex='changePageIndex'
		/>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { getWrongBookPageApi } from '/@/api/exam/wrongBook';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';

export default defineComponent({
	name: 'wrongBook',
	components: {
		CommonTop,
		PaginationCommon,
	},
	setup() {
		const wrongBookRef = ref();
		const state = reactive({
			uris: {
				page: getWrongBookPageApi
			}
		});
		const {
			tableRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			getDataList,
			clickSearch,
			clickReset,
			changePageIndex,
			changePageSize
		} = useCrud({
			uris: state.uris,
			parentRef: wrongBookRef
		});
		return {
			...toRefs(state),
			wrongBookRef,

			tableRef,
			pageInfo,
			dataList,
			tableHeight,
			searchParams,
			getDataList,
			clickSearch,
			clickReset,
			changePageIndex,
			changePageSize
		}
	}
});
</script>

<style scoped lang='scss'>
	.wrong-book-container{
		padding: 20px;
	}
</style>
