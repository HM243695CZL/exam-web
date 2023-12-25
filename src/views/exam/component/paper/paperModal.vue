<template>
	<div class='paper-modal-container h100'>
		<div class='paper-content h100'>
			<div class='paper-question'>
				<div class='title'>{{state.ruleForm.id ? '编辑' : '新增'}}试卷</div>
				<el-row>
					<el-col :span='24'>
						<el-input class='name-input' type='text' v-model='state.ruleForm.name' placeholder='请输入试卷名称'></el-input>
					</el-col>
				</el-row>
				<el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
					<el-row>
						<el-col :span='12'>
							<el-form-item label='是否限时' prop='timeLimit'>
								<el-radio-group v-model="state.ruleForm.timeLimit">
									<el-radio :label="1" size="large">不限时</el-radio>
									<el-radio :label="2" size="large">限时</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span='12' v-if='state.ruleForm.timeLimit === 2'>
							<el-form-item label='答题时间' prop='questionDuration'>
								<el-input-number class='w180' :min='0' v-model='state.ruleForm.questionDuration' placeholder='请输入答题时间'></el-input-number>
								<span class='unit'>分</span>
							</el-form-item>
						</el-col>
					</el-row>
					<div class='question-type'>
						<div class='type-item' v-for='(item, index) in state.ruleForm.questionBigType' :key='item.key'>
							<div class='big-name'>
								<el-input class='input-name' v-model='item.name'></el-input>
								<el-button @click='clickChooseQuestion(item)'>选择试题</el-button>
								<el-button @click='clickRandom(item)'>随机抽题</el-button>
							</div>
							<div class='question-list'>
								<div class='list-item' v-for='(ele, i) in item.questionList' :key='index + "-" + i'>
									<div class='question-content'>
										<div class='q-name' v-html='(i + 1) + ". " + ele.question'></div>
										<ul>
											<li :class='ele.answer === state.itemIndex[index] ? "active" : ""' v-for='(e, index) in ele.questionItemList' :key='e.id'>
												<span class='a-item'>{{state.itemIndex[index]}}</span>
												<span class='question-name' v-html='e.name'></span>
											</li>
										</ul>
										<div class='answer'>
											答案：
											<span v-if='[1, 3].includes(ele.type)'>{{state.itemIndex[ele.answerIndex]}}</span>
											<span v-if='[2].includes(ele.type)'>
												{{(ele.answerIndex || []).map(item => state.itemIndex[item]).join('、')}}
											</span>
										</div>
										<div class='analysis'>
											解析：
											<div class='analysis-html' v-html='ele.analysis'></div>
										</div>
									</div>
									<div class='question-operate'>
										<el-button icon='ele-ArrowUp' @click='clickMoveUpQuestion(ele, index, i)'>上移</el-button>
										<el-button icon='ele-ArrowDown' @click='clickMoveDownQuestion(ele, index, i)'>下移</el-button>
										<el-button type='danger' icon='ele-Remove' @click='deleteQuestion(index, i)'>删除</el-button>
										<div class='score'>
											<el-input-number :min='1' v-model='ele.score' @change='renderScoreInfo'></el-input-number>分
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class='big-question'>
						<div class='text'>
							<SvgIcon name='ele-Plus' />
							创建大题
						</div>
						<div class='question-btn'>
							<div class='question-item'>
								<div class='question single' @click='addQuestion(1)'>单选题</div>
								<div class='question multiple' @click='addQuestion(2)'>多选题</div>
								<div class='question determine' @click='addQuestion(3)'>判断题</div>
							</div>
						</div>
					</div>
				</el-form>
			</div>
			<div class='overview'>
				<div class='overview-list'>
					<div class='list-item' v-for='(item, index) in state.ruleForm.questionBigType' :key='item.id'>
						<div class='name'>{{item.name}}</div>
						<div class='question-score'>
							共 <span class='score'>{{item.questionList.length}}</span> 题，
							共 <span class='score'>{{item.questionScore}}</span> 分
						</div>
						<div class='pre-question'>
							每题<el-input-number v-model='item.preScore' @change='changeScore(item)'></el-input-number>分
						</div>
						<div class='button-box'>
							<div class='icon-btn' @click='clickBigDelete(index)'>
								<SvgIcon name='ele-Delete' />
							</div>
							<div class='icon-btn' @click='clickBigMoveUp(index)'>
								<SvgIcon name='ele-ArrowUp' />
							</div>
							<div class='icon-btn' @click='clickBigMoveDown(index)'>
								<SvgIcon name='ele-ArrowDown' />
							</div>
						</div>
					</div>
				</div>
				<div class='all-question' v-if='state.ruleForm.questionBigType.length > 0'>
					<div class='total'>总题数：{{state.totalQuestion}} 题</div>
					<div class='total'>当前总分：{{state.totalScore}} 分</div>
				</div>
				<div class='btn'>
					<el-button type='default' @click='clickCancel'>取消</el-button>
					<el-button type='primary' @click='clickConfirm'>确定</el-button>
				</div>
			</div>
		</div>
		<ChooseQuestionModal
			ref='chooseQuestionModalRef'
			@clickConfirmChoose='clickConfirmChoose'
		/>
		<RandomChooseQuestionModal
			:question-type-list='questionTypeList'
			ref='randomChooseRef'
			@clickConfirmChoose='clickConfirmChoose'
		/>
	</div>
