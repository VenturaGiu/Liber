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

# users = userC.find({ 'account_type': 'premium' })
users = userC.aggregate([
    {
        '$match': {
            'account_type': 'premium'
        }
    }, {
        '$sample': {
            'size': 50
        }
    }
])

ad_type = ['venda', 'troca']
fake_datas = []

def get_random_user(id_user):
    user = userC.aggregate([
        {
            '$sample': {
                'size': 1
            }
        }
    ])
    user = list(user)[0]['_id']
    if str(user) == str(id_user): get_random_user(id_user)
    else: return str(user)

for key, user in enumerate(users):
    id_user = user['_id']
    book = bookC.aggregate([
        {'$sample': { 'size': 1 }}
    ])
    book = list(book)[0]['_id']
    price = round(uniform(10.00,60.00), 1)
    ad_type_position = randint(0, 1)
    type_ad = ad_type[ad_type_position]
    id_user_buy = ''
    if type_ad == 'troca': price = ''
    # else: 
    #     if key % 2 == 0: 
    #         id_user_buy = get_random_user(id_user)

    fake_datas.append(
        {
            'id_user': str(id_user),
            'id_book': str(book),
            'price': price,
            'type_ad': type_ad,
            'id_user_buy': id_user_buy
        }
    )

for fake_data in fake_datas:
    json_object = json.dumps(fake_data, indent=4, ensure_ascii=False)
    with open("scripts/datas/fake_datas_AD.json", "a", encoding="utf-8") as outfile:
        outfile.write(json_object)