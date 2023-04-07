<template>
	<div class='preview-file-container'>
		<component
			:is='state.componentMap[state.fileType]'
			:height='props.height'
			:file-path='state.filePath'
		/>
	</div>
</template>

<script lang='ts' setup>
	import { markRaw, reactive, watch } from 'vue';
	import { reviewFileUrl } from '/@/api/common';
	import WordReview from './WordReview.vue';
	import PdfReview from './PdfReview.vue';
	import ImageReview from './ImageReview.vue';

	const props = defineProps({
		sourceUrl: {
			type: String,
			required: true
		},
		height: {
			type: String,
			default: '400px'
		}
	});
	const state = reactive({
		fileSuffix: '',
		fileType: '',
		filePath: '',
		componentMap: {
			word: markRaw(WordReview),
			pdf: markRaw(PdfReview),
			img: markRaw(ImageReview)
		}
	});
	const wordArr = ['docx', 'doc'];
	const pdfArr = ['pdf'];
	const imgArr = ['jpg', 'jpeg', 'png', 'gif', 'bmg'];
	const showFile = (fullFilePath: string) => {
		state.filePath = fullFilePath;
		const suffixName = fullFilePath.slice(fullFilePath.lastIndexOf('.') + 1);
		const suffixMap = [
			[
				() => wordArr.includes(suffixName.toLocaleLowerCase()),
				() => {
					state.fileType = 'word';
				}
			],
			[
				() => pdfArr.includes(suffixName.toLocaleLowerCase()),
				() => {
					state.fileType = 'pdf';
				}
			],
			[
				() => imgArr.includes(suffixName.toLocaleLowerCase()),
				() => {
					state.fileType = 'img';
				}
			]
		];
		const target = suffixMap.find(m => m[0]());
		if (target) {
			target[1]();
		} else {
			console.log('未定义映射');
		}
	};
	watch(() => props.sourceUrl, () => {
		if (props.sourceUrl) {
			showFile(`${reviewFileUrl}${props.sourceUrl}`);
		}
	});
</script>

<style scoped lang='scss'>
</style>