</template>

<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
import ChooseQuestionModal from './chooseQuestionModal.vue';
import RandomChooseQuestionModal from './randomChooseQuestionModal.vue';
import { ElMessage } from 'element-plus';
import { getAction, postAction } from '/@/api/common';
import { createPaperApi, updatePaperApi, viewPaperApi } from '/@/api/exam/paper';
import { StatusEnum } from '/@/common/status.enum';

const props = defineProps({
	id: {
		type: String
	},
	questionTypeList: {
		type: Array,
		required: true
	}
});
const emits = defineEmits([
	'clickCancel'
]);
const chooseQuestionModalRef = ref();
const randomChooseRef = ref();
const state = reactive({
	ruleForm: {
		id: '',
		name: '',
		questionDuration: null,
		timeLimit: 1,
		questionBigType: [],
	},
	rules: {},
	currentKey: 0,
	itemIndex: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
	totalQuestion: 0,
	totalScore: 0,
	upperIndex: ['一', '二', '三' , '四', '五', '六', '七' ,'八', '九', '十', '十一', '十二'],
	paperId: '',
});
const clickCancel = () => {
	emits('clickCancel', false);
};
const getPaperInfo = () => {
	getAction(viewPaperApi + '/' + state.paperId, '').then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			state.ruleForm.id = res.data.paper.id;
			state.ruleForm.name = res.data.paper.name;
			state.ruleForm.questionDuration = res.data.paper.questionDuration;
			state.ruleForm.timeLimit = res.data.paper.timeLimit;
			state.ruleForm.questionBigType = [];
			res.data.questionBigList.map(item => {
				(item.questionList || []).map(ele => {
					ele.questionItemList.map((e, index) => {
						if (ele.type === 2) {
							if (ele.answer.split(',').includes(e.id)) {
								if (ele.answerIndex === undefined) {
									ele.answerIndex = [index];
								} else {
									ele.answerIndex.push(index);
								}
							}
						} else {
							if (e.id === ele.answer) {
								ele.answerIndex = index;
							}
						}
					})
				});
				state.ruleForm.questionBigType.push({
					key: item.bigId,
					name: item.bigName,
					type: item.type,
					questionList: item.questionList || [],
					questionScore: item.questionScore
				})
			});
			console.log(state.ruleForm.questionBigType);
			renderScoreInfo();
		}
	});
}
const addQuestion = type => {
	const typeMap = {
		1: '、单选题',
		2: '、多选题',
		3: '、判断题',
	}
	state.ruleForm.questionBigType.push({
		key: new Date().getTime(),
		name: state.upperIndex[state.ruleForm.questionBigType.length] + typeMap[type],
		type,
		questionList: [],
		questionScore: 0
	})
};
const clickChooseQuestion = data => {
	state.currentKey = data.key;
	chooseQuestionModalRef.value.openDialog({
		type: data.type
	});
};
const clickRandom = data => {
	const typeArr = [];
	state.ruleForm.questionBigType.map(item => {
		item.questionList.map(ele => {
			if (!typeArr.includes(ele.questionType)) {
				typeArr.push(ele.questionType)
			}
		})
	});
	state.currentKey = data.key;
	randomChooseRef.value.openDialog({
		type: data.type,
		selectedQuestionType: typeArr
	});
};
const clickConfirmChoose = data => {
	state.ruleForm.questionBigType.map(item => {
		if (item.key === state.currentKey) {
			const arr = [];
			item.questionList.map(ele => {
				arr.push(ele.id);
			});
			data.map(ele => {
				if (!arr.includes(ele.id)) {
					ele.questionItemList.map((e, index) => {
						if (ele.type === 2) {
							if (ele.answer.split(',').includes(e.id)) {
								if (ele.answerIndex === undefined) {
									ele.answerIndex = [index];
								} else {
									ele.answerIndex.push(index);
								}
							}
						} else {
							if (e.id === ele.answer) {
								ele.answerIndex = index;
							}
						}
					})
					item.questionList.push(ele);
				}
			});
		}
	});
	renderScoreInfo();
};
const changeScore = data => {
	state.ruleForm.questionBigType.map(item => {
		if (data.key === item.key) {
			item.questionList.map(ele => {
				ele.score = data.preScore;
			})
		}
	});
	renderScoreInfo();
};
const renderScoreInfo = () => {
	let totalScore = 0;
	let totalQuestion = 0;
	state.ruleForm.questionBigType.map(item => {
		let questionScore = 0;
		item.questionList.map(ele => {
			questionScore += ~~ele.score;
		});
		item.questionScore = questionScore;
		totalQuestion += item.questionList.length;
		totalScore += ~~item.questionScore;
	});
	state.totalScore = totalScore;
	state.totalQuestion = totalQuestion;
};
const deleteQuestion = (index, i) => {
	state.ruleForm.questionBigType[index].questionList.splice(i, 1);
	renderScoreInfo();
};
const clickMoveUpQuestion = (data, index, i) => {
	if (i === 0) return false;
	state.ruleForm.questionBigType[index].questionList.splice(i - 1, 2,
		state.ruleForm.questionBigType[index].questionList[i], state.ruleForm.questionBigType[index].questionList[i - 1]);
	renderScoreInfo();
};
const clickMoveDownQuestion = (data, index, i) => {
	if (i === state.ruleForm.questionBigType[index].questionList.length - 1) return false;
	state.ruleForm.questionBigType[index].questionList.splice(i, 2,
		state.ruleForm.questionBigType[index].questionList[i + 1], state.ruleForm.questionBigType[index].questionList[i]);
	renderScoreInfo();
};
const clickBigDelete = index => {
	state.ruleForm.questionBigType.splice(index, 1);
	renderScoreInfo();
};
const clickBigMoveUp = index => {
	if (index === 0) return false;
	state.ruleForm.questionBigType.splice(index - 1, 2,
		state.ruleForm.questionBigType[index], state.ruleForm.questionBigType[index - 1]);
	renderScoreInfo();
};
const clickBigMoveDown = index => {
	if (index === state.ruleForm.questionBigType.length - 1) return false;
	state.ruleForm.questionBigType.splice(index, 2,
		state.ruleForm.questionBigType[index + 1], state.ruleForm.questionBigType[index]);
	renderScoreInfo();
};
const clickConfirm = () => {
	const dataMap = {
		id: state.ruleForm.id,
		name: state.ruleForm.name,
		score: state.totalScore,
		questionCount: state.totalQuestion,
		timeLimit: state.ruleForm.timeLimit,
		questionDuration: state.ruleForm.questionDuration,
		questionBigType: []
	}
	state.ruleForm.questionBigType.map(item => {
		const questionList = [];
		item.questionList.map(ele => {
			questionList.push({
				id: ele.id,
				question: ele.question,
				score: ele.score
			})
		})
		dataMap.questionBigType.push({
			name: item.name,
			questionScore: item.questionScore,
			questionList,
			type: item.type
		})
	});
	if (!state.ruleForm.name) {
		ElMessage.error('试卷名称不能为空');
		return false;
	}
	if (state.ruleForm.timeLimit === 2 && !state.ruleForm.questionDuration) {
		ElMessage.error('答题时间不能为空');
		return false;
	}
	postAction(state.ruleForm.id ? updatePaperApi : createPaperApi, dataMap).then(res => {
		if (res.status === StatusEnum.SUCCESS) {
			ElMessage.success(res.message);
			emits('clickCancel', true);
		}
	})
};
onMounted(() => {
	state.paperId = props.id as string;
	if (props.id) {
		getPaperInfo();
	}
})
</script>

