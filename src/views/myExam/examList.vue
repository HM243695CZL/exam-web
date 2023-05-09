<template>
	<div class='exam-list-container' ref='examListRef'>
		<CommonTop
			@clickSearch="clickSearch"
			@clickReset="clickReset"
			:button-auth='["searchBtn", "resetBtn"]'
		>
			<template #left>
				<el-form-item label="题目">
					<el-input v-model="searchParams.name" placeholder="请输入试卷名称" clearable></el-input>
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
			<vxe-column title="试卷名称" field='name'/>
			<vxe-column title="试题信息" field='questionInfo'/>
			<vxe-column title="总分" field='score'/>
			<vxe-column title="发布时间" field='publishTime'/>
			<vxe-column title="操作" width="140">
				<template #default="scope">
					<el-button size='small' type='default' @click="clickStartExam(scope.row.id)">开始考试</el-button>
				</template>
			</vxe-column>
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
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import { getMyExamPageApi } from '/@/api/exam/paper';

export default defineComponent({
	name: 'examList',
	components: {
		CommonTop,
		PaginationCommon,
	},
	setup() {
		const examListRef = ref();
		const state = reactive({
			uris: {
				page: getMyExamPageApi
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
			parentRef: examListRef
		});
		const clickStartExam = id => {
			const { origin, pathname } = window.location;
			window.open(`${origin}${pathname}#/examining?id=${id}`);
		};
		return {
			...toRefs(state),
			examListRef,
			clickStartExam,

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
	.exam-list-container{
		padding: 20px;
	}
</style>
