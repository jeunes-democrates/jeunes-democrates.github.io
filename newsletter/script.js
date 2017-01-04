function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			newsletter: {
				'titre' : 'Pas de titre',
				'date' : 'Pas de date'
			}
		},
		mutations: {
			updateNewsletter(state, payload) {
				for (param in payload) {
					state.newsletter[param] = payload[param]
				}
			}

		}
	})


	// Components
	var JobBoard = {
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
	
	Vue.http.get(airTableListEndpoint('Newsletters')).then((response) => {
		var records = response.body.records
		var newsletter = airTableData(records)[records.length-1]
		store.commit('updateNewsletter', {'titre': newsletter.Titre, 'date': newsletter.Date})
		if (newsletter.hasOwnProperty('Edito')) {
			Vue.http.get(airTableItemEndpoint('Editos', newsletter.Edito)).then((response) => {
				console.log(response.body.records)
//				store.commit('updateNewsletter', {'edito': Edito})
			})
		}
//		Vue.http.get('https://api.airtable.com/v0/appHznRjE909j9VlP/Editos?api_key=keyQ9LAVuNmhIIhjN').then((response) => {
//			let edito = response.body.records
//			store.commit('updatePoles', {'poles': poles, 'members': members})
//		})
	
	})
	
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

var airTableData = function(object) {
	// AirTable objects have a "field" property which contains their actual data
	// This is to clean up the airtable objects
	try {
		if (object.constructor === Array) {
			for (i in object) {
				var airTableId = object[i].id
				object[i] = object[i].fields
				object[i].airTableId = airTableId
			} 
		} else {
			var airTableId = object.id
			object = object.fields
			object.airTableId = airTableId
		}
		return object
	} catch (err) {
		console.error(err.message)
		return false
	}
}

var airTableListEndpoint = function(table, params) {
	// e.g. : airTableListEndpoint('Newsletters', {'maxRecords': 1})
	var apiKey = 'keyQ9LAVuNmhIIhjN'
	var appKey = 'appHznRjE909j9VlP'
	var paramString = ''
	for (var param in params) {
		paramString += '&' + param + '=' + params[param]
	}
	return 'https://api.airtable.com/v0/' + appKey + '/' + table + '?api_key=' + apiKey + paramString
}

var airTableItemEndpoint = function(table, id) {
	// e.g. : airTableItemEndpoint('Newsletters', 'recKbCev6uCTnLFdU')
	var apiKey = 'keyQ9LAVuNmhIIhjN'
	var appKey = 'appHznRjE909j9VlP'
	return 'https://api.airtable.com/v0/' + appKey + '/' + table + '/' + id + '?api_key=' + apiKey
}