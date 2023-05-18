<template>
	<div class='exam-list-container' ref='examListRef'>
		<div class='hidden-sm-and-down'>
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
				<vxe-column title="考试得分" field='examScore'/>
				<vxe-column title="发布时间" field='publishTime'/>
				<vxe-column title="交卷时间" field='submitTime'/>
				<vxe-column title="操作" width="140">
					<template #default="scope">
						<el-button v-if='!scope.row.examScore' size='small' type='default' @click="clickStartExam(scope.row.id)">开始考试</el-button>
						<el-button v-else size='small' type='default' @click="clickViewPaper(scope.row.id)">查看试卷</el-button>
					</template>
				</vxe-column>
			</vxe-table>
			<PaginationCommon
				:page-info='pageInfo'
				@changePageSize='changePageSize'
				@changePageIndex='changePageIndex'
			/>
		</div>
		<div class='hidden-sm-and-up'>
			<div class='card-list'>
				<div class='card-item' v-for='item in dataList' :key='item.id'>
					<div class='title'>{{item.name}}</div>
					<div class='exam-info'>
						<div class='item-info'>
							<div class='row'>试题信息：{{item.questionInfo}}</div>
							<div class='row'>题数：{{item.questionCount}}</div>
							<div class='row'>总分：{{item.score}}</div>
						</div>
						<div class='score' v-if='item.examScore'>得分：<span>{{item.examScore}}</span></div>
					</div>
					<div class='btn-box'>
						<div class='view-exam' v-if='item.examScore'>查看试卷</div>
						<div class='start-exam' v-else @click='clickStartExam(item.id)'>开始考试</div>
					</div>
				</div>
			</div>
		</div>
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
			location.href = `${origin}${pathname}#/examining?id=${id}`;
		};
		const clickViewPaper = id => {
			const { origin, pathname } = window.location;
			location.href = `${origin}${pathname}#/previewPaper?paperId=${id}&isRecord=true`
		};
		return {
			...toRefs(state),
			examListRef,
			clickStartExam,
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
	.exam-list-container{
		padding: 20px;
		.card-list{
			.card-item{
				padding: 10px;
				box-shadow: 0 0 12px rgba(0, 0, 0, .12);
				.title{
					font-weight: 700;
					font-size: 20px;
					padding-bottom: 10px;
					border-bottom: 1px solid #f5f5f5;
				}
				.exam-info{
					padding-top: 5px;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.item-info{
						.row{
							padding: 4px 0;
						}
					}
					.score{
						span{
							font-size: 20px;
							color: #dd4a68;
						}
					}
				}
				.btn-box{
					margin: 10px 0;
					.view-exam, .start-exam{
						width: 90%;
						margin: 0 auto;
						padding: 10px;
						background: #126ac6;
						color: #fff;
						border-radius: 10px;
						text-align: center;
					}
					.start-exam{
						background: #dd4a68;
					}
				}
			}
		}
	}
</style>
