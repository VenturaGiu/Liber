const _ = require('underscore');
const Ad = require('../models/Ad');

//  save_ads('scripts/datas/fake_datas_AD.json')
async function save_ads(path) {
    try {
        let rawdata = fs.readFileSync(path);
        const ads = JSON.parse(rawdata);
        for(const ad of ads){
            const obj = {
                id_user: ObjectId(ad.id_user),
                id_book: ObjectId(ad.id_book),
                price: ad.price,
                type_ad: ad.type_ad,
            }
            if(ad.id_user_buy.length !== 0) { obj.id_user_buy =  ObjectId(ad.id_user_buy) }
            const adModel = new Ad(obj)
            const resp = await adModel.save()
            console.log(resp)
        }
        console.log(ads)
    } catch (error) {
         return error
    }
}

module.exports = {
    
}