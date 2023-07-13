<template>
	<div class='build-question'>
		<el-button @click='clickExport'>导出</el-button>
		共{{dataList.length}}条数据
		答案{{answerList.length}}条数据
		<vxe-table
			ref='tableRef'
			:row-config='{
						useKey: true,
						keyField: "id"
					}'
			:data='dataList'
			:max-height='600'
			:show-overflow='false'
		>
<!--			<vxe-column type='seq' title='序号' />-->
			<vxe-column field='question' title='题目名称' width='300' />
			<vxe-column field='questionType' title='题目分类' />
			<vxe-column field='type' title='题目类型' />
			<vxe-column field='difficulty' title='题目难度' />
			<vxe-column field='score' title='题目分数' />
			<vxe-column field='A' title='题目选项A' />
			<vxe-column field='B' title='题目选项B' />
			<vxe-column field='C' title='题目选项C' />
			<vxe-column field='D' title='题目选项D' />
			<vxe-column field='answer' title='题目答案' />
			<vxe-column field='analysis' title='题目解析' width='300'/>
		</vxe-table>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue';
import {questionStr} from './questionStr';
import { answerStr} from './answerStr';

export default defineComponent({
	name: 'buildQuestion',
	setup() {
		const tableRef = ref();
		const state = reactive({
			dataList: [],
			answerList: [],
			analysisList: []
		})
		const initQuestion = () => {
			const str = questionStr;
			let index = 0;
			const indexArr = [];
			while (index !== -1) {
				index = str.indexOf(' 、', index + 1);
				indexArr.push(index - 1);
			}
			const qArr = [];
			for (let i = 0; i < indexArr.length; i++) {
				if (i === 0) {
					// qArr.push(str.slice(3, indexArr[1] - 2));
					qArr.push(str.slice(5, indexArr[1] - 2));
				} else if(i >= 8) {
					qArr.push(str.slice(indexArr[i] + 3, indexArr[i + 1] - 2))
				} else {
					qArr.push(str.slice(indexArr[i] + 3, indexArr[i + 1] - 2))
				}
			}
			qArr.splice(-1);
			const questionArr = [];
			qArr.map((item, index) => {
				const q = item.split('A.')[0];
				const A = item.split('A.')[1].split('B.')[0];
				const B = item.split('B.')[1].split('C.')[0];
				const C = item.split('C.')[1].split('D.')[0];
				const D = item.split('D.')[1];
				questionArr.push({
					question: q.replace(/\n/g, ''),
					questionType: '言语理解与表达',
					type: '单选题',
					difficulty: '简单',
					score: 5,
					A,
					B,
					C,
					D,
					answer: state.answerList[index].toUpperCase(),
					analysis: state.analysisList[index]
				})
			});
			state.dataList = questionArr;
		};
		const initAnswer = () => {
			const str = answerStr;
			let index = 0;
			const indexArr = [];
			while (index !== -1) {
				index = str.indexOf('.【答案】', index + 1);
				indexArr.push(index - 1);
			}
			const qArr = [];
			for (let i = 0; i < indexArr.length; i++) {
				if (i === 0) {
					qArr.push(str.slice(8, indexArr[1] - 2));
				} else if(i >= 8) {
					qArr.push(str.slice(indexArr[i] + 6, indexArr[i + 1] - 2))
				} else {
					qArr.push(str.slice(indexArr[i] + 6, indexArr[i + 1] - 2))
				}
			}
			qArr.splice(-1);
			const answerArr = [];
			const analysisArr = [];
			qArr.map(item => {
				answerArr.push(item.slice(0, 1));
				analysisArr.push(item.slice(2));
			});
			state.answerList = answerArr;
			state.analysisList = analysisArr;
		}
		const clickExport = () => {
			tableRef.value.exportData({
				type: 'xlsx',
				filename: '题库',
				data: tableRef.value.data
			})
		};
		onMounted(() => {
			initAnswer();
			initQuestion();
		});
		return {
			tableRef,
			...toRefs(state),
			clickExport
		};
	},
})
</script>

<style scoped lang='scss'>
.build-question{
	padding: 20px;
	.el-button{
		margin-bottom: 10px;
	}
}
</style>