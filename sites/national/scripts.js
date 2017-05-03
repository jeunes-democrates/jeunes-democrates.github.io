function vueSetup() {

	// Store
	window.store = new Vuex.Store({
		state: {
			'meta' : {
				'name' : "Les Jeunes Démocrates"
			},
			'menu' : [
				{ "name" : "Présentation", "url" : "#" },
				{ "name" : "Idées & actus", "url" : "#" },
				{ "name" : "Contacts", "children" : [
						{ "name" : "Nationaux", "url" : "#" },
						{ "name" : "Régionaux", "url" : "#" }
					]
				},
				{ "name" : "Faire un don", "url" : "#" }
			],
			'articles': [
				{"placeholder" : true },
				{"placeholder" : true },
				{"placeholder" : true }
			],
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

	Vue.http.get(_airTable.ListEndpoint('Actus')).then((response) => {
		var actus = _airTable.Clean(response.body.records) // get first 3 actus
		actus = actus.filter(function( actu ) {
			return !actu.hasOwnProperty('Exclure');
		})
		actus = actus.slice(0,3)
		store.commit('updateData', {'articles': actus})
	})


	// COMPONENTS

	Vue.component('article-wall', {
		props: ['articles'],
		template: `
			<div class="articleWall">
				<h2>Idées & actualités</h2>
				<div class="articleWall__scroller">
					<template v-for="article in articles">
						<a v-if="!article.placeholder" class="articleWall__anchor" :href="article.Lien">
							<div class="articleWall__illustration" :style="{ backgroundImage: 'url(' + article.Illustration[0].thumbnails.large.url + ')' }"></div>
							<span class="articleWall__title" v-html="article.Titre"></span>
						</a>
						<a v-else class="articleWall__anchor articleWall__anchor--placeholder">
							<div class="articleWall__illustration"></div>
							<span class="articleWall__title">&nbsp;</span>
						</a>
					</template>
				</div>
			</div>
		`
	})

	Vue.component('main-nav', {
		props: ['brand', 'menu'],
		template: `
			<nav>
				<ul class="nav nav-inverse">
					<li v-for="menuItem in menu" :class="[menuItem.hasOwnProperty('children') ? 'nav-item dropdown' : 'nav-item']">
						<a
							v-if="menuItem.hasOwnProperty('children')"
							v-html="menuItem.name"
							href="#"
							class="nav-link dropdown-toggle"
							data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
							>
						</a>
						<a
							v-else
							v-html="menuItem.name"
							:href="menuItem.url"
							class="nav-link"
							>
						</a>
						<div v-if="menuItem.hasOwnProperty('children')" class="dropdown-menu">
							<a v-for="link in menuItem.children" class="dropdown-item" :href="link.url" v-html="link.name"></a>
						</div>
					</li>
					<li class="nav-item special-event" hidden>
						<a href="#"	class="nav-link super-nav-link">UR2017!</a>
					</li>
					<li class="nav-item"><a class="nav-link"><i class="fa fa-twitter"></i></a></li>
					<li class="nav-item"><a class="nav-link"><i class="fa fa-facebook"></i></a></li>
				</ul>
			</nav>
		`
	})



	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div id="app" lang="fr">

				<header>
					<div class="top-background">
						<div class="container">
							<div class="row header-wrapper">
								<div class="col-md-6 header-item">
									<h1>
										<img class="title__image" src="long-logo-white.svg" :alt="state.meta.name" />
									</h1>
								</div>
								<div class="col-md-6 col-lg-5 offset-lg-1 header-item email-wrapper">
									<h2>Rejoins-nous !</h2>
									<form>
										<div class="input-group">
											<input type="email" placeholder="mon@adresse.mail" class="form-control form-control-lg">
											<span class="input-group-btn">
												<button type="submit" class="btn btn-lg btn-secondary email-submit">→</button>
											</span>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div class="nav-wrapper">
						<main-nav :brand="state.meta.name" :menu="state.menu" class="container"></main-nav>
					</div>
				</header>

				<section>
					<article-wall :articles="state.articles" class="container"></article-wall>
				</section>

				<section>
					<article-wall :articles="state.articles" class="container"></article-wall>
				</section>

				<footer>
					<div class="container text-muted text-center small">
						<p>Les Jeunes Démocrates, tous droits réservés.</p>
						<p>
							<a href="">Jeunes Démocrates Européens</a> · 
							<a href="">Mouvement Démocrate</a> · 
							<a href="">Parti Démocrate Européen</a>
						</p>
						<p>
							<a href="">Mentions légales</a> · 
							<a href="">Twitter</a> · 
							<a href="">Facebook</a>
						</p>
					</div>
				</footer>

			</div>
	
		`,
		computed: {
			state () {
				return this.$store.state
			}
		}
	})

}


