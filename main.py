from CarousellScraper import CarousellScraper
# Create instance of CarousellScraper
scraper = CarousellScraper()

# Get all listings from search page
data = scraper.getCardInfoFromQuery("tuition")

# Fetch all listing names asynchronously

import json
with open('data.json', 'w') as outfile:
    json.dump(data, outfile)

print('Data written to data.json')
