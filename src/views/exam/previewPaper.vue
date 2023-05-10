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
						<div class='view-answer' v-if='examId'>
							<div class='your-answer'>
								你的答案：<span>{{ele.currentUserAnswer}}</span>
								<div class='result'>
									<div class='yes' v-if='ele.answer === ele.currentUserAnswer'>
										<img src='src/assets/img/all-right.png' alt=''>
									</div>
									<div class='no' v-else>
										<img src='src/assets/img/fork.png' alt=''>
									</div>
								</div>
							</div>
							<div class='correct-answer'>
								正确答案：<span>{{ele.answer}}</span>
							</div>
							<div class='analysis'>
								解析：
								<div class='analysis-html' v-html='ele.analysis'></div>
							</div>
						</div>
						<div class='exam-result'>
							<div class='paper-score'>
								试卷总分：<span class='number'>{{paperInfo.paper.score}}</span>分
							</div>
							<div class='exam-score'>
								考试得分：<span class='number'>{{examInfo.score}}</span>分
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
import { previewPaperApi, viewPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import other from '/@/utils/other';
import { viewRecordApi } from '/@/api/exam/record';

export default defineComponent({
	name: 'previewPaper',
	setup() {
		const state = reactive({
			paperId: '',
			paperInfo: {
				paper: {},
				questionBigList: []
			} as any,
			itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
			status: '0',
			examId: '',
			examInfo: {} as any
		});
		const getPaperInfo = () => {
			getAction((state.status === '1' ? viewPaperApi : previewPaperApi) + '/' + state.paperId, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const { paper, questionBigList } = res.data;
					state.paperInfo.paper = paper;
					state.paperInfo.questionBigList = questionBigList;
				}
			})
		};
		const getRecordInfo = () => {
			getAction(viewRecordApi + '/' + state.examId, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					state.examInfo = res.data;
				}
			});
		}
		onMounted(() => {
			const urlMap = other.params2Obj(window.location.href) as any;
			state.paperId = urlMap.paperId;
			state.status = urlMap.status;
			state.examId = urlMap.examId;
			getPaperInfo();
			if (state.examId) {
				getRecordInfo();
			}
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
								margin-top: 3px;
							}
							.question-name-text{
								flex: 1;
								padding-right: 20px;
								line-height: 25px;
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
						.your-answer{
							padding: 10px 0;
							margin-left: 50px;
							display: flex;
							align-items: center;
							span{
								color: #f40;
							}
							.result{
								margin-left: 240px;
								.yes{
									font-size: 30px;
									color: #3eaf7c;
								}
								.no{
									font-size: 30px;
									color: #dd4a68;
								}
								img{
									width: 100px;
									height: 100px;
								}
							}
						}
						.correct-answer{
							padding: 10px 0;
							margin-left: 50px;
							span{
								color: #126ac6;
							}
						}
						.analysis{
							padding: 10px 0;
							margin-left: 50px;
							color: #f40;
							.analysis-html{
								margin-left: 10px;
								margin-top: 10px;
							}
						}
					}
				}
			}
		}
		.exam-result{
			position: fixed;
			top: 85px;
			right: 20px;
			padding: 20px;
			border: 1px solid #f1f1f1;
			background: #fff;
			.paper-score{
				.number{
					color: #126ac6;
					font-size: 20px;
					margin: 0 5px;
				}
			}
			.exam-score{
				margin-top: 10px;
				.number{
					color: #f40;
					font-size: 20px;
					margin: 0 5px;
				}
			}
		}
	}
</style>
