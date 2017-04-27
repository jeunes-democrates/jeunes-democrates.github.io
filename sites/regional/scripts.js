function vueSetup() {

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'menu' : [
				{ "name" : "L'association", "children" : [
						{ "name" : "Pourquoi des Jeunes Démocrates ?", "url" : "#" },
						{ "name" : "Qui se cache derrière ?", "url" : "#" }
					]
				},
				{ "name" : "Les idées", "url" : "#" },
				{ "name" : "Contacts", "children" : [
						{ "name" : "Nationaux", "url" : "#" },
						{ "name" : "Régionaux", "url" : "#" }
					]
				},
			],
			'articles': [],
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
				<h2>Publications récentes</h2>
				<div class="articleWall__scroller">
					<a class="articleWall__anchor" v-for="article in articles" :href="article.Lien">
						<div class="articleWall__illustration" :style="{ backgroundImage: 'url(' + article.Illustration[0].thumbnails.large.url + ')' }"></div>
						<span class="articleWall__title" v-html="article.Titre"></span>
					</a>
				</div>
			</div>
		`
	})

	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<div class="container">
					<div class="top-wrapper">
						<h1>
							<img class="title__image" src="long-logo-white.svg" :alt="state.meta.name" />
						</h1>
						<div class="subtitle">Yvelines</div>
					</div>
				</div>

				<section>
					<article-wall :articles="state.articles" class="container"></article-wall>
				</section>

			</div>
	
		`,
		computed: {
			state () {
				return this.$store.state
			}
		}
	})

}


