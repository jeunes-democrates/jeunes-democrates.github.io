function organigrammeSetup() {
	// Store
	const store = new Vuex.Store({
		state: {
			poles: [],
		},
		mutations: {
			updatePoles(state, payload) {
				let poles = payload['poles']
				window.potato = poles
				let members = payload['members']
				state.poles = []
				for (i in poles) {
					let pole = poles[i].fields
					for (i in pole.Membres) {
	
						// in each pole, replace the member ID by full member data
						pole.Membres[i] = members.filter(obj => obj.id == pole.Membres[i] )[0].fields
	
						// use the first photo of the attachment array, and get its standardized largest thumbnail
						pole.Membres[i].Photo = pole.Membres[i].Photo[0].thumbnails.large.url
	
					}
					// Ordonne les membres
					pole.Membres.sort(function(a, b) { return a.Ordre > b.Ordre })
					state.poles.push(pole)
				}
				// Ordonne les pôles
				state.poles.sort(function(a, b){ return a.Ordre > b.Ordre })
			}
		}
	})
	
	// Components
	const Organogram = {
		template: `
			<div class="organigramme__poles">
	
				<div class="organigramme__column-wrapper" v-for="pole in poles">
				<div class="organigramme__pole slideUp">
	
					<div class="organigramme__pole__header">
						<div class="organigramme__pole__name">{{ pole.Name }}</div>
						<a class="organigramme__pole__email organigramme__bouton" v-bind:href="'mailto:' + pole.Email">Contacter</a>
					</div>
					
					<div class="organigramme__membres">
						<div class="organigramme__membre" v-for="Membre in pole.Membres" v-bind:class="{ small: !Membre.UM }" v-if="!Membre.Hide">
							<div class="organigramme__membre__photo" v-bind:style="{ backgroundImage: 'url(' + Membre.Photo + ')' }"></div>
							<div class="oranigramme__membre__info">
								<div class="organigramme__membre__name">
									{{ Membre.Prénom }} <strong>{{ Membre.Nom }}</strong>
								</div>
								<div class="organigramme__membre__titre">{{ Membre.Rôle }}</div>
								<div class="organigramme__membre__liens">
									<a v-if="Membre.Twitter" class="organigramme__twitter organigramme__bouton"
										v-bind:href="'https://twitter.com/' + Membre.Twitter" target="_blank"
										>@{{ Membre.Twitter }}</a>
								</div>
							</div>
						</div>
					</div>
	
				</div>
				</div>
	
			</div>
		`,
		computed: {
			poles () {
				return this.$store.state.poles
			}
		}
	}
	
	
	Vue.http.get('https://api.airtable.com/v0/appHznRjE909j9VlP/Pôles?api_key=keyQ9LAVuNmhIIhjN').then((response) => {
		let poles = response.body.records
		Vue.http.get('https://api.airtable.com/v0/appHznRjE909j9VlP/Membres?api_key=keyQ9LAVuNmhIIhjN').then((response) => {
			let members = response.body.records
			store.commit('updatePoles', {'poles': poles, 'members': members})
		})
	})
	
	
	// App
	const app = new Vue({
		el: '#app',
		store,
		components: { Organogram },
		template: `
			<div class="app">
				<organogram></organogram>
			</div>
		`
	})
}