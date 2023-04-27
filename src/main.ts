import { createApp } from 'vue';
import dayjs from 'dayjs';
import {
	VXETable,
	Table,
	Icon,
	Column,
	Filter
} from 'vxe-table';
import formCreate from '@form-create/element-ui';
import FcDesigner from '@form-create/designer';
import 'vxe-table/lib/style.css';

// md编辑器
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'; // emoji
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';

import createLineNumberPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'; // 代码行号

import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index'; // 高亮代码行
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';

import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index'; // 快捷复制代码
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

import Prism from 'prismjs';

import pinia from '/@/stores/index';
import App from '/@/App.vue';
import router from '/@/router';
import { directive } from '/@/directive/index';
import other from '/@/utils/other';

import ElementPlus from 'element-plus';
import '/@/theme/index.scss';

const app = createApp(App);

function useTable(app: any) {
	app.use(Table).use(Icon).use(Column).use(Filter);
}
VXETable.setup({
	table: {
		stripe: true, // 斑马条纹
		border: true, // 边框
		align: 'center', // 文字居中
		highlightHoverRow: true, // 鼠标移入高亮当前行
		showOverflow: 'title', // 单行显示,
		columnConfig: {
			resizable: true, // 可拖拽列
		},
		filterConfig: {
			remote: true, // 开启后端筛选
			iconNone: 'vxe-icon-search', // 设置筛选图标
			iconMatch: 'vxe-icon-search', // 设置筛选图标
		},
		sortConfig: {
			remote: true // 开启后端排序
		}
	}
});
VXETable.formats.add('formatDate', ({ cellValue }) => {
	return dayjs(new Date(cellValue)).format('YYYY-MM-DD HH:mm:ss');
});
VueMarkdownEditor.use(vuepressTheme, {
	Prism,
	codeHighlightExtensionMap: {
		vue: 'html',
	},
}).use(createEmojiPlugin())
	.use(createLineNumberPlugin())
	.use(createHighlightLinesPlugin())
	.use(createCopyCodePlugin());


directive(app);
other.elSvg(app);

// @ts-ignore
app.use(pinia).use(router).use(ElementPlus).use(formCreate).use(FcDesigner)
	.use(useTable).use(VueMarkdownEditor).mount('#app');
