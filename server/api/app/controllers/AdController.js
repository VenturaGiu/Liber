const _ = require('underscore');
const Ad = require('../models/Ad');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
const Solicitation = require('../models/Solicitation');

/**
 * FUNÇÕES
 */

async function swap(obj) {
    try {
        const solicitation = new Solicitation(obj)
        const resp = await solicitation.save()
        return resp
    } catch (error) {
        return error
    }
}

async function buy(obj) {
    try {
        
    } catch (error) {
        return error
    }
}

// save_ads('scripts/datas/fake_datas_AD.json')
async function save_ads(path) {
    try {
        let rawdata = fs.readFileSync(path);
        const ads = JSON.parse(rawdata);
        for (const ad of ads) {
            const obj = {
                id_user: ObjectId(ad.id_user),
                id_book: ObjectId(ad.id_book),
                type_ad: ad.type_ad,
            }
            if (ad.id_user_buy.length !== 0) { 
                obj.id_user_buy = ObjectId(ad.id_user_buy) 
            }
            if(ad.type_ad === 'venda'){
                obj.price = ad.price
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
        return res.status(500).json({ message: `Erro na rota api/app_ad (getAdByUser)` });
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
        return res.status(500).json({ message: `Erro na rota api/app_ad (getAdByUserBuy)` });
    }
}

async function createAd(req, res) {
    try {
        const obj = req.body
        const ad = new Ad(obj)
        await ad.save()
        return res.status(200).json(ad)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (createAd)` });
    }
}

async function editAd(req, res) {
    try {
        const { _id } = req.body
        const obj = req.body
        const cleanObj = _.omit(obj, ['_id']);
        const ad = await Ad.findByIdAndUpdate({ _id }, cleanObj, { new: true })
        if(!ad) { return res.status(403).json({ message: 'Não encontramos o anuncio especificado' }) }
        return res.status(200).json(ad)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (getAdByUserBuy)` });
    }
}

async function deteleAd(req, res) {
    try {
        const { _id } = req.body
        const ad = await Ad.findByIdAndDelete({ _id })
        if(!ad) { return res.status(403).json({ message: 'Não encontramos o anuncio especificado' }) }
        return res.status(200).json(ad)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (getAdByUserBuy)` });
    }
}

async function buyOrswap(req, res) {
    try {
        const { type_ad } = req.params
        const obj = req.body
        if(type_ad === 'troca'){
            const resp = await swap(obj)
            return res.status(200).json(resp)
        }else{
            const resp = await buy(obj)
            return res.status(200).json(resp)
        }
    } catch (error) {
        
    }
}

module.exports = {
    getAdByUser,
    getAdByUserBuy,
    createAd,
    editAd,
    deteleAd,
}