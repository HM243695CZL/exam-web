<template>
	<div class='wang-editor-container'>
		<Toolbar
			style='border-bottom: 1px solid #ccc;'
			:editor='editorRef'
			:defaultConfig='state.toolbarConfig'
			:mode='state.mode'
		/>
		<Editor
			:style='state.editorStyle'
			v-model='contentHtml'
			:defaultConfig='state.editorConfig'
			:mode='state.mode'
			@onCreated='handleCreate'
			@onChange='onChange'
      @customPaste='customPaste'
		/>
	</div>
</template>

<script lang='ts' setup>
import { getAction, uploadAction } from '/@/api/common';
	import '@wangeditor/editor/dist/css/style.css';
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import {onBeforeUnmount, onMounted, reactive, ref, shallowRef} from 'vue';
	import { StatusEnum } from '/@/common/status.enum';
	import { policyApi } from '/@/api/oss';
	import { ElMessage } from 'element-plus';
  import {
    base64ToBlob,
    extractImageDataFromRtf,
    findAllImgSrcsFromHtml,
    replaceImagesFileSourceWithInlineRepresentation
  } from '/@/utils/editorFormat';
  import {IDomEditor} from '@wangeditor/editor';

	type InsertFnType = (url: string, alt: string, href: string) => void

	const props = defineProps({
		content: {
			type: String,
			required: true
		},
		height: {
			type: Number,
			default: 500
		},
		readonly: {
			type: Boolean,
			default: false
		}
	});
	const emits = defineEmits([
		'editorBlur'
	]);
	const editorRef = shallowRef();
	const contentHtml = ref(props.content);
	const state = reactive({
		dataObj: {
			policy: '',
			signature: '',
			key: '',
			ossAccessKeyId: '',
			dir: '',
			host: ''
		},
		toolbarConfig: {
			excludeKeys: ['fullScreen']
		},
		mode: 'default',
		editorConfig: {
			placeholder: '请输入内容...',
			readOnly: props.readonly,
			MENU_CONF: {
				uploadImage: {
					server: '/admin/aliyun/oss/policy',
					filedName: 'file',
					// base64LimitSize: 10 * 1024 * 1024 // 10M 以下插入base64
					customUpload(file: File, insertFn: InsertFnType) {
            const formData = new FormData();
            formData.append('policy', state.dataObj.policy);
            formData.append('signature', state.dataObj.signature);
            formData.append('key', state.dataObj.key);
            formData.append('ossAccessKeyId', state.dataObj.ossAccessKeyId);
            formData.append('dir', state.dataObj.dir);
            formData.append('host', state.dataObj.host);
            formData.append('file', file);
            uploadAction(state.dataObj.host, formData).then(res => {
              if (res === '') {
                insertFn(state.dataObj.host + '/' + state.dataObj.dir + '/' + file.name, '', '');
              } else {
                ElMessage.error('上传图片失败');
              }
            })
					}
				}
			}
		},
		editorStyle: {
			height: props.height + 'px',
			overflow: 'hidden'
		},
    imgPlaceholder: '##~~插入图片~~##'
	});
	const handleCreate = (editor: any) => {
		editorRef.value = editor; // 记录 editor 实例，重要！
	};
	const onChange = (editor: any) => {
		emits('editorBlur', editor.getHtml());
	};
  /**
   * 并发请求 start
   */
  const result = [] as any;
  let index = 0; // 下一个请求的下标
  let count = 0; // 请求完成的数量
  /**
   *
   * @param data 上传的数据
   * @param size 文件格式
   * @param htmlStr html字符串
   * @param editor 编辑器
   * @param fileNameArr 文件名
   */
  const uploadPasteImg = async (data: FormData, size: number, htmlStr: string, editor: IDomEditor, fileNameArr: Array<string>) => {
    const i = index;
    index ++;
    try {
      result[i] = await uploadAction(state.dataObj.host, data);
    } catch (err) {
      result[i] = err;
    } finally {
      // 判断是否所有请求都已完成
      count ++;
      if (count === size) {
        result.map((item, index) => {
          htmlStr = htmlStr.replace(state.imgPlaceholder, `<img src=${state.dataObj.host + '/' + state.dataObj.dir + '/' + fileNameArr[index]} alt=''>`);
        });
        editor.dangerouslyInsertHtml(htmlStr);
      }
    }
  }
  /**
   * 并发请求end
   */
  // 自定义粘贴
  const customPaste = (editor: IDomEditor, event: ClipboardEvent) => {
    let html = event.clipboardData.getData('text/html');
    const rtf = event.clipboardData.getData('text/rtf');
    if (html && rtf) {
      // 自定义word粘贴
      // 列表缩进会超出边框，需要过滤
      html = html.replace(/text\-indent:\-(.*?)pt/gi, '');
      // 从html内容中查找粘贴内容是否有图片元素，并返回img标签的src值的集合
      const imgSrcs = findAllImgSrcsFromHtml(html);
      // 有图片
      if (imgSrcs && Array.isArray(imgSrcs) && imgSrcs.length) {
        // 从rtf内容中查找图片数据
        const rtfImageData = extractImageDataFromRtf(rtf);
        if (rtfImageData.length) {
          html = replaceImagesFileSourceWithInlineRepresentation(html, imgSrcs, rtfImageData);
          // 匹配字符串中所有的img标签
          let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
          let arr = html.match(imgReg) as any;  //筛选出所有的img
          let srcArr = [] as any; // 获取img中的src
          arr.map(item => {
            let src = item.match(srcReg);
            srcArr.push(src[1]);
          });
          // 将img标签的位置替换为特定字符
          html = html.replace(imgReg, state.imgPlaceholder)
          // 将base64转为blob上传到服务器
          let fileNameArr = [] as any;
          for (let i = 0 ; i < srcArr.length; i++) {
            const blob = base64ToBlob(srcArr[i]);
            const formData = new FormData();
            const fileName = 'paste' + i + '.' + blob.type.split('/')[1];
            fileNameArr.push(fileName);
            formData.append('policy', state.dataObj.policy);
            formData.append('signature', state.dataObj.signature);
            formData.append('key', state.dataObj.key);
            formData.append('ossAccessKeyId', state.dataObj.ossAccessKeyId);
            formData.append('dir', state.dataObj.dir);
            formData.append('host', state.dataObj.host);
            formData.append('file', blob, fileName);
            uploadPasteImg(formData, srcArr.length, html, editor, fileNameArr);
          }
        }
      } else {
        // 无图片
        editor.dangerouslyInsertHtml(html);
      }
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
	// 组件销毁时，也及时销毁编辑器
	onBeforeUnmount(() => {
		const editor = editorRef.value;
		if (editor === null) return;
		editor.destroy();
	});
  onMounted(() => {
		getAction(policyApi, '').then(res => {
			if (res.status === StatusEnum.SUCCESS) {
				const {accessKeyId, dir, host, policy, signature} = res.data;
				state.dataObj.policy = policy;
				state.dataObj.signature = signature;
				state.dataObj.key = dir + '/${filename}';
				state.dataObj.ossAccessKeyId = accessKeyId;
				state.dataObj.dir = dir;
				state.dataObj.host = host;
			}
		})
  })
	defineExpose({
		editorRef
	});
</script>

<style scoped lang='scss'>

</style>
