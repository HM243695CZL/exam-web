<template>
	<div class='examining-container h100'>
		<div class='paper-name'>{{paperInfo.paper.name}}</div>
		<div class='content-box'>
			<div class='progress-bar'>
				<el-progress
					:text-inside="true"
					:stroke-width="15"
					:percentage="Math.ceil((Object.keys(answerMap).length / ~~paperInfo.paper.questionCount) * 100) || 0"
					status="exception"
					:duration="10"
				>
					<span>{{Object.keys(answerMap).length}} / {{~~paperInfo.paper.questionCount}}</span>
				</el-progress>
			</div>
			<div class='question-area h100'>
				<div class='question-info h100'>
					<div class='head'>
						{{currentBigInfo.bigName}}(共{{currentBigInfo.questionList.length}}题，合计{{currentBigInfo.questionScore}}分)
					</div>
					<div class='question-list'>
						<div class='question-title'>
							<div class='index-number'>{{currentQuestionIndex + 1}}. </div>
							<div class='question-name' v-html='currentQuestionInfo.question'></div>
							<el-button v-if='currentQuestionInfo.questionUrl' size='small' class='view-origin-q' @click='clickViewOrigin'>查看原题</el-button>
						</div>
						<div class='list-item-box'>
							<div class='list-item' v-for='(item, index) in currentQuestionInfo.questionItemList' :key='item.id'>
								<el-checkbox @change='changeCheckAnswer' v-if='currentQuestionInfo.type === 2' v-model="item.check" :label="itemIndex[index]" />
								<el-radio-group v-else v-model='chooseAnswer' @change='changeAnswer(item.id)'>
									<el-radio  :label="item.id" size="default">{{itemIndex[index] + '. '}}</el-radio>
								</el-radio-group>
								<span :class='["item", currentQuestionInfo.type === 2 ? "check-item" : ""]' v-html='item.name'></span>
							</div>
						</div>
					</div>
					<div class='btn-box'>
						<el-button type='default' size='small' @click='changeQuestion("prev")'>上一题</el-button>
						<el-button type='default' size='small' @click='changeQuestion("next")'>下一题</el-button>
						<el-popconfirm
							width='200'
							title='是否确定退出考试？'
							@confirm="clickConfirmClose"
							@cancel="clickCancelClose"
						>
							<template #reference>
								<el-button class='hidden-sm-and-up' type='default' size='small'>退出考试</el-button>
							</template>
						</el-popconfirm>
						<el-popconfirm
							:width='tipWidth'
							:title='tipTitle'
							@confirm="clickConfirmSubmit"
							@cancel="clickCancelSubmit"
						>
							<template #reference>
								<el-button class='hidden-sm-and-up' type='primary' size='small' @click='clickSubmitPaper'>交卷</el-button>
							</template>
						</el-popconfirm>
					</div>
				</div>
				<div class='answer-card h100 hidden-sm-and-down'>
					<div class='head'>
						剩余时间：
						<span class='count-down' v-if='paperInfo.paper.questionDuration'>00 : 30 : 00</span>
						<span class='count-down' v-else >不限时</span>
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
								<div :class='["question-circle", (index === currentBigIndex && i === currentQuestionIndex) ? "active" : "",answerMap.hasOwnProperty(ele.id) ? "done" : ""]'
										 @click='clickAnswerCardIndex(index, i)'
										 v-for='(ele, i) in item.questionList' :key='ele.id'>{{i + 1}}</div>
							</div>
						</div>
					</div>
					<div class='submit-paper'>
						<el-popconfirm
							:width='tipWidth'
							:title='tipTitle'
							@confirm="clickConfirmSubmit"
							@cancel="clickCancelSubmit"
						>
							<template #reference>
								<div class='submit-btn' @click='clickSubmitPaper'>交卷</div>
							</template>
						</el-popconfirm>
					</div>
				</div>
			</div>
		</div>
		<ViewImgModal ref='viewImgModalRef' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { getAction, postAction } from '/@/api/common';
