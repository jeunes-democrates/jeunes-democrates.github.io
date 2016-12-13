function vueSetup() {
	// Store
	const store = new Vuex.Store({
		state: {
			jobs: [],
		},
		mutations: {
			updateJobs(state, payload) {
				state.jobs = payload
				console.log(payload)
			}
		}
	})


	// Components
	const JobBoard = {
		template: `
			<div class="jobboard__jobs" lang="fr">

				<div class="jobboard__column-wrapper" v-for="job in jobs">
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
	
	Vue.http.get('https://api.airtable.com/v0/appHznRjE909j9VlP/Postes ouverts?api_key=keyQ9LAVuNmhIIhjN').then((response) => {
		let jobs = airTable(response.body.records)
		store.commit('updateJobs', jobs)
	})
	
	
	// App
	const app = new Vue({
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

const airTable = function(object) {
	// AirTable objects have a "field" property which contains their actual data
	// This is to clean up the airtable objects
	try {
		if (object.constructor === Array) {
			for (i in object) {
				let airTableId = object[i].id
				object[i] = object[i].fields
				object[i].airTableId = airTableId
			} 
		} else {
			let airTableId = object.id
			object = object.fields
			object.airTableId = airTableId
		}
		return object
	} catch (err) {
		console.error(err.message)
		return false
	}
}