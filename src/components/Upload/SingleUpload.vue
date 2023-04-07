<template>
	<div class='single-upload'>
		<el-upload
			class="upload-demo"
			:action="dataObj.host"
			:data='dataObj'
			:on-remove="handleRemove"
			:before-upload='handleBeforeUpload'
			:on-success='handleSuccess'
			:file-list="imgList"
			list-type="picture"
		>
			<el-button type="primary">点击上传</el-button>
		</el-upload>
	</div>
</template>

<script lang='ts'>
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { policyApi } from '/@/api/oss';
import { StatusEnum} from '/@/common/status.enum';
import { getAction } from '/@/api/common';

export default defineComponent({
	name: 'SingleUpload',
	props: {
		sourceUrl: String
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
			fileList: [] as any
		});
		const imageUrl = computed(() => {
			return props.sourceUrl;
		});
		const imageName = computed(() => {
			return props.sourceUrl?.substr(props.sourceUrl?.lastIndexOf('/') + 1);
		});
		const imgList = computed({
			get: () => {
				return props.sourceUrl ? [{
					name: imageName,
					url: imageUrl
				}] : []
			},
			set: (param: any) => {
				state.fileList = [{
					name: param.name,
					url: param.url
				}]
			}
		});
		const changeSourceUrl = (val: string) => {
			ctx.emit('changeSourceUrl', val);
		}
		const handleRemove = () => {
			changeSourceUrl('');
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
		const handleSuccess = (res: any, file: any) => {
			const url = state.dataObj.host + '/' + state.dataObj.dir + '/' + file.name;
			imgList.value = [{
				name: file.name,
				url
			}]
			changeSourceUrl(url);
		};
		return {
			...toRefs(state),
			imageUrl,
			imageName,
			imgList,
			handleRemove,
			handleBeforeUpload,
			handleSuccess
		}
	}
});
</script>

<style scoped lang='scss'>

</style>
