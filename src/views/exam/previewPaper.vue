<template>
	<div class='preview-paper-container h100'>
		<div class='paper-name'>
			<el-button class='back-btn' type='default' size='small' @click='clickBack'>返回</el-button>
			{{paperInfo.paper.name}}
		</div>
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
							<el-button size='small' class='view-origin' @click='clickViewOrigin(ele)'>查看原题</el-button>
						</div>
						<div class='question-item-list'>
							<div class='question-item' v-for='(e, i) in ele.questionItemList' :key='e.id'>
								<span class='option-item'>{{itemIndex[i]}}.</span><span v-html='e.name'></span>
							</div>
						</div>
						<div class='view-answer' v-if='isRecord'>
							<div class='your-answer'>
								你的答案：
								<span v-if='ele.type === 2'>
									{{ele.userAnswerList.map(e => itemIndex[e]).join(',')}}
								</span>
								<span v-else>{{itemIndex[ele.currentUserAnswerIndex]}}</span>
								<div class='result'>
									<div class='yes' v-if='ele.answer === ele.currentUserAnswer'>
										<img :src='allRightImg' alt=''>
									</div>
									<div class='half-yes' v-else-if='ele.type === 2 && arrContain(ele.answer.split(","), ele.currentUserAnswer.split(","))'>
										<img :src='halfYesImg' alt=''>
									</div>
									<div class='no' v-else>
										<img :src='forkImg' alt=''>
									</div>
								</div>
							</div>
							<div class='correct-answer'>
								正确答案：
								<span v-if='ele.type === 2'>
									{{ele.correctAnswerList.map(e => itemIndex[e]).join(',')}}
								</span>
								<span v-else>{{itemIndex[ele.answerIndex]}}</span>
							</div>
							<div class='analysis'>
								解析：
								<div class='analysis-html' v-html='ele.analysis'></div>
							</div>
						</div>
						<div class='exam-result' v-if='isRecord'>
							<div class='paper-score'>
								试卷总分：<span class='number'>{{paperInfo.paper.score}}</span>分
							</div>
							<div class='exam-score'>
								考试得分：<span class='number'>{{paperInfo.answerRecordInfo.score}}</span>分
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<ViewImgModal ref='viewImgModalRef' />
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { getAction } from '/@/api/common';
import { previewPaperApi, viewPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';
import other from '/@/utils/other';
import allRightImg from '/@/assets/img/all-right.png';
import forkImg from '/@/assets/img/fork.png';
import halfYesImg from '/@/assets/img/half-yes.png';
import ViewImgModal from '/@/components/ViewImgModal/index.vue';

export default defineComponent({
	name: 'previewPaper',
	components: { ViewImgModal },
	setup() {
		const viewImgModalRef = ref();
		const state = reactive({
			paperId: '',
			paperInfo: {
				paper: {},
				questionBigList: [],
				answerRecordInfo: {}
			} as any,
			itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
			status: '0',
			isRecord: false,
			examInfo: {} as any,
			allRightImg,
			forkImg,
			halfYesImg
		});
		const getPaperInfo = () => {
			getAction((state.isRecord ? viewPaperApi : previewPaperApi) + '/' + state.paperId, '').then(res => {
				if (res.status === StatusEnum.SUCCESS) {
					const { paper, questionBigList, answerRecordInfo } = res.data;
					state.paperInfo.paper = paper;
					state.paperInfo.answerRecordInfo = answerRecordInfo;
					state.paperInfo.questionBigList = questionBigList;
					state.paperInfo.questionBigList.map(item => {
						item.questionList.map(ele => {
							const userAnswerList = [];
							const correctAnswerList = [];
							ele.questionItemList.map((e, index) => {
								if (ele.type === 2) {
									if (ele.currentUserAnswer.indexOf(e.id) > -1) {
										userAnswerList.push(index);
									}
									if (ele.answer.indexOf(e.id) > -1) {
										correctAnswerList.push(index);
									}
								} else {
									if (ele.currentUserAnswer === e.id) {
										ele.currentUserAnswerIndex = index;
									}
									if (ele.answer === e.id) {
										ele.answerIndex = index;
									}
								}
							});
							ele.userAnswerList = userAnswerList;
							ele.correctAnswerList = correctAnswerList;
						})
					});
				}
			})
		};
		const clickViewOrigin = (data) => {
			let imgArr = [];
			if (data.questionUrl) {
				imgArr = data.questionUrl.split(',');
			}
			if (data.analysisUrl) {
				imgArr = imgArr.concat(data.analysisUrl.split(','));
			}
			viewImgModalRef.value.openDialog(imgArr.join(','));
		};
		const clickBack = () => {
			window.history.back();
		};
		// 判断一个数组是否包含另一个数组
		const arrContain = (arr1, arr2) => {
			if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) return false;
			if (arr1.length < arr2.length) return false;
			for (let i = 0; i < arr2.length; i++) {
				if (arr1.indexOf(arr2[i]) === -1) return false;
			}
			return true;
		};
		onMounted(() => {
			const urlMap = other.params2Obj(window.location.href) as any;
			state.paperId = urlMap.paperId;
			state.status = urlMap.status;
			state.isRecord = urlMap.isRecord;
			getPaperInfo();
		})
		return {
			...toRefs(state),
			clickBack,
			clickViewOrigin,
			viewImgModalRef,
			arrContain
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
			position: relative;
			.back-btn{
				position: absolute;
				top: 10px;
				left: 10px;
			}
		}
		.question-content{
			height: calc(100% - 70px);
			overflow-y: scroll;
			background: #f5f5f5;
			padding: 15px;
			.big-list{
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
							color: #126ac6;
							padding: 10px 0;
							position: relative;
							.view-origin{
								position: absolute;
								top: 30px;
								right: 10px;
							}
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
								color: #dd4a68;
							}
						}
						.question-item-list{
							margin-left: 40px;
							.question-item{
								padding: 10px 0;
								display: flex;
								align-items: flex-start;
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
						.your-answer{
							padding: 10px 0;
							margin-left: 20px;
							display: flex;
							align-items: center;
							position: relative;
							span{
								color: #f40;
							}
							.result{
								position: absolute;
								top: 0;
								right: 20px;
								img{
									width: 100px;
									height: 100px;
								}
							}
						}
						.correct-answer{
							padding: 10px 0;
							margin-left: 20px;
							span{
								color: #126ac6;
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
		}
		.exam-result{
			position: fixed;
			top: 85px;
			right: 20px;
			padding: 10px;
			border: 1px solid #f1f1f1;
			background: rgba(255, 255, 255, .1);
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
