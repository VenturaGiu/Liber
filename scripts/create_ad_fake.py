"""
id do usuário
id do livro
preco
id_usuario_adquiriu
tipo_venda (venda ou troca (ou os dois))

"""

from pymongo import MongoClient
import json
from random import *

client = MongoClient('localhost', 27017)
db = client.liber
userC = db['users']
bookC = db['books']

users = userC.find({ 'account_type': 'premium' })

ad_type = ['sale', 'swap']

for user in users:
    id_user = user['_id']
    book = bookC.aggregate([
        {'$sample': { 'size': 1 }}
    ])
    # print(list(book)[0]['_id'])
    price = round(uniform(10.00,60.00), 1)
    
    print(price)