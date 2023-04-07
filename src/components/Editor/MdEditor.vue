<template>
  <div class='md-editor-container w100'>
    <v-md-editor @change='editorChange'
                 @blur='editorBlur'
                 v-model='text'
                 left-toolbar='undo redo clear | emoji | h bold italic strikethrough quote | ul ol table hr | link image code | save'
                 :disabled-menus='[]'
                 :height='props.height'
                 @upload-image='updateImg'
                 placeholder='请输入'
                 :mode='props.mode'></v-md-editor>
  </div>
</template>

<script lang='ts' setup>
import { computed, onMounted, reactive } from 'vue';
import { getAction, uploadAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';
import { policyApi } from '/@/api/oss';
import { ElMessage } from 'element-plus';

const props = defineProps({
  content: {
    type: String
  },
  height: {
    type: String,
    default: '400px'
  },
  mode: {
    type: String,
    default: 'editable', // edit editable preview
  }
});

const emits = defineEmits([
  'editorBlur'
]);

const state = reactive({
  mdText: '',
  editorText: '',
  dataObj: {
    policy: '',
    signature: '',
    key: '',
    ossAccessKeyId: '',
    dir: '',
    host: ''
  },
});

const text = computed({
  get: () => {
    return props.content;
  },
  set: (value: any) => {
    state.mdText = value;
  }
});
const editorChange = text => {
  state.editorText = text;
};
const editorBlur = () => {
  emits('editorBlur', state.editorText);
};
const getPolicy = () => {
  return new Promise(((resolve, reject) => {
    getAction(policyApi, '').then(res => {
      if (res.status === StatusEnum.SUCCESS) {
        const { accessKeyId, dir, host, policy, signature } = res.data;
        state.dataObj.policy = policy;
        state.dataObj.signature = signature;
        state.dataObj.key = dir + '/${filename}';
        state.dataObj.ossAccessKeyId = accessKeyId;
        state.dataObj.dir = dir;
        state.dataObj.host = host;
      }
    }).catch(() => {
      reject(false);
    })
  }))
};
const updateImg = (event, insertImage, files) => {
  const formData = new FormData();
  formData.append('policy', state.dataObj.policy);
  formData.append('signature', state.dataObj.signature);
  formData.append('key', state.dataObj.key);
  formData.append('ossAccessKeyId', state.dataObj.ossAccessKeyId);
  formData.append('dir', state.dataObj.dir);
  formData.append('host', state.dataObj.host);
  formData.append('file', files[0]);
  uploadAction(state.dataObj.host, formData).then(res => {
    if (res === '') {
      const url = state.dataObj.host + '/' + state.dataObj.dir + '/' + files[0].name;
      insertImage({
        url,
        desc: files[0].name,
      });
    } else {
      ElMessage.error('上传图片失败');
    }
  })
};
onMounted(() => {
  getPolicy();
});
</script>
