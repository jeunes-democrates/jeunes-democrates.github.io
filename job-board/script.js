function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			jobs: [],
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
	Vue.http.get(_airTable.ListEndpoint('Postes ouverts')).then((response) => {
		var jobs = _airTable.Clean(response.body.records)
		store.commit('updateData', {'jobs': jobs})
	})


	// Components
	var JobBoard = {
		template: `
			<div class="jobboard__jobs" lang="fr">

				<div class="jobboard__column-wrapper" v-for="job in jobs" v-if="!job.Hide">
				<div class="jobboard__job slideUp">
	
					<div class="jobboard__job__header">
						<div class="jobboard__job__name">{{ job.Name }}</div>
					</div>
					
					<div class="jobboard__job__body">
						<div class="jobboard__job__description" v-html="marked(job.Description)"></div>
						<a class="jobboard__job__apply" :href="'http://jeunes-democrates.org/candidater-a-un-poste/?poste=' + encodeURI(job.Name)">Postuler</a>
					</div>
	
				</div>
				</div>

				<div class="spinner hide-if-not-first"></div>
	
			</div>
		`,
		computed: {
			jobs () {
				return this.$store.state.jobs
			}
		}
	}
	
	
	// App
	var app = new Vue({
		el: '#app',
		store,
		components: { 'job-board': JobBoard },
		template: `
			<div class="app">
				<job-board></job-board>
			</div>
		`
	})
}