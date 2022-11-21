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
        return res.status(500).json({ message: `Erro na rota api/app_ad (editAd)` });
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
        return res.status(500).json({ message: `Erro na rota api/app_ad (deteleAd)` });
    }
}

async function buyOrswap(req, res) {
    try {
        const { _id } = req.params
        const obj = req.body
        if(obj.type_ad === 'troca'){
            const cleanObj = _.omit(obj, ['type_ad']);
            cleanObj.id_ad = _id
            const resp = await swap(cleanObj)
            if(!resp) res.status(403).json({ message: "Solicitação não realizada :(" })
            return res.status(200).json({ message: "Solicitação enviada :)" })
        }else{
            const respAd = await Ad.findByIdAndUpdate({ _id }, { id_user_buy: ObjectId(obj.id_user_buy) }, { new: true })
            if(!respAd) res.status(403).json({ message: 'Compra não realizada :( \n tente novamente mais tarde' })
            return res.status(200).json({ message: 'Compra realizada com sucesso :) \n Converse com o vendedor para definir o método de entrega!' })
        }
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (buyOrswap)` });   
    }
}

async function removeSolicitation(req, res) {
    try {
        const { _id } = req.params
        const resp = await Solicitation.findByIdAndUpdate({ _id }, { status: 'recusado' })
        if(resp) return res.status(200).json({ message: 'Solicitação recusada!' })
        return res.status(403).json({ message: 'Houve um problema ao recusar a solicitação :(' })
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (removeSolicitation)` });
    }
}

async function acceptSolicitation(req, res) {
    try {
        const { _id } = req.params
        const obj = req.body

        const adUpdate = await Ad.findByIdAndUpdate({ _id: obj.id_ad }, { id_user_buy: obj.id_user_solicitation })
        const adUpdateSolicitation = await Ad.findByIdAndUpdate({ _id: obj.id_ad_solicitation }, { id_user_buy: obj.id_user })

        if(adUpdate && adUpdateSolicitation){
            const resp = await Solicitation.findByIdAndUpdate({ _id }, { status: 'aceito' })
            if(resp) return res.status(200).json({ message: 'Livro trocado com sucesso!' })
        }
        return res.status(403).json({ message: 'Houve um problema ao aceitar a solicitação! :(' })
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (acceptSolicitation)` });
    }
}

async function getSolicitationsByUserEmail(req, res) {
    try {
        const { _id } = req.params
        const resp = await Solicitation.aggregate([{
                '$match': {
                    'status': 'analisando', 
                    'id_user': ObjectId(_id)
                }
            }, {
                '$lookup': {
                  'from': 'users', 
                  'localField': 'id_user', 
                  'foreignField': '_id', 
                  'as': 'id_user'
                }
            }, {
              '$unwind': {
                'path': '$id_user'
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'id_user_solicitation', 
                'foreignField': '_id', 
                'as': 'id_user_solicitation'
              }
            }, {
              '$unwind': {
                'path': '$id_user_solicitation'
              }
            }, {
              '$lookup': {
                'from': 'ads', 
                'localField': 'id_ad', 
                'foreignField': '_id', 
                'as': 'id_ad'
              }
            }, {
              '$unwind': {
                'path': '$id_ad'
              }
            }, {
              '$lookup': {
                'from': 'books', 
                'localField': 'id_ad.id_book', 
                'foreignField': '_id', 
                'as': 'book_ad'
              }
            }, {
              '$unwind': {
                'path': '$book_ad'
              }
            }, {
              '$lookup': {
                'from': 'ads', 
                'localField': 'id_ad_solicitation', 
                'foreignField': '_id', 
                'as': 'id_ad_solicitation'
              }
            }, {
              '$unwind': {
                'path': '$id_ad_solicitation'
              }
            }, {
              '$lookup': {
                'from': 'books', 
                'localField': 'id_ad_solicitation.id_book', 
                'foreignField': '_id', 
                'as': 'book_ad_solicitation'
              }
            }, {
              '$unwind': {
                'path': '$book_ad_solicitation'
              }
            }, {
              '$project': {
                'id_user._id': 1, 
                'id_user.name': 1, 
                'id_user.email': 1, 
                'id_user_solicitation._id': 1, 
                'id_user_solicitation.name': 1, 
                'id_user_solicitation.email': 1, 
                'id_ad._id': 1, 
                'id_ad_solicitation._id': 1, 
                'book_ad._id': 1, 
                'book_ad.title': 1, 
                'book_ad.isbn': 1, 
                'book_ad.path_img': 1, 
                'book_ad_solicitation._id': 1, 
                'book_ad.book_ad_solicitation.isbn': 1, 
                'book_ad_solicitation.title': 1
              }
            }
          ]) 
        if(!resp) return res.status(403).json({ message: 'Sem solicitações por enquanto :)' }) 
        return res.status(200).json(resp[0]) 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (acceptSolicitation)` });   
    }
}

async function getAdsPaginate(req, res) {
    try {
        const ads = await Ad.aggregate([
            {
                '$sample': {
                    size: 30
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
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'id_user',
                    'foreignField': '_id',
                    'as': 'id_user'
                }
            }, {
                '$unwind': {
                    'path': '$id_user'
                }
            }
        ])

        return res.status(200).json(ads)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (acceptSolicitation)` });   
    }
}

async function getAdsById(req, res) {
    try {
        const { _id } = req.params
        const ads = await Ad.aggregate([
            {
                '$match': {
                    _id: ObjectId(_id)
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
            }, {
                '$lookup': {
                    'from': 'users',
                    'localField': 'id_user',
                    'foreignField': '_id',
                    'as': 'id_user'
                }
            }, {
                '$unwind': {
                    'path': '$id_user'
                }
            }
        ])

        return res.status(200).json(ads[0])
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_ad (acceptSolicitation)` });   
    }
}

module.exports = {
    getAdByUser,
    getAdByUserBuy,
    createAd,
    editAd,
    deteleAd,
    buyOrswap,
    acceptSolicitation,
    removeSolicitation,
    getSolicitationsByUserEmail,
    getAdsPaginate,
    getAdsById,
}