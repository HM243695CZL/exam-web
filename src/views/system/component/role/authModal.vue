<template>
  <div class="auth-modal-container">
    <el-dialog :append-to-body='false'
               :close-on-click-modal='false'
               :title='state.title'
               v-model='state.isShowDialog' width='600px'>
      <el-tree
          ref='treeRef'
          :data="props.menuList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="state.selectedMenuIds"
          :props="state.defaultProps"
      />
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
  import {getAction, postAction} from '/@/api/common';
  import {authRoleApi, viewAuthRoleApi} from '/@/api/system/role';
  import {StatusEnum} from '/@/common/status.enum';
  import {ElMessage} from 'element-plus';

  const props = defineProps({
    menuList: {
      type: Array,
      required: true
    }
  });
  const treeRef = ref();
  const state = reactive({
    id: '',
    isShowDialog: false,
    title: '分配权限',
    selectedMenuIds: [],
    defaultProps: {
      children: 'children',
      label: 'title'
    }
  });
  const openDialog = (id: string) => {
    state.isShowDialog = true;
    state.id = id;
    nextTick(() => {
      getAction(`${viewAuthRoleApi}/${id}`, '').then(res => {
        if (res.status === StatusEnum.SUCCESS) {
          state.selectedMenuIds = res.data;
          treeRef.value.setCheckedKeys([], false)
          treeRef.value.setCheckedKeys(res.data, false);
        }
      })
    })
  };
  const closeDialog = () => {
    state.isShowDialog = false;
  };
  const clickConfirm = () => {
    postAction(authRoleApi, {
      menuIds: treeRef.value.getCheckedKeys(),
      id: state.id
    }).then(res => {
      if (res.status === StatusEnum.SUCCESS) {
        ElMessage.success(res.message);
        closeDialog();
      }
    })
  };
  defineExpose({
    openDialog
  });
</script>

<style scoped lang="less">

</style>
