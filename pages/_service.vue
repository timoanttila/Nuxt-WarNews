<template>
	<div v-if="service" id="Service">
		<nuxt-link id="changeLanguage" to="/" hreflang="en">
			<span>X</span>
		</nuxt-link>

		<Page :service="parseInt(service)" :hid="parseInt(hid)" />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				service: "",
				hid: 0,
			};
		},
		mounted() {
			this.service = this.$route.params.service;
			this.hid = 3 + this.service;
		},
	};
</script>