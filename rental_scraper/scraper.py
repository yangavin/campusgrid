import requests
from bs4 import BeautifulSoup

listings = []

def scrape_kijiji():
    url = 'https://www.kijiji.ca/b-real-estate/kingston-on/c34l1700183?address=Kingston%2C%20ON&gpTopAds=y&ll=44.2334401%2C-76.49302949999999&radius=12.0&sort=dateDesc'
    response = requests.get(url) # Retreive the html content
    soup = BeautifulSoup(response.content, 'html.parser') # Parse the raw data
    
    items = soup.select('li[data-testid^="listing-card-list-item-"]')
    
    for item in items:
        title = item.find('h3', attrs={'data-testid': 'listing-title'}).text.strip()
        price = item.find('p', attrs={'data-testid': 'listing-price'}).text.strip()
        link = item.find('a', attrs={'data-testid': 'listing-link'}).text.strip()
        listing = {
            'title': title,
            'price': price,
            'link': link
        }
        print(listing)
        listings.append(listing)

def scrape_frontenac():
    url = 'https://www.frontenacproperty.com/properties/stud/?sort=availability&order=ASC'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    items = soup.find_all('div', class_='col-sm-6 col-md-4')
    
    for item in items:
        title = item.find('a').text.strip()
        price = item.find('b').text.strip()
        link = item.find('a')['href'].text.strip()
        listing = {
            'title': title,
            'price': price,
            'link': link
        }
        listings.append(listing)

print("Before:")
print(listings)
scrape_kijiji()
scrape_frontenac()
print("After:") 
print(listings)