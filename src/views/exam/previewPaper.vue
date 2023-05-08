<template>
	<div class='preview-paper-container h100'>
		<div class='paper-name'>{{paperInfo.paper.name}}</div>
		<div class='question-content'>
			<div class='big-list' v-for='item in paperInfo.questionBigList' :key='item.bigId'>
				<div class='big-question-name'>
					{{item.bigName}}(共{{item.questionList.length}}题，合计{{item.questionScore}}分)
				</div>
				<div class='question-list'>
					<div class='question-list-row' v-for='(ele, index) in item.questionList' :key='ele.id'>
						<div class='question-name'>
							<div class='index-number'>{{index + 1}}. </div>
							<div class='question-name-text' v-html='ele.question'></div>
							<div class='score'>({{ele.score}}分)</div>
						</div>
						<div class='question-item-list'>
							<div class='question-item' v-for='(e, i) in ele.questionItemList' :key='e.id'>
								{{itemIndex[i]}}.<span v-html='e.name'></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { getAction } from '/@/api/common';
import { previewPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import other from '/@/utils/other';

export default defineComponent({
	name: 'previewPaper',
	setup() {
		const state = reactive({
			id: '',
			paperInfo: {
				paper: {},
				questionBigList: []
			} as any,
			itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
		});
		const getPaperInfo = () => {
			getAction(previewPaperApi + '/' + state.id, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const { paper, questionBigList } = res.data;
					state.paperInfo.paper = paper;
					state.paperInfo.questionBigList = questionBigList;
				}
			})
		}
		onMounted(() => {
			const urlMap = other.params2Obj(window.location.href) as any;
			state.id = urlMap.id;
			getPaperInfo();
		})
		return {
			...toRefs(state)
		}
	}
});
</script>

<style scoped lang='scss'>
	.preview-paper-container{
		.paper-name{
			height: 70px;
			line-height: 70px;
			text-align: center;
			font-weight: 700;
			font-size: 24px;
			background: #fff;
		}
		.question-content{
			height: calc(100% - 70px);
			overflow-y: scroll;
			background: #f5f5f5;
			padding: 15px;
			.big-list{
				width: 70%;
				margin: -1px auto;
				border: 1px solid #ccc;
				.big-question-name{
					padding: 15px;
					border-bottom: 1px solid #ccc;
				}
				.question-list{
					background: #fff;
					padding: 10px;
					.question-list-row{
						.question-name{
							display: flex;
							justify-content: space-between;
							margin-left: 40px;
							color: #126ac6;
							padding: 10px 0;
							.index-number{
								width: 20px;
							}
							.question-name-text{
								flex: 1;
								padding-right: 20px;
								::v-deep p{
									display: inline-block;
									color: #000;
								}
							}
							.score{
								width: 80px;
								color: #000;
								padding-right: 40px;
							}
						}
						.question-item-list{
							margin-left: 60px;
							.question-item{
								padding: 10px 0;
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
					}
				}
			}
		}
	}
</style>
