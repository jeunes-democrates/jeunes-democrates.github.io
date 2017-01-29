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

	var _airTable = new airTable(apiKey='keyiXWAznJ80FXmtW', appKey='appfukGiseC6qP8yb')

	Vue.http.get(_airTable.ListEndpoint('Newsletters')).then((response) => {
		var newsletter = _airTable.Clean(response.body.records)[response.body.records.length-1]
		store.commit('updateNewsletter', {'meta': newsletter})

		if (newsletter.hasOwnProperty('Edito')) {
			Vue.http.get(_airTable.ItemEndpoint('Editos', newsletter.Edito)).then((response) => {
				var edito = _airTable.Clean(response.body)
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


				<!-- Header -->
				<table cellpadding="0" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">

					<tr>
						<td valign="top" width="263px" style="color: white;">
							Bonne année 2017 !
						</td>
						<td valign="top" width="263px" style="text-align: right; color: #999;">
							<!-- empty -->
						</td>
					</tr>
				</table>



				<!-- Illustration -->
				<table v-if="newsletter.meta.Illustration" cellpadding="0" cellspacing="0" border="0" align="center" width="610">

					<tr>
						<td>
							<img :src="newsletter.meta.Illustration[0].url" width="610" />
						</td>
					</tr>

				</table>



				<!-- Edito -->
				<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">
					<tr class="edito" v-if="newsletter.edito">
						<td valign="top">
							<div v-html="newsletter.edito.Texte"></div>
						</td>
					</tr>

				</table>


				<!-- Logo et date-->
				<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
					font-family: 'Trebuchet MS', Helvetica, sans-serif;
					line-height: 24px;
					color: #333;
				">

					<tr class="newsletter__logo">
						<td valign="top" width="287px" style="text-align: right; color: #999;">
							<p>{{ newsletter.meta.Date }}</p>
						</td>
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
