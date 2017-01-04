function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'newsletter': {
				'meta' : false,
				'edito' : false
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

	Vue.http.get(airTableListEndpoint('Newsletters')).then((response) => {
		var newsletter = airTableData(response.body.records)[response.body.records.length-1]
		store.commit('updateNewsletter', {'meta': newsletter})
		if (newsletter.hasOwnProperty('Edito')) {
			Vue.http.get(airTableItemEndpoint('Editos', newsletter.Edito)).then((response) => {
				var edito = airTableData(response.body)
				edito.Texte = marked(edito.Texte)
				store.commit('updateNewsletter', {'edito': edito})
			})
		}
	})
	
	// App
	var app = new Vue({
		el: '.newsletter',
		store,
//		components: { 'newsletter': Newsletter },
		template: `

			<div class="newsletter" lang="fr">

			<table cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
			<tr>
				<td>
				<table cellpadding="14px" cellspacing="0" border="0" align="center">

					<tr class="newsletter__logo">
						<td width="648" valign="top">
							<table style="
								text-align: center;
								font-family: 'Century Gothic', Futura, Verdana, sans-serif;
								line-height: 1;
								font-size: 42px;
								display: inline-block;
							">
								<tr>
									<td style="background-color:#ff6000;color:white;text-align:right;vertical-align:bottom;padding-top:.5rem;padding-right:.25rem;padding-left:.1rem;min-height:2.7rem;">
										J<br>DEM
									</td>
									<td style="color:#ff6000;text-align:left;vertical-align:bottom;padding-top:.5rem;padding-left:.05rem;width:4.8rem;min-height:2.7rem;">
										EUNES<br>OCRATES
									</td>
								</tr>
							</table>
						</td>
					</tr>

					<tr class="newsletter__header" v-if="newsletter.meta">
						<td width="600" valign="top">
							<p>{{ newsletter.meta.Titre }}</p>
							<p>{{ newsletter.meta.Date }}</p>
						</td>
					</tr>

					<tr class="edito" v-if="newsletter.edito">
						<td width="600" valign="top">
							<div v-html="newsletter.edito.Texte"></div>
						</td>
					</tr>

				</table>
				</td>
			</tr>
			</table>

			</div>


			
		`,
		computed: {
			newsletter () {
				return this.$store.state.newsletter
			}
		}
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