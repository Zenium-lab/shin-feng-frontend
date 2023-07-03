<template>
	<transition name="fade">
		<div></div>
	</transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Alert',
	props: {
		type: {
			type: String,
			default: 'info',
		},
		title: {
			type: String,
			default: '',
		},
		content: {
			type: String,
			default: '',
		},
	},
});
</script>
