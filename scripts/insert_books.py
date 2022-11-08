import requests, time

headers = {
    'origin': 'https://www.saraiva.com.br',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0'
}
base_url = 'http://localhost:3000/api/app_book/'

file = open('scripts/list_isbn.txt', 'r', encoding="utf-8")
isbns = file.readlines()

for key, isbn in enumerate(isbns):
    try:
        if isbn != '\n':
            print(str(key) + ' ' + isbn)
            resp = requests.get(base_url+isbn.replace('\n', ''), headers=headers)
            # resp = json.loads(str(resp.text))
    
    except:
        print('erro')
