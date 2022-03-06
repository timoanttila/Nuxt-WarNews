export default {
	target: 'static',
	head: {
		meta: [
			{ charset: 'UTF-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
			{ property: 'og:type', content: 'website' },
			{ property: 'og:site_name', content: 'War News' },
			{ name: "twitter:image", property: "og:image", content: "https://warnews.info/warnews.jpg" },
			{ property: "og:image:secure_url", content: "https://warnews.info/warnews.jpg" },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:image:type", content: "jpeg" },
			{ name: 'twitter:creator', content: '@_timoanttila' },
			{ name: 'twitter:card', content: 'summary_large_image' },
			{ name: 'theme-color', content: '#005ea0' },
			{ name: 'apple-mobile-web-app-status-bar-style', content: '#005ea0' },
			{ name: 'apple-mobile-web-app-capable', content: 'yes' },
			{ name: 'msapplication-TileColor', content: '#005ea0' },
			{ name: 'msapplication-TileImage', content: '/icons/ms-icon-144x144.png' },
		],
		link: [
			{ rel: 'dns-prefetch', href: 'https:/api.warnews.info/' },
			{ rel: 'icon', type: 'image/x-icon', href: 'https://warnews.info/favicon.ico' },
			{ rel: 'icon', type: 'image/png', href: '/icons/favicon-96x96.png', sizes: '96x96' },
			{ rel: 'icon', type: 'image/png', href: '/icons/android-icon-192x192.png', sizes: '192x192' },
			{ rel: 'apple-touch-icon', type: 'image/png', href: '/icons/apple-icon-57x57.png', sizes: '57x57' },
			{ rel: 'apple-touch-icon', type: 'image/png', href: '/icons/apple-icon-60x60.png', sizes: '60x60' },
			{ rel: 'apple-touch-icon', type: 'image/png', href: '/icons/apple-icon-72x72.png', sizes: '72x72' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-76x76.png', sizes: '76x76' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-114x114.png', sizes: '114x114' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-120x120.png', sizes: '120x120' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-144x144.png', sizes: '144x144' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-152x152.png', sizes: '152x152' },
			{ rel: 'icon', type: 'image/png', href: '/icons/apple-icon-180x180.png', sizes: '180x180' }
		],
		script: [
			{
				type: 'application/ld+json',
				json: {
					"@context": "https://schema.org/", "@type": "WebSite", "url": "https://warnews.info/", "image": "https://warnews.info/warnews.jpg", "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://warnews.info/?search={search_term_string}" }, "query-input": "required name=search_term_string" }
				}
			},
		],
	},
	css: [
		'@/assets/global.css',
	],
	plugins: [
		'~/plugins/postdata.js',
		'~/plugins/vue-observe-visibility.js'
	], components: true
}
