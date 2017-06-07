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
		var candidats = _airTable.Clean(response.body.records)
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

				<nav>
					<div class="nav-wrapper">
						<span class="brand-logo center">Candidats MoDem aux législatives</span>
					</div>
				</nav>

				<div class="row">
					<div class="col s12 m6 l4 xl3" v-for="candidat in state.candidats">
						<div class="card">
							<div class="card-content">
								<span class="card-title">{{ candidat['Prénom'] }} {{ candidat['Nom'] }}</span>
								<img class="candidat__portrait" :src="'https://twitter.com/' + candidat['Twitter'] + '/profile_image?size=bigger'">
								<p class="circonscription">{{ candidat['Circonscription'] }}</p>
							</div>
							<div class="card-action">
								<a v-if="candidat['Twitter']" :href="'https://twitter.com/' + candidat['Twitter']">Twitter</a>
								<a v-if="candidat['Site']" :href="candidat['Site']">Site</a>
								<span>&nbsp;</span>
							</div>
						</div>
					</div>
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


