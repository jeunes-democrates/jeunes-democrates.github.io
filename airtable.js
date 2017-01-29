function airTable(apiKey, appKey) {
	this.apiKey = apiKey
	this.appKey = appKey
	this.ListEndpoint = function (table, params) {
		// e.g. : airTableListEndpoint('Newsletters', {'maxRecords': 1})
		var paramString = ''
		for (var param in params) {
			paramString += '&' + param + '=' + params[param]
		}
		return 'https://api.airtable.com/v0/' + this.appKey + '/' + table + '?api_key=' + this.apiKey + paramString
	}
	this.ItemEndpoint = function (table, id) {
		// e.g. : airTableItemEndpoint('Newsletters', 'recKbCev6uCTnLFdU')
		return 'https://api.airtable.com/v0/' + this.appKey + '/' + table + '/' + id + '?api_key=' + this.apiKey
	}
	this.Clean = function (object) {
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
}