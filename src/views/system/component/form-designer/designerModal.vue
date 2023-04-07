<template>
  <div class="designer-modal-container">
    <el-dialog :append-to-body='false'
               :close-on-click-modal='false'
               :title='state.title'
               v-model='state.isShowDialog' width='600px'>
      <el-form ref='formRef' :rules='state.rules' :model='state.ruleForm' label-width='100px'>
        <el-form-item label="表单名称" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入表单名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="表单key" prop="formKey">
          <el-input v-model="state.ruleForm.formKey" placeholder="请输入表单key" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="state.ruleForm.remark" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class='dialog-footer'>
          <el-button @click='closeDialog'>取 消</el-button>
          <el-button type='primary' @click='clickConfirm'>确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, reactive, ref} from 'vue';
import {postAction} from '/@/api/common';
import {createFormDesignApi, updateFormDesignApi} from '/@/api/system/form-designer';
import {StatusEnum} from '/@/common/status.enum';
import {ElMessage} from 'element-plus';

  const emits = defineEmits([
    'refreshList'
  ]);
  const formRef = ref();
  const state = reactive({
    isShowDialog: false,
    title: '',
    ruleForm: {
      id: '',
      name: '',
      formKey: '',
      remark: '',
      config: null
    },
    rules: {
      name: [
        { required: true, message: '表单名称不能为空', trigger: 'blur' }
      ],
      formKey: [
        { required: true, message: '表单key不能为空', trigger: 'blur' }
      ]
    }
  });
  const openDialog = (formData: any, row: any) => {
    state.isShowDialog = true;
    state.ruleForm.id = '';
    nextTick(() => {
      formRef.value.resetFields();
			if (row.id) {
				state.ruleForm = row;
				state.title = '修改表单配置';
			} else {
				state.title = '新增表单配置';
			}
			state.ruleForm.config = formData;
    });
  };
  const closeDialog = () => {
    state.isShowDialog = false;
  };
  const clickConfirm = () => {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        postAction(state.ruleForm.id ? updateFormDesignApi : createFormDesignApi, state.ruleForm).then(res => {
          if (res.status === StatusEnum.SUCCESS) {
            ElMessage.success(res.message);
            closeDialog();
            emits('refreshList');
          }
        });
      }
    })
  };
  defineExpose({
    openDialog
  });
</script>

<style scoped lang="scss">

</style>
