<template>
	<el-form size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input text placeholder="用户名 admin 或不输均为 common" v-model="ruleForm.username" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input :type="isShowPassword ? 'text' : 'password'" placeholder="密码：123456" v-model="ruleForm.password" autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="isShowPassword = !isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-col :span="15">
				<el-input text maxlength="4" placeholder="请输入验证码" v-model="ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon"><ele-Position /></el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button class="login-content-code" v-waves>1234</el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" round v-waves @click="onSignIn">
				<span>登 录</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { reactive, computed, defineComponent, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';
import { loginApi } from '/@/api/system/user';
import { postAction } from '/@/api/common';
import { StatusEnum } from '/@/common/status.enum';

export default defineComponent({
	name: 'loginAccount',
	setup() {
		// 定义变量内容
		const route = useRoute();
		const router = useRouter();
		const state = reactive({
			isShowPassword: false,
			ruleForm: {
				username: 'admin',
				password: '123456',
				code: '1234',
			},
		});
		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date());
		})
		// 登录
		const onSignIn = async () => {
			postAction(loginApi, {
				username: state.ruleForm.username,
				password: state.ruleForm.password
			}).then(async res => {
				if (res.status === StatusEnum.SUCCESS) {
					const {
						username, avatar, roles
					} = res.data.userInfo;
					// 存储 token 到浏览器缓存
					Session.set('token', res.data.token);
					Session.set('menuList', res.data.menuList);
					Session.set('userInfo', {
						userName: username,
						photo: avatar,
						time: 0,
						roles,
						authBtnList: []
					});
					// 模拟数据，对接接口时，记得删除多余代码及对应依赖的引入。用于 `/src/stores/userInfo.ts` 中不同用户登录判断（模拟数据）
					Cookies.set('userName', state.ruleForm.username);
					const isNoPower = await initFrontEndControlRoutes();
					signInSuccess(isNoPower);
				}
			});
		}
		// 登录成功后的跳转
		const signInSuccess = (isNoPower: boolean | undefined) => {
			if (isNoPower) {
				ElMessage.warning('抱歉，您没有登录权限');
				Session.clear();
			} else {
				// 初始化登录成功时间问候语
				let currentTimeInfo = currentTime.value;
				// 登录成功，跳到转首页
				// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
				if (route.query?.redirect) {
					router.push({
						path: <string>route.query?.redirect,
						query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
					});
				} else {
					router.push('/');
				}
				// 登录成功提示
				const signInText = '欢迎回来！';
				ElMessage.success(`${currentTimeInfo}，${signInText}`);
				// 添加 loading，防止第一次进入界面时出现短暂空白
				NextLoading.start();
			}
		}
		return {
			...toRefs(state),
			onSignIn,
		}
	}
})

</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
