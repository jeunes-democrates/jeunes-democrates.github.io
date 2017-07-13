var introText = `
**Lorem ipsum dolor sit amet**, consectetur adipiscing elit. Morbi nec vehicula risus. Nam lacus neque, tristique in dignissim et, tristique vitae nibh. Phasellus hendrerit rhoncus eros, quis aliquam ex maximus sit amet.

Vestibulum sapien felis, consequat sit amet efficitur quis, congue et magna. Mauris tempor vehicula turpis, eu viverra quam egestas quis. In eu nulla eu sapien molestie feugiat ut sit amet metus. Fusce bibendum nunc risus, a ornare enim posuere in. Nunc hendrerit pharetra justo vitae gravida. Donec interdum vehicula auctor.

Vestibulum consequat ex vulputate, porta felis et, tincidunt ex. Nullam ac condimentum elit. Vestibulum at porttitor orci. Duis molestie blandit ipsum et molestie.

`

var footerText = `

Retrouvez-nous sur [twitter](https://twitter.com/J_Democrates) et [facebook](https://facebook.com/jeunes-democrates) !

`

function vueSetup() {
	// Store
	window.store = new Vuex.Store({
		state: {
			'site': {
				'name': "Jeunes Démocrates de Westeros",
				'description': "Groupe local représentant les jeunes adhérents du Mouvement Démocrate",
				'nav': true,
				'modules': [
//					{
//						'type': 'news',
//						'newsItems': [
//							{
//								'title': '',
//							}
//						]
//					},
					{
						'type': 'textBlock',
						'title': 'À propos',
						'content': introText
					},
					{
						'type': 'team',
						'title': 'Notre équipe',
						'teamMembers': [
							{
								'name': 'Jon Snow',
								'title': 'Président',
								'description': 'Etiam pulvinar volutpat justo a maximus. Knows nothing, proin quis elit ainterdum a nec urna.',
								'twitter': 'LordSnow',
							},
							{
								'name': 'Daenerys Targaryen',
								'title': 'Secrétaire',
								'description': 'Sed lorem dui, pharetra non hendrerit non, dapibus vel ligula.',
								'twitter': 'Daenerys',
							},
							{
								'name': 'Tyrion Lannister',
								'title': 'Trésorier',
								'description': 'Sed eu mi laoreet, vulputate tortor vitae, fermentum est. Donec tempor magna non elit sollicitudin fringilla.',
								'twitter': 'GoT_Tyrion',
							}
						]
					},
					{
						'type': 'contact',
						'title': 'Contact',
						'intro': 'Une question ? Adressez-nous un message !'
					},					{
						'type': 'textBlock',
						'title': false,
						'content': footerText,
						'center': true,
						'small': true
					}
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

	Vue.component('site-textBlock', {
		props: ['module'],
		template: `
			<div class="site-textBlock">

				<h2 v-if="module.title" class="section-heading textBlock__title">
					{{ module.title }}
				</h2>

				<div
					class="textBlock__text"
					:class="{'text--center': module.center, 'text--small': module.small}"
					v-html="marked(module.content)"
					></div>

			</div>
		`
	})

	Vue.component('site-team', {
		props: ['module'],
		template: `
			<div class="site-team">

				<h2 v-if="module.title" class="section-heading team__title">
					{{ module.title }}
				</h2>

				<div class="team__members swipeable-container dragscroll">
					<div v-if="module.teamMembers" v-for="teamMember in module.teamMembers" class="team__member swipeable-item">
						<div class="team__member__title">{{ teamMember.title }}</div>
						<img class="team__member__portrait" :src="'https://twitter.com/' + teamMember.twitter + '/profile_image?size=bigger'"/>
						<div class="team__member__name">{{ teamMember.name }}</div>
						<div class="team__member__description">{{ teamMember.description }}</div>
						<a v-if="teamMember.twitter" class="team__member__twitter" :href="'https://twitter.com/' + teamMember.twitter">@{{ teamMember.twitter }}</a>
					</div>
				</div>

			</div>
		`
	})

	Vue.component('site-contact', {
		props: ['module'],
		template: `
			<div class="site-contact">

				<h2 v-if="module.title" class="section-heading contact__title">
					{{ module.title }}
				</h2>

				<div v-if="module.intro" class="contact__intro">{{ module.intro }}</div>

				<form class="contact__form pure-form pure-form-stacked">
					<label for="message">Votre message:</label>
					<textarea name="message" class="contact__form__message pure-input-1" placeholder="..."/>
					<label for="email">Votre adresse email :</label>
					<input type="email" name="email" class="contact__form__email pure-input-1" placeholder="@"/>
					<button type="submit" class="pure-button pure-button-primary">Envoyer</button>
				</form>

			</div>
		`
	})

	Vue.component('site-news', {
		// This module is not ready for use yet,
		// as it needs to load the actual articles,
		// which we can't handle yet
		props: ['module'],
		template: `
			<div class="site-news">

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

			</div>
		`
	})

	Vue.component('nav-item', {
		props: ['label','anchor'],
		template: `
			<span class="nav__item">
				<a class="nav__link" :href="anchor">
					{{ label }}
				</a>
			</span>
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
						<template v-for="module in site.modules" v-if="module.title">
							<nav-item
								:label="module.title"
								:anchor="'#' + module.title"
								></nav-item>
							<span class="nav__spacer">·</span>
						</template>
					</nav>

				</section>

				<section v-for="module in site.modules" :id="module.title">

					<site-textBlock
						v-if="module.type == 'textBlock'"
						:module="module"
						></site-textBlock>

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


