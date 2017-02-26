function readDataFromURL(url) {
	var argumentStrings = url.split('?$')[1].split('&$')
	var argumentsFromUrl = readArguments(argumentStrings)
	return argumentsFromUrl
}

function readArguments(argumentStrings) {
	var argumentTypes = ['nom', 'numero', 'facebook']
		result = {}
	for (i in argumentStrings) {
		var argumentString = argumentStrings[i]
		// For each argument passed through the URL, add it to the result object
		for (i in argumentTypes) {
			var argumentType = argumentTypes[i]
			var split = argumentString.split(argumentType + '=')
			if (split[1]) result[argumentType] = decodeURI(split[1])
		}
	}
	return result
}

function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'meta': {
				'nom': 'Un nom',
				'numero' : 00,
				'facebook' : 'jeunes-democrates'
			},
			'facebookFeed': false
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})

	store.commit('updateData', {'meta': readDataFromURL(window.location.href)})

	var _faceBook = new faceBook(target=store.state.meta.facebook, appSecret='1756208987947530', appSecret='5b4faa1c5187f415b4e2980dd446431c')

	Vue.http.get(_faceBook.Feed()).then((response) => {
		store.commit('updateData', {'facebookFeed': response.body.data})
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

			<div lang="fr">

				<div class="top-background"></div>

				<main-nav :brand="state.meta.nom"></main-nav>

				<div class="first-slide">
				
					<h1>{{ state.meta.nom }}</h1>

					<div hidden v-for="item in state.facebookFeed">{{ item.story }}</div>

				</div>

			</div>
	
		`,
		computed: {
			state () {
				return this.$store.state
			}
		}
	})

}


