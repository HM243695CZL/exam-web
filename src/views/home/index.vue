<template>
	<div class="home-container layout-pd">
		<div class='tab-list'>
			<div :class='["item", item.value === state.currentTab ? "active" : ""]'
					 @click='changeTab(item)'
					 v-for='item in state.tabList' :key='item.value'>
				{{item.text}}
			</div>
		</div>
		<div class='content'>
			<div class='title'>
				<h1 class='title'>{{state.currentTab === 'lu' ? '陆延妮' : '黄初舟'}}礼薄(共计{{state.totalAmount}})，{{state.dataList.length}}人</h1>
			</div>
			<div class='row'>
				<div class='col' v-for='item in state.dataList' :key='item.username'>
					<div class='username'>
						<div class='field' v-for='(ele, index) in item.username' :key='index'>{{ele}}</div>
					</div>
					<div class='amount'>
						<div class='field' v-for='(ele, index) in item.amount' :key='index'>{{ele}}</div>
					</div>
					<div class='tran-upper'>
						<div class='field'>{{tranUpper(item.amount)}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
const state = reactive({
	tabList: [
		{ text: '陆', value: 'lu'},
		{ text: '黄', value: 'huang'}
	],
	currentTab: 'lu',
	hDataList: [
		{ username: '蒙跃鹄', amount: '300'},
		{ username: '金维君', amount: '500'},
		{ username: '韦浩', amount: '200'},
		{ username: '王璇', amount: '200'},
		{ username: '黄生友', amount: '200'},
		{ username: '王旖旎', amount: '200'},
		{ username: '蒙跃顺', amount: '200'},
		{ username: '王飞雪', amount: '100'},
		{ username: '王蒙', amount: '100'},
		{ username: '蒙跃鎏', amount: '100'},
		{ username: '韦国洋', amount: '100'},
		{ username: '蒙跃列', amount: '200'},
		{ username: '王鹏', amount: '200'},
		{ username: '韦金浪', amount: '200'},
		{ username: '张修堂', amount: '200'},
		{ username: '韦涛(贝)', amount: '200'},
		{ username: '韦国权', amount: '200'},
		{ username: '韦国善', amount: '200'},
		{ username: '韦霞', amount: '200'},
		{ username: '黄涵', amount: '300'},
		{ username: '韦娇娇', amount: '600'},
		{ username: '蒙泽念', amount: '800'},
		{ username: '蒙芳芳', amount: '800'},
		{ username: '蒙翔', amount: '800'},
		{ username: '黄初阳', amount: '800'},
		{ username: '黄初文', amount: '800'},
		{ username: '黄初铭', amount: '800'},
		{ username: '黄生双', amount: '100'},
		{ username: '余福二', amount: '200'},
		{ username: '李娟', amount: '200'},
		{ username: '农旋', amount: '500'},
		{ username: '胡显芳', amount: '500'},
		{ username: '农永雪', amount: '200'},
		{ username: '方享', amount: '100'},
		{ username: '陈鑫', amount: '200'},
		{ username: '贺明丽', amount: '200'},
		{ username: '金晨旭', amount: '200'},
		{ username: '金龙', amount: '200'},
		{ username: '王建露', amount: '200'},
		{ username: '严丹丹', amount: '200'},
		{ username: '王碧森', amount: '400'},
		{ username: '宋泓锟', amount: '500'},
		{ username: '彭小双', amount: '200'},
		{ username: '杨明亮', amount: '500'},
		{ username: '陆泽诚', amount: '200'},
		{ username: '徐甜', amount: '100'},
		{ username: '杨璘询', amount: '200'},
		{ username: '胡飞', amount: '100'},
		{ username: '韦玉睿', amount: '300'},
		{ username: '张洋', amount: '200'},
		{ username: '彭德贵', amount: '200'},
	],
	lDataList: [
		{ username: '韦霞', amount: '666'},
		{ username: '昌露', amount: '666'},
		{ username: '宝梅', amount: '600'},
		{ username: '的娇', amount: '200'},
		{ username: 'A凤', amount: '600'},
		{ username: '永梅', amount: '600'},
		{ username: '延霜', amount: '200'},
		{ username: '帮梅', amount: '600'},
		{ username: '毛辉', amount: '200'},
		{ username: '延睿', amount: '600'},
		{ username: '宝路', amount: '500'},
		{ username: '登宝', amount: '200'},
		{ username: 'A生', amount: '200'},
		{ username: '登钊', amount: '500'},
		{ username: '潘永丽', amount: '100'},
		{ username: '潘庆秀', amount: '100'},
		{ username: '周登格', amount: '200'},
		{ username: '岑祥品', amount: '200'},
		{ username: '危永良', amount: '100'},
		{ username: '岑祥梅', amount: '100'},
		{ username: '周韦', amount: '100'},
		{ username: '陆竹', amount: '100'},
		{ username: '黄酸', amount: '100'},
		{ username: '寨寨', amount: '200'},
		{ username: '小芝', amount: '200'},
		{ username: '建说', amount: '100'},
		{ username: '毛仙', amount: '100'},
		{ username: '余伟', amount: '200'},
		{ username: '周泽', amount: '200'},
		{ username: '生正', amount: '200'},
		{ username: '红梅', amount: '200'},
		{ username: '农琴', amount: '200'},
		{ username: '陆禄', amount: '200'},
		{ username: '登奎', amount: '100'},
		{ username: '延石', amount: '200'},
		{ username: '老二', amount: '200'},
		{ username: '方睿', amount: '200'},
		{ username: '延芝', amount: '200'},
		{ username: '岑霞', amount: '200'},
		{ username: 'A佑', amount: '200'},
		{ username: '罗万在', amount: '200'},
		{ username: '兴江', amount: '300'},
		{ username: '明茴', amount: '300'},
		{ username: '吴实根', amount: '200'},
		{ username: '唐围', amount: '200'},
		{ username: '连连', amount: '200'},
		{ username: '孙安杰', amount: '200'},
		{ username: '张陶蓝', amount: '200'},
		{ username: '吴志欣', amount: '200'},
		{ username: '邓蒙蒙', amount: '200'},
		{ username: '黄静', amount: '200'},
	],
	totalAmount: 0,
	dataList: [],
});
const changeTab = data => {
	if (data.value === state.currentTab) return;
	state.currentTab = data.value;
	if (state.currentTab === 'lu') {
		state.dataList = state.lDataList;
	} else {
		state.dataList = state.hDataList;
	}
	calcTotalAmount();
};
const calcTotalAmount = () => {
	let total = 0;
	state.dataList.forEach(item => {
		total += Number(item.amount);
	});
	state.totalAmount = total;
};
// 数字转大写
const tranUpper = num => {
	let strOutput = '';
	let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
	num += '00';
	const intPos = num.indexOf('.');
	if (intPos >= 0) {
		num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
	}
	strUnit = strUnit.substr(strUnit.length - num.length);
	for (let i = 0; i < num.length; i++) {
		strOutput +=
			'零壹贰叁肆伍陆柒捌玖'.substr(Number(num.substr(i, 1)), 1) +
			strUnit.substr(i, 1);
	}
	return strOutput
		.replace(/零角零分$/, '整')
		.replace(/零[仟佰拾]/g, '零')
		.replace(/零{2,}/g, '零')
		.replace(/零([亿|万])/g, '$1')
		.replace(/零+元/, '元')
		.replace(/亿零{0,3}万/, '亿')
		.replace(/^元/, '零元');
};
onMounted(() => {
	state.dataList = state.lDataList;
	calcTotalAmount();
})
</script>

<style scoped lang="scss">
.home-container {
	height: 100%;
	background: #f00;
	.tab-list{
		display: flex;
		justify-content: center;
		align-items: center;
		.item{
			padding: 5px 15px;
			cursor: pointer;
			border: 1px solid #ccc;
			margin-left: -1px;
			font-weight: 700;
			font-size: 20px;
			&:hover{
				color: yellow;
			}
			&.active{
				color: yellow;
			}
		}
	}
	.content{
		.title{
			padding: 10px;
			text-align: center;
		}
		.row{
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.col{
				text-align: center;
				padding: 10px;
				border: 1px solid #ccc;
				margin-left: -1px;
				.field{
					margin-bottom: 10px;
				}
				.username{
					height: 120px;
					.field{
						font-weight: 700;
					}
				}
				.amount{
					margin-top: 15px;
					padding-top: 15px;
					border-top: 2px solid #fff;
				}
				.tran-upper{
					height: 150px;
				}
			}
		}
	}
}
</style>
