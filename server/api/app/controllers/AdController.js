const _ = require('underscore');
const Ad = require('../models/Ad');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');

/**
 * FUNÇÕES
 */

 save_ads('scripts/datas/fake_datas_AD.json')
async function save_ads(path) {
    try {
        let rawdata = fs.readFileSync(path);
        const ads = JSON.parse(rawdata);
        for (const ad of ads) {
            const obj = {
                id_user: ObjectId(ad.id_user),
                id_book: ObjectId(ad.id_book),
                price: ad.price,
                type_ad: ad.type_ad,
            }
            if (ad.id_user_buy.length !== 0) { 
                obj.id_user_buy = ObjectId(ad.id_user_buy) 
                obj.type_buy = ad.type_buy
            }
            const adModel = new Ad(obj)
            const resp = await adModel.save()
            console.log(resp)
        }
        console.log(ads)
    } catch (error) {
        return error
    }
}

/**
 * API
 */

async function getAdByUser(req, res) {
    try {
        const { _id } = req.params
        const items = await Ad.aggregate([
            {
                '$match': {
                    'id_user': ObjectId(_id)
                }
            }, {
                '$lookup': {
                    'from': 'books',
                    'localField': 'id_book',
                    'foreignField': '_id',
                    'as': 'id_book'
                }
            }, {
                '$unwind': {
                    'path': '$id_book'
                }
            }
        ])
        for (const item of items) {
            if(item.id_book.id_user_buy){
                item.status = 'vendido'
            }else{
                item.status = 'anunciado'
            }
        }
        return res.status(200).json(items)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (ListAll)` });
    }
}

async function getAdByUserBuy(req, res) {
    try {
        const { _id } = req.params
        const items = await Ad.aggregate([
            {
                '$match': {
                    'id_user_buy': ObjectId(_id)
                }
            }, {
                '$lookup': {
                    'from': 'books',
                    'localField': 'id_book',
                    'foreignField': '_id',
                    'as': 'id_book'
                }
            }, {
                '$unwind': {
                    'path': '$id_book'
                }
            }
        ])
        return res.status(200).json(items)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (ListAll)` });
    }
}

module.exports = {
    getAdByUser,
    getAdByUserBuy,
}