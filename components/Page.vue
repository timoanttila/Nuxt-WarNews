<template>
	<div id="page">
		<nuxt-link
			id="changeLanguage"
			class="flyingLink grid no-underline w-48 h-48"
			:to="changeLanguage.url"
			:hreflang="changeLanguage.abbr"
		>
			<span class="bold self-center">{{ changeLanguage.abbr }}</span>
		</nuxt-link>

		<button
			v-if="service || search"
			id="resetSearch"
			class="flyingLink grid no-underline w-48 h-48"
			@click="reset"
		>
			<span class="bold self-center">X</span>
		</button>

		<header class="mx-auto" role="banner">
			<h1>{{ fixedTitle ? fixedTitle : title }}</h1>
			<div v-if="desc && !service" id="description">
				{{ desc }}
			</div>

			<div id="author">
				<a href="https://twitter.com/_timoanttila" rel="author">
					@_timoanttila
				</a>
			</div>

			<div v-if="!service" id="pageControls" class="mx-auto grid">
				<div class="pageLinkContent">
					<nuxt-link
						v-if="pageLinks.previousPage && pageNum - 1 > 0"
						id="pageLinkLeft"
						class="pageLinks grid no-underline w-48 h-48"
						:to="{
							path: baseUrl,
							query: { page: pageNum - 1 },
						}"
						:title="
							lang == 'fi' ? 'Edellinen sivu' : 'Previous page'
						"
						rel="prev"
					>
						<svg
							class="mx-auto self-center"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<title>Arrow left</title>
							<path
								d="M16.67 0l2.83 2.829-9.339 9.175 9.339
						9.167-2.83 2.829-12.17-11.996z"
							/>
						</svg>
					</nuxt-link>
				</div>

				<form @submit.prevent="findResults" id="search" class="mx-auto">
					<input
						class="h-48"
						type="search"
						v-model="search"
						maxlength="50"
						pattern=".{4,50}"
						:placeholder="lang == 'fi' ? 'Hakusana' : 'Keyword'"
						:title="
							lang == 'fi'
								? 'Hakusanat 5-10 merkkiä'
								: 'Keywords 5-10 characters'
						"
						required
					/>
					<button
						class="w-48 h-48"
						type="submit"
						:title="lang == 'fi' ? 'Etsi' : 'Search'"
					>
						<svg
							class="mx-auto self-center"
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

				<div class="pageLinkContent">
					<nuxt-link
						v-if="pageLinks.nextPage"
						id="pageLinkRight"
						class="pageLinks grid no-underline w-48 h-48"
						:to="{
							path: baseUrl,
							query: { page: pageNum + 1 },
						}"
						:title="lang == 'fi' ? 'Seuraava sivu' : 'Next page'"
						rel="next"
					>
						<svg
							class="self-center mx-auto"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
						>
							<title>Arrow right</title>
							<path
								d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"
							/>
						</svg>
					</nuxt-link>
				</div>
			</div>

			<div v-if="pageLinks && pageLinks.totalCount" id="articlesTotal">
				<small>
					{{ pageLinks.totalCount }}
					{{ lang == "fi" ? "artikkelia" : "articles" }}
					<template v-if="!service">
						- {{ pageNum }} / {{ pageLinks.totalPages }} pages
					</template>
				</small>
			</div>
		</header>

		<div
			id="news"
			:aria-busy="ariaBusy"
			:aria-label="
				lang == 'fi'
					? `Uusimmat sotiin liittyvät uutislinkit. Sivu ${pageNum}.`
					: `Current war-related news links. Page ${pageNum}.`
			"
			role="feed"
		>
			<template v-if="Array.isArray(articles) && articles[0]">
				<article
					v-for="(article, i) of articles"
					:key="article.id"
					v-observe-visibility="
						i === articles.length - 2 && pageLinks.nextPage
							? lazyLoadArticles
							: false
					"
					:aria-posinset="i + 1"
					:aria-setsize="articles.length"
					:aria-labelledby="`article-title-${article.id}`"
					:aria-describedby="`article-description-${article.id} article-publisher-${article.id}`"
					tabindex="0"
				>
					<a
						:id="`article-link-${article.id}`"
						:href="article.url"
						:hreflang="article.languageName"
						rel="external bookmark noopener"
						:aria-labelledby="`article-title-${article.id}`"
					>
						<strong :id="`article-title-${article.id}`">
							{{ article.title }}
						</strong>
					</a>

					<div
						:id="`article-description-${article.id}`"
						class="description"
					>
						{{ article.summary }}
					</div>

					<div class="service" data-nosnippet>
						<small>
							<nuxt-link
								:id="`article-publisher-${article.id}`"
								class="inline"
								:to="{
									query: { service: article.service },
								}"
								:key="article.service"
								rel="publisher"
							>
								{{ article.serviceName }}
							</nuxt-link>

							<time
								:datetime="article.created.datetime"
								:title="article.created.title"
							>
								{{ article.created.view }}
							</time>
						</small>
					</div>
				</article>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "Russia-Ukraine War Updates",
			},
			desc: {
				type: String,
				default:
					"Comprehensive news list about the Russia-Ukraine war and its impact on the world. New articles are added daily.",
			},
			lang: {
				type: String,
				default: "en",
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
				pageNumScroll: 1,
				limit: 30,
				search: "",
				fixedTitle: "",
				ariaBusy: "false",
				baseUrl: this.lang == "fi" ? "/fi/" : "/",
				canoncial: "",
				changeLanguage: {
					abbr: this.lang == "fi" || this.hid == 3 ? "en" : "fi",
					url: this.lang == "fi" || this.hid == 3 ? "/" : "/fi/",
				},
				service: "",
				pageLinks: {},
			};
		},
		async fetch() {
			this.ariaBusy = "true";

			const result = await this.$post(await this.fixQueries());
			if (Array.isArray(result.articles)) {
				if (this.service) {
					this.fixedTitle = result.articles[0].serviceName;
				}

				this.articles = [...this.articles, ...result.articles];

				this.pageLinks = result.info;
			}

			this.ariaBusy = "false";
		},
		methods: {
			lazyLoadArticles(isVisible) {
				if (isVisible && this.pageLinks.nextPage) {
					this.pageNumScroll++;
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
				this.pageNum = 1;
				this.pageNumScroll = 1;
				this.$nuxt.$options.router.push(this.$nuxt.$route.path);
			},
			async fixQueries() {
				let query = "";

				if (this.pageNumScroll > 1) {
					query += !query ? "?" : "&";
					query += `pageNum=${this.pageNumScroll}`;
				}

				if (this.$route.query.size) {
					this.limit = parseInt(this.$route.query.size);
				}

				let select = `limit=${this.limit}&pageNumber=${this.pageNumScroll}`;

				if (this.hid == 3) {
					select += "&photos=1";
				} else {
					select += `&lang=${this.lang}`;

					if (this.$route.query.search) {
						this.search = await this.fixString(
							this.$route.query.search
						);
						select += `&search=${this.search}`;
					}

					if (this.$route.query.service) {
						this.service = parseInt(this.$route.query.service);
						select += `&service=${this.service}`;

						if (this.service) {
							query += !query ? "?" : "&";
							query += `service=${this.service}`;
						}
					}
				}

				this.canoncial = `${this.baseUrl}${query}`;
				return select;
			},
		},
		watch: {
			$route: function (value) {
				this.articles = [];
				this.fixedTitle = "";

				this.pageNum = this.$route.query.page
					? parseInt(this.$route.query.page)
					: 1;

				this.pageNumScroll = this.pageNum;

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
						content: this.desc,
					},
					{
						hid: `page-${this.hid}`,
						name: "description",
						content: this.desc,
					},
				],
				link: [
					{
						rel: "canonical",
						href: `https://warnews.info${this.canoncial}`,
					},
				],
			};
		},
	};
</script>