<style scoped lang='scss'>
	.paper-modal-container{
		.paper-content{
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.paper-question{
				flex: 1;
				height: 100%;
				overflow-y: scroll;
				padding: 15px;
				.title{
					font-weight: 700;
					font-size: 20px;
					width: fit-content;
					margin-bottom: 10px;
				}
				.name-input{
					margin-bottom: 10px;
					:deep input{
						text-align: center;
					}
				}
				.question-type{
					.type-item{
						.big-name{
							display: flex;
							justify-content: flex-start;
							align-items: center;
							.input-name{
								width: 240px;
							}
							.el-button{
								margin-left: 10px;
								margin-right: 10px;
							}
						}
						.question-list{
							margin: 8px 0;
							background: #f5f5f5;
							.list-item{
								padding: 10px;
								margin-bottom: 20px;
								display: flex;
								justify-content: flex-start;
								align-items: flex-start;
								.question-content{
									flex: 1;
									padding-right: 20px;
									:deep p{
										display: inline;
									}
									ul{
										margin-top: 8px;
										li{
											list-style: none;
											&.active{
												color: #f40;
											}
											.a-item{
												display: inline-block;
												width: 25px;
												height: 25px;
												text-align: center;
												line-height: 25px;
												border: 1px solid #ccc;
												border-radius: 50%;
												margin: 5px 5px;
											}
											.question-name{
												::v-deep {
													p{
														display: inline-block;
													}
												}
											}
										}
									}
									.answer{
										padding: 8px 0;
									}
									.analysis{
										padding: 8px 0;
										&-html{
											text-indent: 2em;
										}
									}
								}
								.question-operate{
									.el-button{
										margin-bottom: 10px;
									}
									.score{
										margin-top: 20px;
									}
								}
							}
						}
					}
				}
				.big-question{
					margin-top: 30px;
					margin-bottom: 30px;
					padding: 15px;
					border: 1px dashed #ccc;
					border-radius: 5px;
					text-align: center;
					cursor: pointer;
					&:hover{
						.text{
							display: none;
						}
						.question-btn{
							display: block;
						}
					}
					.text{
						display: block;
					}
					.question-btn{
						display: none;
						.question-item{
							display: flex;
							justify-content: center;
							align-items: center;
							.question{
								margin-right: 10px;
								border: 1px dashed #126ac6;
								color: #126ac6;
								padding: 10px 20px;
								border-radius: 5px;
							}
						}
					}
				}
			}
			.overview{
				width: 320px;
				padding: 20px;
				height: 100%;
				overflow-y: scroll;
				.overview-list{
					.list-item{
						border: 1px solid #ccc;
						border-radius: 5px;
						margin-bottom: 15px;
						.name{
							padding: 10px;
							font-weight: 700;
						}
						.question-score{
							padding: 10px;
						}
						.pre-question{
							padding: 10px;
						}
						.button-box{
							display: flex;
							justify-content: space-between;
							align-items: center;
							background: #f9f9f9;
							border-top: 1px solid #ccc;
							border-radius: 0 0 5px 5px;
							overflow: hidden;
							.icon-btn{
								flex: 1;
								text-align: center;
								padding: 10px;
								cursor: pointer;
								border-right: 1px solid #ccc;
								&:last-child{
									border-right: none;
								}
								&:hover{
									color: #126ac6;
								}
							}
						}
					}
				}
				.all-question{
					margin-top: 10px;
					padding: 10px;
					border: 1px solid #ccc;
					border-radius: 5px;
					display: flex;
					justify-content: space-between;
				}
				.btn{
					margin-top: 20px;
					text-align: center;
				}
			}
		}
	}
</style>
