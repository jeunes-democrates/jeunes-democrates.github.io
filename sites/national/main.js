requirejs.config({ nodeRequire: require });

requirejs([
	'node_modules/vue/dist/vue.js',
	'node_modules/vuex/dist/vuex.js',
	'node_modules/vue-resource/dist/vue-resource.js'
	], function(Vue, Vuex, VueResource) {

	Vue.use(Vuex)
	Vue.use(VueResource)

	// Placeholders

	window.placeholders = {
		'articles' : [
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true },
			{ "placeholder" : true }
		]
	}

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'menu' : [
				{ "name" : "Actus & idées", "url" : "#" },
				{ "name" : "Contacts", "children" : [
						{ "name" : "Nationaux", "url" : "#" },
						{ "name" : "Régionaux", "url" : "#" }
					]
				},
//				{ "name" : "Espace militants", "url" : "#" },
//				{ "name" : "Faire un don", "url" : "#" },
//				{ "name" : "Adhérer", "url" : "#", "emphasize" : true },
				{ "name" : "Twitter", "icon" : "twitter", "url" : "https://twitter.com/J_Democrates" },
				{ "name" : "Facebook", "icon" : "facebook", "url" : "https://facebook.com/JeunesDemocrates" },
				{ "name" : "RSS", "icon" : "rss", "url" : "https://medium.com/feed/133b" }
			],
			'articles': placeholders.articles,
			'presentation': [
				{
					'title': "Notre équipe",
					'thumbnail': "http://www.publicdomainpictures.net/pictures/140000/velka/rainbow-1445337690d8q.jpg",
					'link': "#"
				},
				{
					'title': "Nos actions et évènements",
					'thumbnail': "http://www.publicdomainpictures.net/pictures/140000/velka/rainbow-1445337690d8q.jpg",
					'link': "#"
				},
				{
					'title': "Nos valeurs et notre histoire",
					'thumbnail': "http://www.publicdomainpictures.net/pictures/140000/velka/rainbow-1445337690d8q.jpg",
					'link': "#"
				}
			]
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})

	//	, "children" : [
	//		{ "name" : "Actus & idées", "url" : "#" },
	//		{ "name" : "Equipe nationale", "url" : "#" },
	//		{ "name" : "Missions à pourvoir", "url" : "#" },
	//		{ "name" : "Statuts et textes", "url" : "#" }
	//	]

		

	// COMPONENTS

	Vue.component('article-block', {
		props: ['articles', 'title'],
		template: `
			<div class="articleWall">
				<h2>{{ title }}</h2>
				<div class="articleWall__scroller">
					<template v-for="article in articles">
						<a class="articleWall__anchor" :href="article.link" target="_blank">
							<div class="articleWall__illustration" :style="{ backgroundImage: 'url(' + article.thumbnail + ')' }"></div>
							<div class="articleWall__loader"><i class="fa fa-circle-o-notch fa-spin fa-3x"></i></div>
							<div class="articleWall__title">{{ article.title }}</div>
						</a>
					</template>
				</div>
			</div>
		`
	})

	Vue.component('dropdown-children', {
		props: ['children'],
		template: `
			<div class="dropdown-menu">
				<a v-for="link in children" class="dropdown-item" :href="link.url">
					{{ link.name }}
				</a>
			</div>
		`
	})

	Vue.component('nav-icon-link', {
		props: ['title', 'icon', 'url', 'children', 'emphasize'],
		template: `
			<a
				:title="title"
				:href="children ? '#' : url"
				:data-toggle="children ? 'dropdown' : ''"
				:class="{
					'nav-link': true,
					'nav-icon-link': true,
					'nav-link--emphasize': emphasize,
					'dropdown-toggle': children
					}"
				target="_blank"
				>
				<i :class="getIconClass()"></i>
			</a>
		`,
		methods:{
			getIconClass() { return "fa fa-lg fa-" + this.icon }
		}
	})

	Vue.component('nav-text-link', {
		props: ['text', 'url', 'children', 'emphasize'],
		template: `
			<a
				:href="children ? '#' : url"
				:data-toggle="children ? 'dropdown' : ''"
				:class="{
					'nav-link': true,
					'nav-text-link': true,
					'nav-link--emphasize': emphasize,
					'dropdown-toggle': children
					}"
				>{{ text }}
			</a>
		`
	})

	Vue.component('main-nav', {
		props: ['menu'],
		template: `
			<nav>
				<span v-for="menuItem in menu" :class="[menuItem.hasOwnProperty('children') ? 'dropdown' : '']">
					<nav-icon-link v-if="menuItem.icon"
						:title="menuItem.name"
						:icon="menuItem.icon"
						:url="menuItem.url"
						:children="menuItem.children"
						:emphasize="menuItem.emphasize"
						></nav-icon-link>
					<nav-text-link v-else
						:text="menuItem.name"
						:url="menuItem.url"
						:children="menuItem.children"
						:emphasize="menuItem.emphasize"
						></nav-text-link>
					<dropdown-children
						v-if="menuItem.children"
						:children="menuItem.children"
						></dropdown-children>
				</span>
			</nav>
		`
	})


	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<header>
					<div class="top-background">
						<div class="container">
							<div class="row header-wrapper">
								<div class="col-md-6 header-item">
									<h1>
										<img class="title__image" src="media/long-logo-white.svg" :alt="state.meta.name" />
									</h1>
								</div>
								<div class="col-md-6 col-lg-5 offset-lg-1 header-item email-wrapper">
									<h2>Rejoins-nous !</h2>
									<form>
										<div class="input-group">
											<input type="email" placeholder="mon@adresse.mail" class="form-control form-control-lg">
											<div class="input-group-append">
												<button type="submit" class="btn btn-lg btn-primary email-submit"><i class="fa fa-chevron-right"></i></button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div class="nav-wrapper">
						<main-nav :menu="state.menu" class="container"></main-nav>
					</div>
				</header>

				<section>
					<article-block
						:articles="state.articles"
						:title="'Nos idées & actualités'"
						class="container"
						:class="{ loading: (state.articles==placeholders.articles) }"
						></article-block>
				</section>

				<footer>
					<div class="container text-muted text-center small">
						<p>Les Jeunes Démocrates, tous droits réservés.</p>
						<p>
							<a href="">Jeunes Démocrates Européens</a> · 
							<a href="">Mouvement Démocrate</a> · 
							<a href="">Parti Démocrate Européen</a>
						</p>
						<p>
							<a href="">Mentions légales</a> · 
							<a href="">Twitter</a> · 
							<a href="">Facebook</a>
						</p>
					</div>
				</footer>

			</div>
	
		`,
		computed: {
			state () {
				return this.$store.state
			},
			placeholders() {
				return placeholders
			},
		}
	})


	// DATA FETCHING

	function getThumbnail(article) {
		console.log(article.description)
		var articleImages = article.description.match("https:\/\/cdn-images-1.medium.com\/max\/960\/([^.]*).(jpg|png|jpeg)")
		if (articleImages) {
			var thumbnail = articleImages[0].replace("/960/", "/320/")
			return thumbnail
		} else {
			return "media/meeting.jpg"
		}	
	}

	Vue.http.get("https://api.rss2json.com/v1/api.json?api_key=5ftufd58cwsriwlqozmec5fjliaa479brtt3dra6&rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F133b&count=6")
	.then((response) => {
		var actus = response.body.items
		for (i in actus) {
			actus[i].thumbnail = getThumbnail(actus[i])
		}
		store.commit('updateData', {'articles': actus})
	})

})
