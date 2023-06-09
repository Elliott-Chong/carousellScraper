import requests
from bs4 import BeautifulSoup
class CarousellScraper():
    def __init__(self):
        self.base_url = "https://www.carousell.sg"

    def getCardInfoFromQuery(self, query):
        url = f"{self.base_url}/search/{query}?addRecent=false"
    
        # Send GET request to URL and store response
        response = requests.get(url)
        
        # Parse HTML content of response with BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')
        cards = soup.find_all('div', {'data-testid': lambda x: x and x.startswith('listing-card-')})

        result = []
        for card in cards:
            info = {
                'id': card['data-testid'].replace('listing-card-', ''),
                'seller_name': card.find('p', {'data-testid': 'listing-card-text-seller-name'}).text,
                'listing_name': card.find_all('img')[0]['alt'],
            }
            result.append(info)
        return result


