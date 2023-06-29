<template>
	<div class="layout-footer pb15">
		<div class="layout-footer-warp">
			<div class="mt5">
				<div style="width:300px;margin:0 auto;">
					<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=52010302003365" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
						<img :src="beianImg" style="float:left;"/>
						<p style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">贵公网安备 52010302003365号</p>
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutFooter">
import beianImg from '/@/assets/img/beian.png'
// 此处需有内容（注释也得），否则缓存将失败
</script>

<style scoped lang="scss">
.layout-footer {
	width: 100%;
	display: flex;
	&-warp {
		margin: auto;
		color: var(--el-text-color-secondary);
		text-align: center;
		animation: error-num 0.3s ease;
	}
}
</style>
