import urllib.request
import sys, requests, json
from pymongo import MongoClient

client = MongoClient()
db = client.liber


# users = db.users
url1 = 'https://api.mercadoeditorial.org/api/v1.2/book?isbn='
url2 = 'https://brasilapi.com.br/api/isbn/v1/'

headers = {
    'origin': 'https://www.saraiva.com.br',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:92.0) Gecko/20100101 Firefox/92.0'
}

def downloadImg(url, path):
    try:
        urllib.request.urlretrieve(url, path)
        print("Imagem salva! =)")
    except:
        erro = sys.exc_info()
        print("Ocorreu um erro:", erro)

def get_book():
    books = db.books
    books = books.find({})
    for key,book in enumerate(books):
        try:
            print(str(key)+ ' ' +book['isbn'])
            resp = requests.get(url1 + book['isbn'], headers=headers)
            resp = json.loads(str(resp.text))
            if resp['status']['success'] != False:
                if 'imagens' in resp['books'][0]:
                    url = resp['books'][0]['imagens']['imagem_primeira_capa']['media']
                    downloadImg(url, 'images/books/'+book['isbn']+'.png')
            else:
                resp = requests.get(url2 + book['isbn'], headers=headers)
                resp = json.loads(str(resp.text))
        except:
            erro = sys.exc_info()
            print("Ocorreu um erro:", erro)

get_book()