<template>
	<div class='form-designer-container'>
		<fc-designer ref='designerRef' />
	</div>
</template>

<script lang='ts' setup>
	import { ref } from 'vue';

	const designerRef = ref();
	const setRule = (rule: string) => {
		designerRef.value.setRule(rule);
	};
	defineExpose({
		setRule,
		designerRef
	})
</script>

<style scoped lang='scss'>

</style>
