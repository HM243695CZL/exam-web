<template>
	<div class='examining-container h100'>
		<div class='paper-name'>{{paperInfo.paper.name}}</div>
		<div class='content-box'>
			<div class='question-area h100'>
				<div class='question-info h100'>
					<div class='head'>
						{{currentBigInfo.bigName}}(共{{currentBigInfo.questionList.length}}题，合计{{currentBigInfo.questionScore}}分)
					</div>
					<div class='question-list'>
						<div class='question-title'>
							<div class='index-number'>{{currentQuestionIndex + 1}}. </div>
							<div class='question-name' v-html='currentQuestionInfo.question'></div>
						</div>
						<div class='list-item-box'>
							<div class='list-item' v-for='(item, index) in currentQuestionInfo.questionItemList' :key='item.id'>
								<el-radio-group v-model='chooseAnswer'>
									<el-radio  :label="itemIndex[index] + '. '" size="large"></el-radio>
								</el-radio-group>
								<span class='item' v-html='item.name'></span>
							</div>
						</div>
					</div>
					<div class='btn-box'>
						<el-button type='default' @click='changeQuestion("prev")'>上一题</el-button>
						<el-button type='default' @click='changeQuestion("next")'>下一题</el-button>
					</div>
				</div>
				<div class='answer-card h100'>
					<div class='head'>
						剩余时间：<span class='count-down'>00 : 30 : 00</span>
					</div>
					<div class='answer-status'>
						<div class='status-item'>
							已做 <div class='circle done'></div>
						</div>
						<div class='status-item'>
							正在做 <div class='circle doing'></div>
						</div>
						<div class='status-item'>
							未做 <div class='circle'></div>
						</div>
					</div>
					<div class='big-title-card'>
						<div class='big-title' v-for='(item, index) in paperInfo.questionBigList' :key='item.bigId'>
							<div class='big-name'>{{item.bigName}}(共{{item.questionList.length}}题，合计{{item.questionScore}}分)</div>
							<div class='big-item'>
								<div :class='["question-circle", (index === currentBigIndex && i === currentQuestionIndex) ? "active" : ""]'
										 @click='clickAnswerCardIndex(index, i)'
										 v-for='(ele, i) in item.questionList.length' :key='ele'>{{i + 1}}</div>
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
import { ElMessage } from 'element-plus';

export default defineComponent({
	name: 'examining',
	setup() {
		const state = reactive({
			id: '',
			paperInfo: {
				paper: {},
				questionBigList: []
			} as any,
			itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
			currentBigInfo: {
				questionList: []
			} as any,
			currentQuestionInfo: {
				questionItemList: []
			} as any,
			chooseAnswer: '',
			answerList: [],
			currentBigIndex: 0,
			currentQuestionIndex: 0
		});
		const getPaperInfo = () => {
			getAction(previewPaperApi + '/' + state.id, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const { paper, questionBigList } = res.data;
					state.paperInfo.paper = paper;
					state.paperInfo.questionBigList = questionBigList;
					if (questionBigList.length) {
						state.currentBigInfo = questionBigList[0];
						state.currentQuestionInfo = questionBigList[0].questionList[0];
					}
				}
			})
		};
		const changeQuestion = type => {
			if (type === 'prev') {
				if (state.currentQuestionIndex === 0) {
					if (state.currentBigIndex === 0) {
						ElMessage.warning('没有上一题了');
						return false;
					}
					// 切换到上一个大题
					state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex - 1];
					state.currentQuestionInfo = state.currentBigInfo.questionList[state.currentBigInfo.questionList.length - 1];
					state.currentBigIndex -= 1;
					state.currentQuestionIndex = state.currentBigInfo.questionList.length - 1;
				} else {
					state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex - 1];
					state.currentQuestionIndex -= 1;
				}
			} else {
					if (state.paperInfo.questionBigList[state.currentBigIndex].questionList.length - 1 <= state.currentQuestionIndex) {
						if (state.currentBigIndex + 1 >= state.paperInfo.questionBigList.length) {
							ElMessage.warning('没有下一题了');
							return false;
						} else {
							// 切换到下一个大题
							state.currentBigInfo = state.paperInfo.questionBigList[state.currentBigIndex + 1];
							state.currentQuestionInfo = state.currentBigInfo.questionList[0];
							state.currentBigIndex += 1;
							state.currentQuestionIndex = 0;
						}
				} else {
					state.currentQuestionInfo = state.paperInfo.questionBigList[state.currentBigIndex].questionList[state.currentQuestionIndex + 1];
					state.currentQuestionIndex += 1;
				}
			}
		};
		const clickAnswerCardIndex = (index, i) => {
			state.currentBigIndex = index;
			state.currentQuestionIndex = i;
			state.currentBigInfo = state.paperInfo.questionBigList[index];
			state.currentQuestionInfo = state.currentBigInfo.questionList[i];
		};
		onMounted(() => {
			const urlMap = other.params2Obj(window.location.href) as any;
			state.id = urlMap.id;
			getPaperInfo();
		})
		return {
			...toRefs(state),
			changeQuestion,
			clickAnswerCardIndex
		}
	}
});
</script>

