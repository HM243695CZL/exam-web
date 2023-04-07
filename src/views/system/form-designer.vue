<template>
  <div class="form-designer-container h100" ref="formDesignerRef">
    <div class="table-box" v-if="!isView">
      <CommonTop
          @clickSearch="clickSearch"
          @clickReset="clickReset"
          @clickAdd="clickAdd"
      >
        <template #left>
          <el-form-item label="表单名称">
            <el-input v-model="searchParams.name" placeholder="请输入表单名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="表单key">
            <el-input v-model="searchParams.formKey" placeholder="请输入表单key" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="searchParams.remark" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </template>
      </CommonTop>
      <vxe-table
        ref='tableRef'
        :row-config='{
          useKey: true,
          keyField: "id"
        }'
        :data='dataList'
        :max-height='tableHeight'
      >
        <vxe-column type="seq" title="序号" width="60" />
        <vxe-column title="表单名称" field="name" />
        <vxe-column title="表单key" field="formKey" />
        <vxe-column title="备注" field="remark" />
        <vxe-column title="添加时间" field="addTime" />
        <vxe-column title="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="default" @click="clickEdit(scope.row)">修改</el-button>
            <el-button size="small" type="danger" @click="clickDelete(scope.row.id)">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <PaginationCommon
          :page-info='pageInfo'
          @changePageSize='changePageSize'
          @changePageIndex='changePageIndex'
      />
    </div>
    <Designer
        ref="designerRef"
        v-if="isView"
        @back="back"
    />
  </div>
</template>

<script lang="ts">

import {nextTick, reactive, ref, toRefs} from 'vue';
import {deleteFormDesignApi, getFormDesignPageApi} from '/@/api/system/form-designer';
import useCrud from '/@/hooks/useCrud';
import CommonTop from '/@/components/CommonTop/index.vue';
import PaginationCommon from '/@/components/PaginationCommon/index.vue';
import Designer from './component/form-designer/designer.vue';

export default {
  name: 'form-designer',
  components: {
    CommonTop,
    PaginationCommon,
    Designer
  },
  setup() {
    const formDesignerRef = ref();
    const designerRef = ref();
    const state = reactive({
      uris: {
        page: getFormDesignPageApi,
        delete: deleteFormDesignApi
      },
      isView: false
    });
    const clickAdd = () => {
      state.isView = true;
    };
    const clickEdit = (row: any) => {
      state.isView = true;
      nextTick(() => {
        designerRef.value.setRule(row.config, row);
      });
    };
    const back = (refresh: boolean) => {
      state.isView = false;
      if(refresh) {
        getDataList();
      }
    }
    const {
      tableRef,
      modalFormRef,
      pageInfo,
      dataList,
      tableHeight,
      searchParams,
      getDataList,
      clickSearch,
      clickReset,
      clickDelete,
      changePageIndex,
      changePageSize
    } = useCrud({
      uris: state.uris,
      parentRef: formDesignerRef
    });

    return {
      formDesignerRef,
      designerRef,
      clickAdd,
      clickEdit,
      back,
      ...toRefs(state),

      tableRef,
      modalFormRef,
      pageInfo,
      dataList,
      tableHeight,
      searchParams,
      getDataList,
      clickSearch,
      clickReset,
      clickDelete,
      changePageIndex,
      changePageSize
    }
  }
}
</script>

<style scoped lang="scss">
  .form-designer-container{
    padding: 20px;
    overflow: auto;
  }
</style>
