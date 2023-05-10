<template>
	<div class='exam-record-container h100' ref='recordRef'>
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
			<vxe-column title="试卷名称" field='paperName'/>
			<vxe-column title="得分" field='score'/>
			<vxe-column title="试卷总分" field='totalScore'/>
			<vxe-column title="交卷时间" field='submitTime'/>
			<vxe-column title="操作" width="140">
				<template #default="scope">
					<el-button size='small' type='default' @click="clickViewPaper(scope.row.id, scope.row.paperId)">查看试卷</el-button>
				</template>
			</vxe-column>
		</vxe-table>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import useCrud from '/@/hooks/useCrud';
import { getRecordPageApi } from '/@/api/exam/record';

export default defineComponent({
	name: 'examRecord',
	setup() {
		const recordRef = ref();
		const state = reactive({
			uris: {
				page: getRecordPageApi
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
			parentRef: recordRef
		});
		const clickViewPaper = (examId, paperId) => {
			const { origin, pathname } = window.location;
			window.open(`${origin}${pathname}#/previewPaper?examId=${examId}&paperId=${paperId}&status=1`);
		};
		return {
			...toRefs(state),
			recordRef,
			clickViewPaper,

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
	.exam-record-container{
		padding: 20px;
	}
</style>