<style scoped lang='scss'>
	.examining-container{
		.paper-name{
			height: 70px;
			line-height: 70px;
			text-align: center;
			font-weight: 700;
			font-size: 24px;
			background: #fff;
		}
		.content-box{
			height: calc(100% - 70px);
			background: #f5f5f5;
			padding: 20px;
			.question-area{
				width: 90%;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.head{
					height: 60px;
					line-height: 60px;
					border-bottom: 1px solid #f1f1f1;
					padding: 0 20px;
					box-sizing: border-box;
				}
				.question-info{
					background: #fff;
					flex: 1;
					position: relative;
					.head{
						font-size: 20px;
						font-weight: 700;
					}
					.question-list{
						padding: 0 20px;
						.question-title{
							display: flex;
							justify-content: flex-start;
							align-items: flex-start;
							margin-left: 20px;
							font-weight: 700;
							padding: 10px 0;
							.index-number{
								margin-right: 8px;
								margin-top: 1px;
							}
							.question-name{
								color: #126ac6;
								::v-deep p{
									display: inline-block;
									color: #000;
								}
							}
						}
						.list-item-box{
							margin-left: 40px;
							.list-item{
								display: flex;
								justify-content: flex-start;
								align-items: center;
								color: #000;
								.item{
									margin-left: 5px;
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
					.btn-box{
						position: absolute;
						bottom: 20px;
						left: 20px;
					}
				}
				.answer-card{
					width: 350px;
					background: #fff;
					margin-left: 20px;
					.head{
						.count-down{
							text-space: 2px;
							color: #f00;
						}
					}
					.answer-status{
						display: flex;
						justify-content: center;
						justify-items: center;
						padding: 10px;
						.status-item{
							display: flex;
							align-items: center;
							.circle{
								margin-left: 4px;
								margin-right: 10px;
								width: 16px;
								height: 16px;
								border-radius: 50%;
								border: 1px solid #ccc;
								&.done{
									background: #126ac6;
								}
								&.doing{
									border-color: #126ac6;
								}
							}
						}
					}
					.big-title-card{
						padding: 10px 20px;
						.big-title{
							font-weight: 700;
							margin-bottom: 10px;
							.big-item{
								display: flex;
								justify-items: flex-start;
								flex-wrap: nowrap;
								padding: 10px 0;
								.question-circle{
									cursor: pointer;
									font-weight: 400;
									display: flex;
									justify-content: center;
									align-items: center;
									width: 26px;
									height: 26px;
									margin-right: 10px;
									border-radius: 50%;
									border: 1px solid #ccc;
									&.active, &:hover{
										border-color: #126ac6;
										color: #126ac6;
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