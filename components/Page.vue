<template>
	<div id="page">
		<nuxt-link
			id="changeLanguage"
			class="flyingLink"
			:to="changeLanguage.url"
			:hreflang="changeLanguage.abbr"
		>
			<span class="bold">{{ changeLanguage.abbr }}</span>
		</nuxt-link>

		<button
			v-if="service || search"
			id="resetSearch"
			class="flyingLink"
			@click="reset"
		>
			<span class="bold">X</span>
		</button>

		<header role="banner">
			<h1>{{ fixedTitle ? fixedTitle : title }}</h1>
			<div v-if="desc && !service" id="description">
				{{ desc }}
			</div>

			<div id="author">
				<a href="https://twitter.com/_timoanttila" rel="author">
					@_timoanttila
				</a>
			</div>

			<form v-if="!service" @submit.prevent="findResults" id="search">
				<input
					type="search"
					v-model="search"
					minlength="4"
					maxlength="50"
					:placeholder="searchPlaceholder"
					required
				/>
				<button :aria-label="searchButton">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
					>
						<title>Search Icon</title>
						<path
							d="M21.172 24l-7.387-7.387c-1.388.874-3.024 1.387-4.785 1.387-4.971 0-9-4.029-9-9s4.029-9 9-9 9 4.029 9 9c0 1.761-.514 3.398-1.387 4.785l7.387 7.387-2.828 2.828zm-12.172-8c3.859 0 7-3.14 7-7s-3.141-7-7-7-7 3.14-7 7 3.141 7 7 7z"
						/>
					</svg>
				</button>
			</form>
		</header>

		<ul
			v-if="Array.isArray(articles) && articles[0]"
			id="news"
			:aria-label="aria"
		>
			<li
				v-for="(article, i) of articles"
				:key="article.id"
				v-observe-visibility="
					i === articles.length - 2 ? lazyLoadArticles : false
				"
			>
				<a :href="article.url" :hreflang="lang" rel="nofollow">
					<strong>
						{{ article.title }}
					</strong>
				</a>

				<span class="description">
					{{ article.summary }}
				</span>

				<span class="service" data-nosnippet>
					<small>
						<nuxt-link
							v-if="!service"
							class="inline"
							:to="{
								query: { service: article.service },
							}"
							:key="article.service"
						>
							{{ article.serviceName }}
						</nuxt-link>
						{{ article.created }}
					</small>
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "War News",
			},
			desc: {
				type: String,
				default:
					"Comprehensive news coverage in English about the war and its effects. The list is updated daily.",
			},
			lang: {
				type: String,
				default: "en",
			},
			aria: {
				type: String,
				default: "Current war-related news",
			},
			searchPlaceholder: {
				type: String,
				default: "Keywords",
			},
			searchButton: {
				type: String,
				default: "Search",
			},
			hid: {
				type: Number,
				default: 1,
			},
			locale: {
				type: String,
				default: "en_US",
			},
		},
		data() {
			return {
				articles: [],
				pageNum: 1,
				limit: 50,
				search: "",
				fixedTitle: "",
				stop: false,
				baseUrl: this.lang == "fi" ? "/fi" : "/",
				changeLanguage: {
					abbr: this.lang == "fi" ? "en" : "fi",
					url: this.lang == "fi" ? "/" : "/fi",
				},
				service: "",
			};
		},
		async fetch() {
			let select = `limit=${this.limit}&pageNumber=${this.pageNum}&lang=${this.lang}`;

			if (this.$route.query.search) {
				this.search = await this.fixString(this.$route.query.search);
				select += `&search=${this.search}`;
			}

			if (this.$route.query.service) {
				this.service = parseInt(this.$route.query.service);
				select += `&service=${this.service}`;
			}

			const result = await this.$post(select);
			if (Array.isArray(result) && result[0]) {
				if (this.service) {
					this.fixedTitle = result[0].serviceName;
				}

				this.articles = [...this.articles, ...result];
			} else {
				this.stop = true;
			}
		},
		methods: {
			lazyLoadArticles(isVisible) {
				if (
					isVisible &&
					this.articles.length <= this.pageNum * this.limit &&
					!this.stop
				) {
					this.pageNum++;
					this.$fetch();
				}
			},
			findResults() {
				this.$nuxt.$options.router.push(
					`${this.$nuxt.$route.path}?search=${this.fixString(
						this.search
					)}`
				);
			},
			fixString(item) {
				return item.replace(/[^a-zA-Z0-9äÄåÅöÖ_., -]/g, "");
			},
			reset() {
				this.service = "";
				this.search = "";
				this.fixedTitle = "";
				this.$nuxt.$options.router.push(this.$nuxt.$route.path);
			},
		},
		watch: {
			$route: function (value) {
				this.articles = [];
				this.$fetch();
			},
		},
		head() {
			return {
				title: this.title,
				htmlAttrs: {
					lang: this.lang,
				},
				meta: [
					{ property: "og:locale", content: this.locale },
					{
						property: "og:title",
						name: "twitter:title",
						content: this.title,
					},
					{
						name: "twitter:description",
						property: "og:description",
						content: this.description,
					},
					{
						hid: `page-${this.hid}`,
						name: "description",
						content: this.desc,
					},
				],
			};
		},
	};
</script>