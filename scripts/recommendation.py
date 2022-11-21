import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
# Compute the Cosine Similarity matrix based on the count_matrix
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from pymongo import MongoClient
from bson.objectid import ObjectId
import argparse
import json

# RECEBE O ID DO USUÁRIO
# O id do usuário deve ser passado como string 
# EXEMPLO DE CHAMADA "python recommendation.py -uid {id_usuario}"

# parser = argparse.ArgumentParser()
# parser.add_argument("-uid", "--userId",type=str)
# args = parser.parse_args()

# id = args.userId
id= ObjectId('63729f17011783b55d9423fb')

#MONGO CONECCTION
client = MongoClient()
db = client.liber
books = db.books
users = db.users
ads = db.ads

user_id = users.find_one({"_id": id})
id = user_id["_id"]


#PIPELINES
pipeline_books = [
    {
        "$lookup": {
            "from": "genres", 
            "localField": "genre", 
            "foreignField": "_id", 
            "as": "result"
        }
    }, {
        '$project': {
            'createdAt': 0, 
            'updatedAt': 0, 
            'result.createdAt': 0, 
            'result.updatedAt': 0
        }
    }
]

pipeline_users = [
    {
        "$match": {
            "_id": id
        }
    }, {
        "$lookup": {
            "from": "genres", 
            "localField": "genres", 
            "foreignField": "_id", 
            "as": "result"
        }
    }, {
        '$project': {
            'createdAt': 0, 
            'updatedAt': 0, 
            'result.createdAt': 0, 
            'result.updatedAt': 0
        }
    }
]



def take_genre(x):
    if isinstance(x,list):
        return [i["name"] for i in x]
    return np.nan


def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    else:
        #Check if director exists. If not, return empty string
        if isinstance(x, str):
            return str.lower(x.replace(" ", ""))
        else:
            return ""

def create_soup(x):
    return " ".join(x["key_words"]) + " " + " ".join(x["authors"]) + " " + " ".join(x["result"])

def get_books_recommendations(user_id, cosine_sim):
    # Get the index of the movie that matches the title
    idx = indices[user_id]

    # Get the pairwsie similarity scores of all books with that movie
    # Sort the books based on the similarity scores

    sim_scores_rec = df2.loc[df2[idx]>0].sort_values(ascending=False, by=idx)
    
    sim_scores = sim_scores_rec
    # Get the movie indices
    books_indices = [i for i in sim_scores.index]
    next_ind = 1
    while len (books_indices ) <=15:
        idx = sim_scores.index[next_ind]
        sim_scores = df2.loc[df2[idx]>0].sort_values(ascending=False, by=idx)
        nb = [i for i in sim_scores.index]
        for a in nb:
            if a not in books_indices:
                books_indices.append(a)
        next_ind+=1

    if len(books_indices) >= 50:
        sim_scores = sim_scores[1:40]
        books_indices = [i for i in sim_scores.index]
    # Get the scores of the 10 most similar books
    # sim_scores = sim_scores[1:30]

    # Return the top 10 most similar books
    return books_indices


bank = []
for user in users.aggregate(pipeline_users):
    user["result"] = take_genre(user["result"])
    user["result"] = clean_data(user["result"])
    user["sopa"] = " ".join(user["result"])
    user["title"] = user["name"]
    bank.append(user)

for a in (books.aggregate(pipeline_books)):
    genre_list=[]
    features = [ "key_words", "authors", "result"]

    for feature in features:
        if feature == "result":
            a[feature] =  take_genre(a[feature])
        a[feature] = clean_data(a[feature])
    a["sopa"] = create_soup(a)
    bank.append(a)

df = pd.json_normalize(bank, max_level=0)
df = df.set_index("_id")

count = CountVectorizer(stop_words="english")
#matriz que atribui peso as palavras
count_matrix = count.fit_transform(df["sopa"])

#calculando a similaridade entre os filmes baseando-se nas palavras passadas
cosine_sim2 = cosine_similarity(count_matrix)
indices = pd.Series(df.index, index=df.index)
df2 = pd.DataFrame(cosine_sim2, columns=df.index, index=df.index)

book_id = get_books_recommendations(id, df2)

ads_pipeline = [
    {
        '$lookup': {
            'from': 'users', 
            'localField': 'id_user', 
            'foreignField': '_id', 
            'as': 'user'
        }
    }, {
        '$unwind': {
            'path': '$user', 
        }
    }, {
        '$lookup': {
            'from': 'books', 
            'localField': 'id_book', 
            'foreignField': '_id', 
            'as': 'book'
        }
    }, {
        '$unwind': {
            'path': '$book', 
        }
    }, {
        '$match': {
            'id_book': {
                '$in': book_id
            }
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
            'createdAt': 0, 
            'updatedAt': 0, 
            'user.createdAt': 0, 
            'user.updatedAt': 0,
            'book.genre': 0,
            'book.createdAt': 0, 
            'book.updatedAt': 0,
            'book.dimensions': 0,
            'book.page_count': 0,
            'book.language': 0,
            'book.location': 0,
            'book.year': 0,
            'book.publisher': 0,
            'book.synopsis': 0,
        }
    }, 
]

def get_ads_recommendations(query=ads.aggregate(ads_pipeline)):
    premium_recommend = []
    rest_recommendation =[]
    for  ad in query:
        ad['_id'] = str(ad['_id'])
        ad['book']['_id'] = str(ad['book']['_id'])
        ad['id_user'] = str(ad['id_user'])
        ad['id_book'] = str(ad['id_book'])
        ad['user']['_id'] = str(ad['user']['_id'])
        for key,adUser in enumerate(ad['user']['genres']):
            ad['user']['genres'][key] = str(adUser)

        if "id_user_buy" not in ad: 
            if len(premium_recommend) <=10:
                if ad["user"]["account_type"]=="premium":
                    premium_recommend.append(ad)
            elif ad["user"]["account_type"]=="standard" or ad["user"]["account_type"]=="premium":
                if len(rest_recommendation) <=20:
                    rest_recommendation.append(ad)     
    return premium_recommend


# get_ads_recommendations()

reco = get_ads_recommendations()
# print(reco)
# print("___"*30)
print(json.dumps(reco))