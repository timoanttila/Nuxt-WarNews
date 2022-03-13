<template>
	<div id="page">
		<div id="pageContent" class="mx-auto">
			<h1>
				{{ title }}
			</h1>
			<p>
				I apologize for any inconvenience by providing this page instead
				of what you looked for. You should head to the
				<nuxt-link to="/" class="text-link">front page</nuxt-link> next.
				Hopefully, you find what you are looking for.
			</p>
		</div>
	</div>
</template>

<script>
	export default {
		layout: "default",
		props: ["error"],
		data() {
			return {
				title: null,
			};
		},
		mounted() {
			this.title =
				this.error.statusCode === 404
					? "Page not found"
					: "An error occurred";
		},
		head() {
			return {
				htmlAttrs: { lang: "en" },
				title: "Error " + this.error.statusCode + " | " + this.title,
				meta: [{ name: "robots", content: "noindex" }],
			};
		},
	};
</script>

<style scoped>
	#page {
		width: 100vw;
		height: 100vh;
		display: grid;
		overflow: hidden;
	}
	#pageContent {
		text-align: center;
		align-self: center;
		max-width: 500px;
	}
</style>