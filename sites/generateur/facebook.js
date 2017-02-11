function faceBook(target, appToken, appSecret) {
	this.target = target
	this.appToken = appToken
	this.appSecret = appSecret
	this.Get = function(endPoint) {
		return 'https://graph.facebook.com/' + this.target + endPoint + '?access_token=' + this.appToken + '|' + this.appSecret
	}
	this.Root = function () {
		return this.Get('')
	}
	this.Feed = function() {
		return this.Get('/feed')
	}
}