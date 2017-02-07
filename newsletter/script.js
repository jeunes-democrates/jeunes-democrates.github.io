function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'newsletter': {
				'meta': false,
				'edito': false,
				'articles': [],
				'commissions': []
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
		var actus = _airTable.Clean(response.body.records) // get first 3 actus
		actus = actus.filter(function( actu ) {
			return !actu.hasOwnProperty('Exclure');
		})
		actus = actus.slice(0,3)
		store.commit('updateNewsletter', {'actus': actus})
	})

	Vue.http.get(_airTable.ListEndpoint('Commissions')).then((response) => {
		console.log(response)
		var commissions = _airTable.Clean(response.body.records)
		commissions.sort(function(a, b) { return a.Ordre > b.Ordre })
		commissions = commissions.slice(0,3)
		store.commit('updateNewsletter', {'commissions': commissions})
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
		<div style="background-color: #fafafa; padding: 14px; padding-top: 0px;">
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
		</div>
	`
})

Vue.component('newsletter-meta', {
	props: ['date'],
	template: `
		<div style="background-color: #f3f3f3; padding: 14px;">
			<table cellpadding="14px" cellspacing="0" border="0" align="center" width="582" style="
				font-family: 'Trebuchet MS', Helvetica, sans-serif;
				line-height: 24px;
				color: #333;
				">
	
				<tr class="newsletter__logo">
					<td width="120"></td>
					<td valign="top">
						<table style="
							text-align: center;
							font-family: 'Century Gothic', Futura, Verdana, sans-serif;
							line-height: 1;
							font-size: 42px;
							display: inline-block;
							margin-top: 14px;
							width: 100%;
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

				<tr>
					<td colspan=2 valign="top" style="text-align: right; color: #999;">
						<p style="text-align: center;">{{ date }}</p>
					</td>
				</tr>

			</table>
		</div>
	`
})

Vue.component('newsletter-actus', {
	props: ['actus'],
	template: `
		<div v-if="actus" style="background-color: #f3f3f3; padding: 14px;">
			<table cellpadding="7" cellspacing="0" border="0" align="center" width="568" style="
				font-family: 'Trebuchet MS', Helvetica, sans-serif;
				line-height: 18px;
				font-size: 16px;
				color: #333;
				">
				<tr><td colspan="3"><h2>Nos publications récentes</h2></td><tr>
				<tr class="actus">
					<td valign="top" v-for="actu in actus">
						<a :href="actu.Lien">
							<img :src="actu.Illustration[0].thumbnails.large.url" width=180 />
						</a>
					</td>
				</tr>
				<tr class="actus">
					<td valign="top" v-for="actu in actus">
						<a :href="actu.Lien">
							<span v-html="actu.Titre"></span>
						</a>
					</td>
				</tr>
			</table>
		</div>
	`
})


Vue.component('newsletter-commissions', {
	props: ['commissions'],
	template: `
		<div v-if="commissions" style="background-color: #fafafa; padding: 14px;">
			<table cellpadding="7" cellspacing="0" border="0" align="center" width="568" style="
				font-family: 'Trebuchet MS', Helvetica, sans-serif;
				line-height: 18px;
				font-size: 16px;
				color: #333;
				">
				<tr><td colspan="3"><h2>Nos commissions projet</h2></td><tr>
				<tr>
					<td valign="top" v-for="commission in commissions" v-if="commission.hasOwnProperty('Illustration')">
						<a :href="commission.Lien">
							<img :src="commission.Illustration[0].thumbnails.large.url" width=180 />
						</a>
					</td>
				</tr>
				<tr>
					<td valign="top" v-for="commission in commissions" style="text-align: center; text-transform: uppercase;">
						<a :href="commission.Lien">
							<strong><span v-html="commission.Titre" style="font-size: 14px;"></strong><br/>
							<span v-html="commission.Statut" style="font-size: 10px;"></span>
						</a>
					</td>
				</tr>
			</table>
		</div>
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

				<newsletter-actus
					:actus="newsletter.actus"
					></newsletter-actus>

				<newsletter-commissions
					:commissions="newsletter.commissions"
					></newsletter-commissions>

				<newsletter-meta
					:date="newsletter.meta.Date"
					></newsletter-meta>

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


