<script setup lang='ts'>
	import { reactive } from 'vue';

	const state = reactive({
		dialogVisible: false,
		imgList: [] as any
	});
	const openDialog = (url: string) => {
		state.dialogVisible = true;
		state.imgList = url.split(',');
	};
	defineExpose({
		openDialog
	})
</script>

<template>
	<el-dialog
		v-model="state.dialogVisible"
		title="查看图片"
		width="80%"
	>
		<div class='img-list'>
			<div class='img-item' v-for='item in state.imgList' :key='item'>
				<img :src='item' alt=''>
			</div>
		</div>
	</el-dialog>
</template>

<style scoped lang='scss'>
	.img-list{
		.img-item{
			img{
				display: block;
				width: 100%;
				height: auto;
				margin-bottom: 10px;
			}
		}
	}
</style>
