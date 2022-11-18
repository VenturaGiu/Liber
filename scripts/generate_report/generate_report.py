import pandas as pd
from pandas_profiling import ProfileReport
from pymongo import MongoClient

#MONGO CONECCTION
client = MongoClient()
db = client.liber
books = db.books
users = db.users
ads = db.ads

book_pipeline= [
    {
        '$lookup': {
            'from': 'genres', 
            'localField': 'genre', 
            'foreignField': '_id', 
            'as': 'result'
        }
    }, {
        '$project': {
            '_id': 0, 
            'title': 1, 
            'genres': '$result.name', 
            'subtitle': 1, 
            'authors': 1, 
            'synopsis': 1, 
            'publisher': 1, 
            'year': 1, 
            'location': 1, 
            'language': 1, 
            'page_count': 1, 
            'key_words': 1
        }
    }
]

user_pipeline=[
    {
        '$lookup': {
            'from': 'ads', 
            'localField': '_id', 
            'foreignField': 'id_user', 
            'as': 'result'
        }
    }, {
        '$lookup': {
            'from': 'genres', 
            'localField': 'genres', 
            'foreignField': '_id', 
            'as': 'genre'
        }
    }, {
        '$project': {
            '_id': 0, 
            'name': 1, 
            'email': 1, 
            'verified': 1, 
            'activated': 1, 
            'account_type': 1, 
            'genre': '$genre.name', 
            'ads_count': {
                '$cond': {
                    'if': {
                        '$isArray': '$result'
                    }, 
                    'then': {
                        '$size': '$result'
                    }, 
                    'else': 'NA'
                }
            }
        }
    }
]
ads_pipelina=[
    {
        '$lookup': {
            'from': 'users', 
            'localField': 'id_user', 
            'foreignField': '_id', 
            'as': 'user'
        }
    }, {
        '$lookup': {
            'from': 'books', 
            'localField': 'id_book', 
            'foreignField': '_id', 
            'as': 'book'
        }
    }, {
        '$match': {
            '$or': [
                {
                    'user.account_type': 'premium'
                }, {
                    'user.account_type': 'standard'
                }
            ]
        }
    }, {
        '$project': {
            'id_user': 1, 
            'type_ad': 1, 
            'price': 1, 
            'user_name': '$user.name', 
            'ads_type': '$user.account_type', 
            'title': '$book.title', 
            'book_year': '$book.year', 
            'book_location': '$book.location', 
            'publisher': '$book.publisher', 
            'author': '$book.authors', 
            'id_user_by': 1
        }
    }, {
        '$unwind': {
            'path': '$user_name'
        }
    }, {
        '$unwind': {
            'path': '$ads_type'
        }
    }, {
        '$unwind': {
            'path': '$title'
        }
    }, {
        '$unwind': {
            'path': '$book_year'
        }
    }, {
        '$unwind': {
            'path': '$book_location'
        }
    }, {
        '$unwind': {
            'path': '$publisher'
        }
    }, {
        '$unwind': {
            'path': '$author'
        }
    }, {
        '$unwind': {
            'path': '$author'
        }
    }, {
        '$project': {
            '_id': 0, 
            'id_user': 0
        }
    }
]

book_list=[]
for book in books.aggregate(book_pipeline):
    book_list.append(book)
df_books = pd.json_normalize(book_list, max_level=0)

clean_book_col = ['authors','genres']
for col in clean_book_col:
    for ind,x in enumerate(df_books[col]):
            df_books.at[ind,col] = x[0]

for ind,x in enumerate(df_books['location']):
    if isinstance(x, str):
        if 'Rio' == x[0:3]:
            df_books.at[ind,'location'] = x.replace(x, 'Rio de Janeiro')
        if 'São' == x[0:3]:
            df_books.at[ind,'location'] = x.replace(x, 'São Paulo')


profile_books = ProfileReport(df_books, title='Books overview')






user_list=[]
for use in users.aggregate(user_pipeline):
    user_list.append(use)
df_users = pd.json_normalize(user_list, max_level=0)

for ind, x in enumerate(df_users['genre']):
    df_users.at[ind, 'genre'] = x[0]

profile_users = ProfileReport(df_users, title='Users overview')



ads_list=[]
for ad in ads.aggregate(ads_pipelina):
    ads_list.append(ad)
df_ads = pd.json_normalize(ads_list, max_level=0)

for ind,x in enumerate(df_ads['book_location']):
    if isinstance(x, str):
        if 'Rio' == x[0:3]:
            df_ads.at[ind,'book_location'] = x.replace(x, 'Rio de Janeiro')
        if 'São' == x[0:3]:
            df_ads.at[ind,'book_location'] = x.replace(x, 'São Paulo')
profile_ads = ProfileReport(df_ads , title='Ads overview')

# profile_books.to_file('booksReport.html')
profile_users.to_file('scripts/generate_report/reports/usersReport.html')
profile_ads.to_file('scripts/generate_report/reports/adsReport.html')
profile_books.to_file('scripts/generate_report/reports/bookReport.html')