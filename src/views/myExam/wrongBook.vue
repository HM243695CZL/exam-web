<template>
	<div class='wrong-book-container' ref='wrongBookRef'>
		<div class='hidden-sm-and-down'>
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
				<vxe-column title='操作'>
					<template #default='scope'>
						<el-button size='small' type='default' @click="clickViewWrong(scope.row.questionId)">查看错题</el-button>
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
				<div class='card-item' v-for='(item, index) in dataList' :key='item.id'>
					<div class='question-name'>
						<div class='index-number'>{{index + 1}}. </div>
						<div class='question-name-text' v-html='item.questionName'></div>
						<div class='score'>{{item.wrongCount}}</div>
					</div>
					<div class='question-item-list'>
						<div :class='["question-item", item.correctAnswerId === e.id ? "active" : ""]' v-for='(e, i) in item.questionItemList' :key='e.id'>
							<span class='option-item'>{{itemIndex[i]}}.</span><span v-html='e.name'></span>
						</div>
					</div>
					<div class='analysis'>
						解析：
						<div class='analysis-html' v-html='item.analysis'></div>
					</div>
				</div>
			</div>
		</div>
		<WrongBookModal ref='wrongBookModalRef' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { getWrongBookPageApi } from '/@/api/exam/wrongBook';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import WrongBookModal from './component/wrongBookModal.vue';

export default defineComponent({
	name: 'wrongBook',
	components: {
		CommonTop,
		PaginationCommon,
		WrongBookModal
	},
	setup() {
		const wrongBookRef = ref();
		const wrongBookModalRef = ref();
		const state = reactive({
			uris: {
				page: getWrongBookPageApi
			},
			itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
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
		const clickViewWrong = questionId => {
			wrongBookModalRef.value.openDialog(questionId);
		};
		return {
			...toRefs(state),
			wrongBookRef,
			wrongBookModalRef,
			clickViewWrong,

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
		.card-list{
			.card-item{
				padding: 10px;
				box-shadow: 0 0 12px rgba(0, 0, 0, .12);
				margin-bottom: 15px;
				.question-name{
					display: flex;
					justify-content: space-between;
					color: #126ac6;
					padding: 10px 0;
					.index-number{
						width: 20px;
						margin-top: 3px;
					}
					.question-name-text{
						flex: 1;
						padding-right: 5px;
						line-height: 25px;
						::v-deep p{
							display: inline-block;
							color: #000;
						}
					}
					.score{
						color: #fff;
						width: 20px;
						height: 20px;
						border-radius: 50%;
						background: #dd4a68;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
				.question-item-list{
					margin-left: 40px;
					.question-item{
						padding: 10px 0;
						display: flex;
						align-items: flex-start;
						&.active{
							color: #dd4a68;
						}
						.option-item{
							margin-right: 3px;
						}
						::v-deep {
							img{
								width: 100px;
								height: 100px;
							}
							p{
								display: inline-block;
							}
						}
					}
				}
				.analysis{
					padding: 10px 0;
					margin-left: 20px;
					color: #f40;
					line-height: 25px;
					.analysis-html{
						margin-left: 10px;
						margin-top: 10px;
						:deep(img) {
							display: block;
							width: 100%;
							height: auto;
						}
					}
				}
			}
		}
	}
</style>
