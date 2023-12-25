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
import { lDataList } from '/@/views/home/lDataList';
import { hDataList } from '/@/views/home/hDataList';
const state = reactive({
	tabList: [
		{ text: '陆', value: 'lu'},
		{ text: '黄', value: 'huang'}
	],
	currentTab: 'lu',
	hDataList,
	lDataList,
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
	overflow: auto;
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
