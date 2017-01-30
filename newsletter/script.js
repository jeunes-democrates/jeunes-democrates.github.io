function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'newsletter': {
				'meta' : false,
				'edito' : false,
				'articles' : []
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
	
	Vue.http.get(_airTable.ListEndpoint('Actus')).then((response) => {
		var actus = _airTable.Clean(response.body.records).slice(0,3) // get first 3 actus
		store.commit('updateNewsletter', {'actus': actus})
	})

Vue.component('newsletter-header', {
	template : `
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
		`
})

Vue.component('newsletter-illustration', {
	props: ['illustration'],
	template: `
		<table v-if="illustration" cellpadding="0" cellspacing="0" border="0" align="center" width="610">
			<tr>
				<td>
					<img :src="illustration[0].url" width="610" />
				</td>
			</tr>
		</table>
		`
})

Vue.component('newsletter-edito', {
	props: ['edito'],
	template: `
		<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
			font-family: 'Trebuchet MS', Helvetica, sans-serif;
			line-height: 24px;
			color: #333;
		">
			<tr class="edito" v-if="edito">
				<td valign="top">
					<div v-html="edito.Texte"></div>
				</td>
			</tr>

		</table>
	`
})

Vue.component('newsletter-meta', {
	props: ['date'],
	template: `
		<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
			font-family: 'Trebuchet MS', Helvetica, sans-serif;
			line-height: 24px;
			color: #333;
		">

			<tr class="newsletter__logo">
				<td valign="top" width="287px" style="text-align: right; color: #999;">
					<p>{{ date }}</p>
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

	`
})

Vue.component('newsletter-actu', {
	props: ['actu'],
	template: `
		<td class="actu" valign="top">
			<div v-html="actu.Titre"></div>
			<img :src="actu.Illustration[0].thumbnails.large.url" width=156 />
		</td>
	`
})

Vue.component('newsletter-actus', {
	props: ['actus'],
	template: `
		<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
			font-family: 'Trebuchet MS', Helvetica, sans-serif;
			line-height: 18px;
			font-size: 14px;
			color: #333;
		">
			<tr><td colspan="3"><h2>Publications récentes</h2></td><tr>
			<tr class="actus" v-if="actus">
				<newsletter-actu :actu="actus[0]"></newsletter-actu>
				<newsletter-actu :actu="actus[1]"></newsletter-actu>
				<newsletter-actu :actu="actus[2]"></newsletter-actu>
			</tr>

		</table>
	`
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

				<newsletter-header></newsletter-header>

				<newsletter-illustration
					:illustration="newsletter.meta.Illustration"
					></newsletter-illustration>

				<newsletter-edito
					:edito="newsletter.edito"
					></newsletter-edito>

				<hr/>

				<newsletter-actus
					:actus="newsletter.actus"
					></newsletter-actus>

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


//				<newsletter-meta
//					:date="newsletter.meta.Date"
//					></newsletter-meta>