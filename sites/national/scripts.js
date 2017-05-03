function vueSetup() {

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'menu' : [
				{ "name" : "Contacts", "children" : [
						{ "name" : "Nationaux", "url" : "#" },
						{ "name" : "Régionaux", "url" : "#" }
					]
				},
				{ "name" : "Espace militants", "children" : [
						{ "name" : "Actus & idées", "url" : "#" },
						{ "name" : "Equipe nationale", "url" : "#" },
						{ "name" : "Postes à pourvoir", "url" : "#" },
						{ "name" : "Statuts et textes", "url" : "#" }
					]
				},
				{ "name" : "Faire un don", "url" : "#" },
				{ "name" : "Adhérer", "url" : "#", "emphasize" : true },
				{ "name" : "Twitter", "icon" : "twitter", "url" : "#" },
				{ "name" : "Facebook", "icon" : "facebook", "url" : "#" },
				{ "name" : "RSS", "icon" : "rss", "url" : "#" }
			],
			'articles': [
				{"placeholder" : true },
				{"placeholder" : true },
				{"placeholder" : true }
			],
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})



	// DATA FETCHING

	var _airTable = new airTable(apiKey='keyiXWAznJ80FXmtW', appKey='appfukGiseC6qP8yb')

	Vue.http.get(_airTable.ListEndpoint('Actus')).then((response) => {
		var actus = _airTable.Clean(response.body.records) // get first 3 actus
		actus = actus.filter(function( actu ) {
			return !actu.hasOwnProperty('Exclure');
		})
		actus = actus.slice(0,3)
		store.commit('updateData', {'articles': actus})
	})


	// COMPONENTS

	Vue.component('article-wall', {
		props: ['articles'],
		template: `
			<div class="articleWall">
				<h2>Idées & actualités</h2>
				<div class="articleWall__scroller">
					<template v-for="article in articles">
						<a v-if="!article.placeholder" class="articleWall__anchor" :href="article.Lien">
							<div class="articleWall__illustration" :style="{ backgroundImage: 'url(' + article.Illustration[0].thumbnails.large.url + ')' }"></div>
							<span class="articleWall__title" v-html="article.Titre"></span>
						</a>
						<a v-else class="articleWall__anchor articleWall__anchor--placeholder">
							<div class="articleWall__illustration"></div>
							<span class="articleWall__title">&nbsp;</span>
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
				<a v-for="link in children" class="dropdown-item" :href="link.url" v-html="link.name"></a>
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
				v-html="text"
				:href="children ? '#' : url"
				:data-toggle="children ? 'dropdown' : ''"
				:class="{
					'nav-link': true,
					'nav-text-link': true,
					'nav-link--emphasize': emphasize,
					'dropdown-toggle': children
					}"
				>
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
										<img class="title__image" src="long-logo-white.svg" :alt="state.meta.name" />
									</h1>
								</div>
								<div class="col-md-6 col-lg-5 offset-lg-1 header-item email-wrapper">
									<h2>Rejoins-nous !</h2>
									<form>
										<div class="input-group">
											<input type="email" placeholder="mon@adresse.mail" class="form-control form-control-lg">
											<span class="input-group-btn">
												<button type="submit" class="btn btn-lg btn-secondary email-submit">→</button>
											</span>
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
					<article-wall :articles="state.articles" class="container"></article-wall>
				</section>

				<section>
					<article-wall :articles="state.articles" class="container"></article-wall>
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
			}
		}
	})

}


