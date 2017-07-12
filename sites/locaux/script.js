var introText = `
**Lorem ipsum dolor sit amet**, consectetur adipiscing elit. Morbi nec vehicula risus. Nam lacus neque, tristique in dignissim et, tristique vitae nibh. Phasellus hendrerit rhoncus eros, quis aliquam ex maximus sit amet. Vestibulum sapien felis, consequat sit amet efficitur quis, congue et magna. Mauris tempor vehicula turpis, eu viverra quam egestas quis. In eu nulla eu sapien molestie feugiat ut sit amet metus. Fusce bibendum nunc risus, a ornare enim posuere in. Nunc hendrerit pharetra justo vitae gravida. Donec interdum vehicula auctor. Vestibulum consequat ex vulputate, porta felis et, tincidunt ex. Nullam ac condimentum elit. Vestibulum at porttitor orci. Duis molestie blandit ipsum et molestie.

Vivamus maximus faucibus metus, in semper nunc [faucibus](http://twitter.com) id. Praesent et velit molestie ante venenatis condimentum vel quis orci. Ut est tortor, interdum id sapien at, convallis dignissim enim. Pellentesque fringilla sollicitudin mi, sagittis finibus tellus fermentum vitae. Donec ut elit sem. Phasellus laoreet dolor sit amet augue eleifend ullamcorper. Sed aliquet bibendum accumsan. Ut vehicula nunc id interdum pretium. Praesent in quam pellentesque magna iaculis aliquet. Donec iaculis tincidunt dolor sit amet semper. Donec vulputate velit eget dapibus fringilla. Proin vitae efficitur urna. Vestibulum eget euismod purus, a pellentesque nibh. Vestibulum pretium fringilla ornare. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quis pulvinar nulla. 
						`

function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'site': {
				'name': "Jeunes Démocrates d'Alsace",
				'description': "Groupe local représentant les jeunes adhérents du Mouvement Démocrate",
				'nav': true,
				'modules': [
					{
						'type': 'intro',
						'title': 'Présentation',
						'content': introText
					},
//					{
//						'type': 'news',
//						'newsItems': [
//							{
//								'title': '',
//							}
//						]
//					},
					{
						'type': 'team',
						'title': 'Notre équipe',
						'teamMembers': [
							{
								'name': '',
								'title': '',
								'description': '',
								'twitter': '',
							},
							{
								'name': '',
								'title': '',
								'description': '',
								'twitter': '',
							},
							{
								'name': '',
								'title': '',
								'description': '',
								'twitter': '',
							}
						]
					},
					{
						'type': 'contact',
						'title': 'Contactez-nous'
					},
				],
//					'news': false, // not yet ready
				'facebookFeed': 'jeunes-democrates',
				'twitterFeed': 'J_Democrates'
			}
		},
		mutations: {
			updateData(state, payload) {
				for (param in payload) {
					state[param] = payload[param]
				}
			}
		}
	})

	Vue.component('site-intro', {
		props: ['module'],
		template: `
			<section class="site-intro">

				<h2 v-if="module.title" class="section-heading intro__title">
					{{ module.title }}
				</h2>

				<div class="intro__text" v-html="marked(module.content)"></div>

			</section>
		`
	})

	Vue.component('site-team', {
		props: ['module'],
		template: `
			<section class="site-team">

				<h2 v-if="module.title" class="section-heading intro__title">
					{{ module.title }}
				</h2>

				<div class="team__members">
					<div v-if="module.teamMembers" class="team__member">
					</div>
				</div>

			</section>
		`
	})

	Vue.component('site-contact', {
		props: ['module'],
		template: `
			<section class="site-contact">

				<h2 v-if="module.title" class="section-heading intro__title">
					{{ module.title }}
				</h2>

			</section>
		`
	})

	Vue.component('site-news', {
		// This module is not ready for use yet,
		// as it needs to load the actual articles,
		// which we can't handle yet
		props: ['module'],
		template: `
			<section class="site-news">

				<h2 v-if="module.title" class="section-heading news__title">
					{{ module.title }}
				</h2>

				<div class="news__list">
					<div v-for"newsItem in module.newsItems" class="news__item">
						<div class="news__item__illustration"></div>
						<div class="news__item__title"></div>
						<div class="news__item__description"></div>
					</div>
				</div>

			</section>
		`
	})





	// App
	var app = new Vue({
		el: '#app',
		store,
		template: `

			<div class="sheet" lang="fr">

				<section v-if="site.name || site.description" class="header">

					<h1 v-if="site.name || site.description" class="site-header">
						<span v-if="site.name" class="site-name">{{ site.name }}</span>
						<span v-if="site.description" class="site-description">{{ site.description }}</span>
					</h1>

				</section>

				<section v-if="site.nav" class="nav-section" >

					<nav class="nav">
						<span class="nav__item">
							<a class="nav__link" href="#">
								Actualités
							</a>
						</span>
						<span class="nav__spacer">·</span>
						<span class="nav__item">
							<a class="nav__link" href="#">
								L'équipe
							</a>
						</span>
						<span class="nav__spacer">·</span>
						<span class="nav__item">
							<a class="nav__link" href="#">
								Contactez-nous
							</a>
						</span>
						<span class="nav__spacer">·</span>
					</nav>

				</section>

				<template v-for="module in site.modules">

					<site-intro
						v-if="module.type == 'intro'"
						:module="module"
						></site-intro>

					<site-news
						v-if="module.type == 'news'"
						:module="module"
						></site-news>

					<site-team
						v-if="module.type == 'team'"
						:module="module"
						></site-team>

					<site-contact
						v-if="module.type == 'contact'"
						:module="module"
						></site-contact>

				</template>

				<section>

					<h2 class="section-heading">
						Notre équipe
					</h2>

				</section>

				<section>

					<h2 class="section-heading">
						Contactez-nous
					</h2>

				</section>

			</div>
	
		`,
		computed: {
			site () {
				return this.$store.state.site
			}
		}
	})

	var title = new Vue({
		el: 'title',
		store,
		template: `
			<title>{{ site.name }}</title>
		`,
		computed: {
			site () {
				return this.$store.state.site
			}
		}
	})

}