import { previewPaperApi, submitPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import other from '/@/utils/other';
import { ElMessage } from 'element-plus';
import ViewImgModal from '/@/components/ViewImgModal/index.vue';

export default defineComponent({
	name: 'examining',
	components: {
		ViewImgModal
	},
	setup() {
		const viewImgModalRef = ref();
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
			answerMap: {},
			currentBigIndex: 0,
			currentQuestionIndex: 0,
			tipTitle: '',
			tipWidth: '260'
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
		const clickViewOrigin = () => {
			viewImgModalRef.value.openDialog(state.currentQuestionInfo.questionUrl);
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
			state.chooseAnswer = '';
			if (state.answerMap[state.currentQuestionInfo.id]) {
				state.chooseAnswer = state.answerMap[state.currentQuestionInfo.id]
			}
		};
		const clickConfirmClose = () => {
			window.history.back();
		};
		const clickCancelClose = () => {

		}
		const clickAnswerCardIndex = (index, i) => {
			state.chooseAnswer = '';
			state.currentBigIndex = index;
			state.currentQuestionIndex = i;
			state.currentBigInfo = state.paperInfo.questionBigList[index];
			state.currentQuestionInfo = state.currentBigInfo.questionList[i];
			if (state.answerMap[state.currentQuestionInfo.id]) {
				state.chooseAnswer = state.answerMap[state.currentQuestionInfo.id]
			}
		};
		const changeAnswer = itemId => {
			state.answerMap[state.currentQuestionInfo.id] = itemId;
		};
		const changeCheckAnswer = () => {
			const answerArr = [];
			state.currentQuestionInfo.questionItemList.map(item => {
				if (item.check) {
					answerArr.push(item.id)
				}
			})
			state.answerMap[state.currentQuestionInfo.id] = answerArr.join(',');
		}
		const clickSubmitPaper = () => {
			if (Object.keys(state.answerMap).length !== ~~state.paperInfo.paper.questionCount) {
				state.tipTitle = '试题还未答完，是否确定提交!';
			} else {
				state.tipTitle = '提交以后不能更改，是否确定提交!';
			}
		};
		const clickCancelSubmit = () => {

		};
		const clickConfirmSubmit = () => {
			postAction(submitPaperApi, {
				paperId: state.id,
				answerMap: state.answerMap
			}).then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					ElMessage.success(res.message);
				}
			})
		};
		onMounted(() => {
			const urlMap = other.params2Obj(window.location.href) as any;
			state.id = urlMap.id;
			getPaperInfo();
		})
		return {
			...toRefs(state),
			changeQuestion,
			clickAnswerCardIndex,
			changeAnswer,
			clickSubmitPaper,
			clickCancelSubmit,
			clickConfirmSubmit,
			clickConfirmClose,
			clickCancelClose,
			clickViewOrigin,
			changeCheckAnswer,
			viewImgModalRef
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
			.progress-bar{
				padding-bottom: 10px;
			}
			.question-area{
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
					overflow: scroll;
					padding-bottom: 60px;
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
							position: relative;
							.index-number{
								margin-right: 8px;
								margin-top: 4px;
							}
							.question-name{
								color: #126ac6;
								line-height: 25px;
								::v-deep p{
									display: inline-block;
									color: #000;
								}
							}
							.view-origin-q{
								position: absolute;
								top: 10px;
								right: 10px;
							}
						}
						.list-item-box{
							margin-left: 40px;
							.list-item{
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
								margin-bottom: 5px;
								color: #000;
								.item{
									margin-left: 5px;
									margin-top: 8px;
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
								.check-item{
									margin-top: 12px;
								}
							}
						}
					}
					.btn-box{
						position: fixed;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 50px;
						padding-left: 20px;
						line-height: 50px;
						background: #fff;
					}
				}
				.answer-card{
					width: 350px;
					background: #fff;
					margin-left: 20px;
					position: relative;
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
								flex-wrap: wrap;
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
									margin-bottom: 10px;
									border: 1px solid #ccc;
									&.active, &:hover{
										border-color: #126ac6;
										color: #126ac6;
									}
									&.done{
										background: #126ac6;
										color: #fff;
									}
								}
							}
						}
					}
					.submit-paper{
						position: absolute;
						width: 100%;
						bottom: 20px;
						left: 0;
						padding: 0 20px;
						text-align: center;
						.submit-btn{
							cursor: pointer;
							padding: 10px 30px;
							background: #126ac6;
							border-radius: 5px;
							color: #fff;
						}
					}
				}
			}
		}
	}
</style>
