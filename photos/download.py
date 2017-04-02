from source import filenames
import requests
from urllib.parse import quote

results = {}

counter = 0


for filename in filenames :
	counter += 1
	response = requests.get("http://mouvementdemocrate.fr/media/Une/" + filename)
	if response.status_code == 200 :
		with open('images/' + quote(filename), 'wb') as file:
			file.write(response.content)