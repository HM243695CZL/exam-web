# 写在前面
## 项目参考[【vue-next-admin】](https://gitee.com/lyt-top/vue-next-admin)
### 技术栈
- vue全家桶 `vue3` `vue-router` `vuex`
- UI `ElementPlus`
- 表格插件 `vxe-table`
- 网络请求 `axios`
- 构建工具 `vite`
### 开发规范
- vue3与vue2并不相同，需要熟悉vue3的常用语法【vue3与vue2不可混用】
- 配置
    - 开发环境请求地址：`.env.development`
    - 生产环境请求地址：`.env.production`
- API接口
    - 接口请求地址请在`/@/api/`目录下定义
    - 请求地址变量请以`Api`结尾
    - `/@/api/common` 公共接口
        - `reviewFileUrl` 预览接口
        - `postAction` post请求
        - `getAction` get请求
        - `uploadAction` 上传文件请求
- 公共组件 `/@/components`
    - 组件注册请使用大写，如`CommonTop`
    - 组件说明
        - `/@/components/CommonModal` 公共弹窗组件 
        - `/@/components/CommonTop` 顶部公共组件
        - `/@/components/Editor/ImageEditor.vue` 图片编辑器
        - `/@/components/Editor/Wangeditor.vue` 富文本编辑器
        - `/@/components/Editor/MdEditor.vue` Markdown编辑器
        - `/@/components/FormCreate` 表单生成组件
        - `/@/components/FormDesigner` 表单设计组件
        - `/@/components/iconSelector` 图标选择
        - `/@/components/PaginationCommon` 分页公共组件
        - `/@/components/PreviewFile` 文件在线预览
        - `/@/components/previewImg` 图片预览
        - `/@/components/Upload/MultiUpload.vue` 多文件显示上传组件
        - `/@/components/Upload/SingleUpload.vue` 单文件显示上传组件
- **组合式API `/@/hooks`**
    - *`useCrud` 常见的页面操作【增删改查】*
    - *`useCommonModal`常见的弹窗操作【增删改查】*
- 路由
    1. 项目可以动态加载路由
    2. 创建文件说明
        1. 路由组件需要设置`name`属性
        2. 创建路由地址对应文件名即可自动注册路由
        3. 弹窗组件放置在`./component`下
        4. 创建文件夹区分各个弹窗模块
        5. 弹窗命名请以`Modal.vue`为后缀命名
- `vxe-table` 插件统一配置【`main.ts`】
    - 支持列拖拽
    - 数据单行显示
    - 固定表头

### 开发说明
- 开发时尽量保证浏览器的`console`无警告信息
- 组件传参`props`需声明参数类型
- `/@`代表`src`目录
- `el-tree` `el-tree-select`回显问题
    - 通过`setCurrentKey`进行回显
    - `menuTreeRef.value.setCurrentKey(id)`
- `v-for`必须设置`key`属性
- `v-for`与`v-if`不能在同一个元素同时使用
- 富文本编辑器回显内容
    - `wangEditorRef.value.editorRef.setHtml('需要回显的内容')`

### 相关文档地址
- [vxe-table](https://vxetable.cn/#/table/start/install)
- [vue3中文文档](https://www.javascriptc.com/vue3js/guide/introduction.html)
- [element-plus](https://element-plus.gitee.io/zh-CN/guide/design.html)
- [lodash中文文档](https://www.lodashjs.com/)
- [vite中文文档](https://vitejs.cn/vite3-cn/guide/why.html)
- [富文本编辑器：wangEditor](https://www.wangeditor.com/)
- [表单生成器：form-create](http://www.form-create.com/v3/guide/)
- [表单设计器：form-designer](http://designer.form-create.com/guide/)
- [md编辑器: v-md-editor](https://code-farmer-i.github.io/vue-markdown-editor/zh/quick-start.html#%E5%AE%89%E8%A3%85)
- [图片编辑器: tui-image-editor](https://juejin.cn/post/7027943745530101773#heading-10)
- [西瓜播放器: xgplayer](https://v2.h5player.bytedance.com/gettingStarted/#%E5%AE%89%E8%A3%85)
