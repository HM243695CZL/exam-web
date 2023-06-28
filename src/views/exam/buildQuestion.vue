<template>
	<div class='build-question'>
		<el-button @click='clickExport'>导出</el-button>
		<vxe-table
			ref='tableRef'
			:row-config='{
						useKey: true,
						keyField: "id"
					}'
			:data='dataList'
		>
			<vxe-column field='question' title='题目名称' />
			<vxe-column field='questionType' title='题目分类' />
			<vxe-column field='type' title='题目类型' />
			<vxe-column field='difficulty' title='题目难度' />
			<vxe-column field='score' title='题目分数' />
			<vxe-column field='A' title='题目选项A' />
			<vxe-column field='B' title='题目选项B' />
			<vxe-column field='C' title='题目选项C' />
			<vxe-column field='D' title='题目选项D' />
			<vxe-column field='answer' title='题目答案' />
			<vxe-column field='analysis' title='题目解析' />
		</vxe-table>
	</div>
</template>

<script lang='ts'>
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue';

export default defineComponent({
	name: 'buildQuestion',
	setup() {
		const tableRef = ref();
		const state = reactive({
			dataList: []
		})
		const init = () => {
			const str = `1 、下列关于中国共产党百年奋斗的历史意义的说法，正确的有几项？
①锻造了走在时代前列的中国共产党
②从根本上改变了中国人民的前途命运
③开辟了实现中华民族伟大复兴的正确道路
④展示了马克思主义的强大生命力，并深刻影响了世界历史进度
A.1 B.2
C.3 D.4
2 、实现碳达峰、碳中和目标，是贯彻新发展理念、构建新发展格局、推动高质量发展的内在要求。下列关于双碳工作的说法错误的是
A.推进双创工作是破解资源环境约束突出问题，实现可持续发展的迫切需要
B.要倡导节约适度、绿色低碳、文明健康的生活方式，引导绿色健康消费，鼓励绿色出行
C.推进双碳工作，必须坚持全国统筹、节约优先、双轮驱动、内外畅通、防范风险的原则
D.要坚决遏制钢铁、有色、石化、化工、建材等高耗能、高污染、低水平项目发展。
严把新上项目的碳排放关
3 、假如中外举办联合画展，下列作品标签信息错误的是
A.德国画家米勒——《拾穗者》
B.元代画家赵孟頫——《秋郊饮马图》
C.西班牙画家毕加索——《格尔尼卡》
D.五代南唐画家顾国中——《韩熙载夜宴图》
4 、下列关于我国石窟的说法错误的是
A.麦积山石窟因其精美的泥塑艺术闻名
B.龙门石窟的造像多为皇家贵族所建
C.大足石窟开凿于秦汉时期
D.大象山石窟位于甘肃省
`;
			let index = 0;
			const indexArr = [];
			while (index !== -1) {
				index = str.indexOf(' 、', index + 1);
				indexArr.push(index - 1);
			}
			const qArr = [];
			for (let i = 0; i < indexArr.length; i++) {
				if (i === 0) {
					qArr.push(str.slice(3, indexArr[1]));
				} else {
					qArr.push(str.slice(indexArr[i] + 3, indexArr[i + 1]))
				}
			}
			qArr.splice(-1);
			const questionArr = [];
			const answerArr = ['D', 'D', 'A', 'C'];
			qArr.map((item, index) => {
				const q = item.split('A.')[0];
				const A = item.split('A.')[1].split('B.')[0];
				const B = item.split('B.')[1].split('C.')[0];
				const C = item.split('C.')[1].split('D.')[0];
				const D = item.split('D.')[1];
				questionArr.push({
					question: q,
					questionType: '2022.7.9贵州省公务员考试',
					type: '单选题',
					difficulty: '简单',
					score: 5,
					A,
					B,
					C,
					D,
					answer: answerArr[index],
					analysis: ''
				})
			});
			state.dataList = questionArr;
		};
		const clickExport = () => {
			tableRef.value.exportData({
				type: 'xlsx',
				filename: '题库',
				data: tableRef.value.data
			})
		};
		onMounted(() => {
			init();

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