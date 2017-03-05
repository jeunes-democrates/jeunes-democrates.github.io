function vueSetup() {

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'menu' : [
				{ "name" : "Notre association", "children" : [
						{ "name" : "Présentation", "url" : "#" },
						{ "name" : "Notre équipe", "url" : "#" },
						{ "name" : "Nos instances", "children" : [
								{ "name" : "Le Bureau National", "url" : "#" },
								{ "name" : "Le Conseil National", "url" : "#" },
								{ "name" : "La Commission d'Arbitrage", "url" : "#" }
							]
						},
						{ "name" : "Nos textes", "children" : [
								{ "name" : "Nos statuts", "url" : "#" },
								{ "name" : "Notre règlement intérieur", "url" : "#" },
								{ "name" : "Notre charte éthique", "url" : "#" }
							]
						}
					]
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


	Vue.component('main-nav', {
		props: ['brand', 'menu'],
		template: `
			<nav class="navbar navbar-light">
				<div class="container">
					<a class="navbar-brand" href="#">
						<img src="logo.png" class="navbar__logo">
						<span v-html="brand"></span>
					</a>
					<ul class="nav">
						<span v-for="menuItem in menu">
							<li v-if="menuItem.hasOwnProperty('url')" class="nav-item">
								<a
									v-html="menuItem.name"
									:href="menuItem.url"
									class="nav-link"
									>
								</a>
							</li>
							<li v-else-if="menuItem.hasOwnProperty('children')" class="nav-item dropdown" >
								<a
									v-html="menuItem.name"
									href="#"
									class="nav-link dropdown-toggle"
									data-toggle="dropdown"
									role="button" aria-haspopup="true" aria-expanded="false"
									>
								</a>
								<div class="dropdown-menu">
									<a class="dropdown-item" href="#">Action</a>
									<a class="dropdown-item" href="#">Another action</a>
									<a class="dropdown-item" href="#">Something else here</a>
									<div class="dropdown-divider"></div>
									<a class="dropdown-item" href="#">Separated link</a>
								</div>
							</li>
						</span>
					</ul>
				</div>
			</nav>
		`
	})






	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<div class="top-background"></div>

				<main-nav :brand="state.meta.name" :menu="state.menu"></main-nav>

				<h1>{{ state.meta.name }}</h1>

			</div>
	
		`,
		computed: {
			state () {
				return this.$store.state
			}
		}
	})

}


