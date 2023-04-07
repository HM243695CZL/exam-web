<template>
  <div class='common-modal-container'>
    <el-dialog :append-to-body='false'
               :close-on-click-modal='false'
               :title='title'
               v-model='isShowDialog' :width='props.modalWidth'>
      <slot></slot>
      <template #footer>
        <div class='dialog-footer'>
          <el-button @click='closeDialog'>取 消</el-button>
          <el-button type='primary' @click='clickConfirm'>确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts' setup>
import useCommonModal from '/@/hooks/useCommonModal';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  createPath: {
    type: String,
    required: true
  },
  updatePath: {
    type: String,
    required: true
  },
  viewPath: {
    type: String,
    required: true
  },
  ruleForm: {
    type: Object,
    default: () => {}
  },
  modalWidth: {
    type: String,
    default: '600px'
  },
  isFormCreate: {
    type: Boolean,
    default: false
  },
  clearFields: {
    type: Array as any,
    default: () => []
  }
});
const emits = defineEmits([
  'refreshList'
]);

const refreshList = () => {
  emits('refreshList');
};

const {
  openDialog,
  closeDialog,
  clickConfirm,
  isShowDialog,
  title,
} = useCommonModal({
  createPath: props.createPath,
  updatePath: props.updatePath,
  viewPath: props.viewPath,
  title: props.title,
  refreshList,
  clearFields: props.clearFields,
  isFormCreate: props.isFormCreate
});
defineExpose({
  openDialog,
});
</script>
