function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'site': {
				'name': "Jeunes Démocrates d'Alsace",
				'description' : "Groupe local représentant les jeunes adhérents du Mouvement Démocrate",
				'facebookFeed': 'jeunes-democrates',
				'twitterFeed': 'J_Democrates'
			}
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})

	Vue.component('main-nav', {
		props: ['brand'],
		template: `
			<nav class="navbar navbar-light">
				<div class="container">
					<a class="navbar-brand" href="#">
						<img src="logo.png" class="navbar__logo">
						<span v-html="brand"></span>
					</a>
				</div>
			</nav>
		`
	})






	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div class="sheet" lang="fr">

				<section v-if="site.name || site.description">

					<h1 class="site-header">
						<span v-if="site.name" class="site-name">{{ site.name }}</span>
						<span v-if="site.description" class="site-description">{{ site.description }}</span>
					</h1>

					<nav>Actualités · L'équipe · Contactez-nous</nav>


				</section>

				<section>

					<h2 class="section-heading">
						Actualités
					</h2>

				</section>

				<section>

					<h2 class="section-heading">
						Notre équipe
					</h2>

				</section>

				<section>

					<h2 class="section-heading">
						Contactez-nous
					</h2>

				</section>

			</div>
	
		`,
		computed: {
			site () {
				return this.$store.state.site
			}
		}
	})

	var title = new Vue({
		el: 'title',
		store,
		template: `
			<title>{{ site.name }}</title>
		`,
		computed: {
			site () {
				return this.$store.state.site
			}
		}
	})

}


