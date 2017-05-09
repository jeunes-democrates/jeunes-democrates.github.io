function vueSetup() {

	// Store
	window.store = new Vuex.Store({
		state: {
			'candidats': [],
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

	var _airTable = new airTable(apiKey='keyiXWAznJ80FXmtW', appKey='appBhCJCYLiO1wmoj')

	Vue.http.get(_airTable.ListEndpoint('Candidats')).then((response) => {
		var candidats = _airTable.Clean(response.body.records) // get first 3 actus
		candidats = candidats.filter(function( candidat ) {
			return !candidat.hasOwnProperty('Cacher');
		})
		store.commit('updateData', {'candidats': candidats})
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
							Candidats du Mouvement Démocrate aux élections législatives
						</h1>
					</div>
				</div>

				<section class="candidateWall container">
					<div class="candidat" v-for="candidat in state.candidats">
						<h2>{{ candidat['Prénom'] }} {{ candidat['Nom'] }}</h2>
						<p class="circonscription">{{ candidat['Circonscription'] }}</p>
						<p v-if="candidat['Twitter']"><img :src="'https://twitter.com/' + candidat['Twitter'] + '/profile_image?size=bigger'"></p>
						<p v-if="candidat['Twitter']"><a :href="'https://twitter.com/' + candidat['Twitter']">@{{ candidat['Twitter'] }}</a></p>
					</div>
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


