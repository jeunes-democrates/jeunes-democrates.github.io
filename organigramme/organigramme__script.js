function organigrammeSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			poles: [],
			members: []
		},
		mutations: {
			updatePoles(state, payload) {
				var poles = payload['poles']
				var members = state.members = payload['members']
				state.poles = []
				for (i in poles) {
					var pole = poles[i]
					for (i in pole.Membres) {
						var member = pole.Membres[i]
						// in each pole, replace the member ID by full member data
						member = members.filter(obj => obj.airTableId == member)[0]
						// use the first photo of the attachment array, and get its standardized largest thumbnail
						if (member.hasOwnProperty('Photo')) member.Photo = member.Photo[0].thumbnails.large.url
						pole.Membres[i] = member
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
	
	var _airTable = new airTable(apiKey='keyQ9LAVuNmhIIhjN', appKey='appHznRjE909j9VlP')

	Vue.http.get(_airTable.ListEndpoint('Pôles')).then((response) => {
		var poles = _airTable.Clean(response.body.records)
		Vue.http.get(_airTable.ListEndpoint('Membres')).then((response) => {
			var members = _airTable.Clean(response.body.records)
			store.commit('updatePoles', {'poles': poles, 'members': members})
		})
	})
	
	// Components

	Vue.component('organigramme-pole', {
		props: ['pole'],
		template : `
			<div class="organigramme__pole slideUp">
		
				<div class="organigramme__pole__header">
					<div class="organigramme__pole__name">{{ pole.Name }}</div>
					<a v-if="pole.Email" class="organigramme__pole__email organigramme__bouton" v-bind:href="'mailto:' + pole.Email">Contacter ></a>
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
			`
	})

	var Organogram = {
		template: `
			<div>
				<div class="organigramme__poles">
					<organigramme-pole
						v-for="pole in poles"
						v-if="pole.Name != 'Autres membres'"
						:pole=pole
						class="organigramme__column-wrapper"
						></organigramme-pole>
				</div>
				<organigramme-pole
					v-for="pole in poles"
					v-if="pole.Name == 'Autres membres'"
					:pole=pole
					class="autres_membres"
					></organigramme-pole>
				<div class="spinner hide-if-not-first"></div>
			</div>
		`,
		computed: {
			poles () {
				return this.$store.state.poles
			}
		}
	}
	
	// App
	var app = new Vue({
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