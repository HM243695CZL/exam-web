<template>
	<div class='preview-img-container'>
		<img :src='imgUrl' alt='' class='img50' @click='showImg'>
		<el-dialog title='预览' append-to-body v-model='dialogVisible' width='800px'>
			<img class='modal-img' :src='imgUrl' alt=''>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false" size="default">关 闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
	name: 'previewImg',
	props: {
		imgUrl: String
	},
	setup(props) {
		const state = reactive({
			dialogVisible: false
		});
		const showImg = () => {
			if (props.imgUrl) {
				state.dialogVisible = true;
			}
		};
		return {
			showImg,
			...toRefs(state)
		}
	}
});
</script>

<style scoped lang='scss'>
	.modal-img{
		display: block;
		width: 100%;
		height: auto;
	}
</style>
