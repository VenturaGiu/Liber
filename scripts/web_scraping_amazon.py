import urllib, sys, time
from bs4 import BeautifulSoup
from selenium import webdriver
from pymongo import MongoClient

from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

client = MongoClient()
db = client.liber

servico = Service(ChromeDriverManager().install()) #instalar a versão de navegador que eu tenho
userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

options = webdriver.ChromeOptions()
# options.add_argument("--headless")
options.add_argument("--disable-notifications")
options.add_argument('--ignore-certificate-errors')
browser = webdriver.Chrome(chrome_options=options, service = servico)
browser.set_window_size(1403, 1200)

url = 'https://www.amazon.com.br/ref=nav_logo'

def get_image(url, path, books, book):
    try:
        urllib.request.urlretrieve(url, path)
        print(book['isbn']+" Imagem salva! =)")
        books.update_one({ 'isbn': book['isbn'] }, { '$set': { 'path_img': 'images/books/'+book['isbn']+'.png'} } )
    except:
        erro = sys.exc_info()
        print("Ocorreu um erro:", erro)

def get_book(url):
    books = db.books
    booksFind = books.find({ 'path_img': { '$exists': False } })
    for book in booksFind:
        isbn = book['isbn']
        browser.get(url)
        browser.find_element(By.ID, 'twotabsearchtextbox').send_keys(isbn)
        browser.find_element(By.ID, 'nav-search-submit-button').click()
        time.sleep(4)
        try:
            browser.find_element(By.XPATH, '//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[2]/div/div/div/div/div[2]/div[1]/h2/a').click()
            time.sleep(2)
            img = browser.find_element(By.CLASS_NAME, 'a-dynamic-image').get_attribute('src')
            get_image(img, 'images/books/'+isbn+'.png', books, book)
            print('a')
        except: 
            print('não achou eu acho')
            continue
    # get_url = browser.current_url
    # get_image(get_url)

get_book(url)