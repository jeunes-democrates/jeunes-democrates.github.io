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
				<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">

					<tr class="newsletter__logo">
						<td valign="top" width="287px">
							<table style="
								text-align: center;
								font-family: 'Century Gothic', Futura, Verdana, sans-serif;
								line-height: 1;
								font-size: 42px;
								display: inline-block;
								margin-top: 14px;
								">
								<tr>
									<td style="
									background-color:#ff6000;
									color:white;
									text-align:right;
									vertical-align:bottom;
									padding-top:8px;
									padding-right:2px;
									padding-left:1px;
									">
										J<br>DEM
									</td>
									<td style="
										color:#ff6000;
										text-align:left;
										vertical-align:bottom;
										padding-top:8px;
										padding-left:1px;
										width:77px;
										">
										EUNES<br>OCRATES
									</td>
								</tr>
							</table>
						</td>
						<td valign="top" style="text-align: right; color: #999;">
							<p>{{ newsletter.meta.Date }}</p>
						</td>
					</tr>
				</table>
				<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">
					<tr>
						<td valign="top">
							<img src="" />
						</td>
					</tr>

				</table>
				<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">
					<tr class="newsletter__header" v-if="newsletter.meta">
					</tr>

					<tr class="edito" v-if="newsletter.edito">
						<td valign="top">
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