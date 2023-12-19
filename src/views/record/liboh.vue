<script setup lang='ts'>
import { onMounted, reactive } from 'vue';

	const state = reactive({
		dataList: [
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
		],
		totalAmount: 0,
	});
	const calcTotalAmount = () => {
		let total = 0;
		state.dataList.forEach(item => {
			total += Number(item.amount);
		});
		state.totalAmount = total;
	};
	onMounted(() => {
		calcTotalAmount();
	})
</script>

<template>
	<div class='libo-h-container'>
		<h1 class='title'>黄初舟礼薄(共计{{state.totalAmount}})，{{state.dataList.length}}人</h1>
		<vxe-table
			:data='state.dataList'
		>
			<vxe-column field='username' title='姓名' width='300' />
			<vxe-column field='amount' title='金额' align='left' sortable />
		</vxe-table>
	</div>
</template>

<style scoped lang='scss'>
	.libo-h-container{
		padding: 20px;
		.title{
			padding: 10px;
		}
	}
</style>
