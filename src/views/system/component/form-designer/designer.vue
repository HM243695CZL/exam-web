<template>
  <div class="designer-container">
		<FormDesigner
			ref='formDesignerRef'
		/>
    <div class="btn-box text-center">
      <el-button type="default" @click="clickCancel(false)">取消</el-button>
      <el-button type="primary" @click="clickSave">保存</el-button>
    </div>
    <DesignerModal
      ref="designerModalRef"
      @refreshList="clickCancel(true)"
    />
  </div>
</template>

<script lang="ts" setup>
	import { reactive, ref } from 'vue';
  import DesignerModal from './designerModal.vue';
  import {ElMessage} from 'element-plus';
	import FormDesigner from '/@/components/FormDesigner/index.vue';

  const emits = defineEmits([
      'back'
  ]);
	const formDesignerRef = ref();
  const designerModalRef = ref();
	const state = reactive({
		formRow: {}
	});
  const clickCancel = (refresh: boolean) => {
    emits('back', refresh);
  };
  // 回显表单
  const setRule = (rule: string, row: any) => {
		state.formRow = row;
		formDesignerRef.value.setRule(rule);
  };
  const clickSave = () => {
		if (formDesignerRef.value.designerRef.getJson() === '[]') {
      ElMessage.error('至少添加一个组件');
      return false;
    }
    designerModalRef.value.openDialog(formDesignerRef.value.designerRef.getJson(), state.formRow);
  };
  defineExpose({
    setRule
  })
</script>

<style scoped lang="scss">
  .designer-container{
    .btn-box{
      position: fixed;
      bottom: 30px;
      left: 50%;
    }
  }
</style>
