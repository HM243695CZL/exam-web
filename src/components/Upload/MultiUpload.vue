<template>
	<div class='multi-upload'>
		<el-upload
			list-type="picture-card"
			class="upload-demo"
			:action="dataObj.host"
			:data='dataObj'
			:on-remove="handleRemove"
			:before-upload='handleBeforeUpload'
			:on-success='handleSuccess'
			:file-list="imgList"
			:limit="maxCount"
		>
			<el-icon>
				<ele-Plus />
			</el-icon>
		</el-upload>
	</div>
</template>

<script lang='ts'>
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { policyApi } from '/@/api/oss';
import { StatusEnum } from '/@/common/status.enum';
import { getAction } from '/@/api/common';

export default defineComponent({
	name: 'MultiUpload',
	props: {
		maxCount: {
			type: Number,
			default: 5
		},
		list: {
			type: Array,
			default: () => []
		}
	},
	setup(props, ctx) {
		const state = reactive({
			dataObj: {
				policy: '',
				signature: '',
				key: '',
				ossAccessKeyId: '',
				dir: '',
				host: ''
			},
			useOss: true,
		});
		const imgList = computed(() => {
			const arr: any[] = []
			props.list.map((item: any) => {
				const fileName = item.url?.substr(item.url?.lastIndexOf('/') + 1);
				arr.push({
					name: fileName,
					url: item.url
				})
			});
			return arr;
		});
		const changeFileList = (fileList: any) => {
			ctx.emit('changeFileList', fileList)
		};
		const handleRemove = (file: any) => {
			console.log(file);
		};
		const handleSuccess = (res: any, file: any) => {
			const url = state.dataObj.host + '/' + state.dataObj.dir + '/' + file.name;
			imgList.value.pop();
			imgList.value.push({
				name: file.name,
				url
			});
			changeFileList(imgList.value);
		};
		const handleBeforeUpload = () => {
			return new Promise(((resolve, reject) => {
				getAction(policyApi, '').then(res => {
					if (res.status === StatusEnum.SUCCESS) {
						const {accessKeyId, dir, host, policy, signature} = res.data;
						state.dataObj.policy = policy;
						state.dataObj.signature = signature;
						state.dataObj.key = dir + '/${filename}';
						state.dataObj.ossAccessKeyId = accessKeyId;
						state.dataObj.dir = dir;
						state.dataObj.host = host;
						resolve(true);
					}
				}).catch(() => {
					reject(false);
				})
			}))
		};
		return {
			handleBeforeUpload,
			handleRemove,
			handleSuccess,
			imgList,
			...toRefs(state)
		}
	}
});
</script>

<style scoped lang='scss'>

</style>
