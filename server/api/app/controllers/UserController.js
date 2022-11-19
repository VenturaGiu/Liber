const User = require('../models/User')
const jwt = require('../../../config/jwt')
const { ObjectId } = require('mongoose').Types;
const config = require('../../../config/variables')
const Mailer = require('../../../lib/mailer/Mailer')
const fs = require('fs');
const Genre = require('../models/Genre');
const Ad = require('../models/Ad');
const _ = require('underscore');
const Address = require('../models/Address');
const Card = require('../models/Card');

const { spawn } = require('child_process')
const child = spawn('pwd', [], {shell: true});
/*
𝗙𝗨𝗡𝗖̧𝗢̃𝗘𝗦
*/

/** Recuperar usuário através do e-mail
* @author Giulia Ventura
* @date 29/09/2022
* @param {String} email
* @return {Object} dados do usuário
* @return {Boolean} false caso não encontre o usuário 
*/
async function getByEmail(email) {
    try {
        const user = await User.findOne({ email })
        if (user) return user
        return false
    } catch (error) {
        return res.status(500).json({ message: `Erro na rota api/app_user (getByEmail)` });
    }
}

/** Enviar confimação para email
* @author Giulia Ventura
* @date 04/10/2022
* @param {Object} user dados do usuário
*/
async function sendConfirmationMail(user, messages) {
    try {
        const m = new Mailer();
        await m.setTo(String(user.email))
            .setSubject(`${messages.confirmation.subject}`)
            .setHTML('welcome_app', messages.confirmation)
            .send();
    } catch (error) {
        return res.status(500).json({ message: `Erro na rota api/app_user (sendConfirmationMail) \n ${error}` });
    }
}

/** Salvar dados fake de usuário no banco
* @author Giulia Ventura
* @date 01/11/2022
* @param {String} pathFile caminho completo do arquivo JSON
*/
//  save_users('scripts/datas/fake_datas.json')
async function save_users(path) {
    try {
        let rawdata = fs.readFileSync(path);
        const users = JSON.parse(rawdata);
        for (const user of users) {
            const userModel = new User(user)
            const resp = await userModel.save()
            console.log(resp)
        }
        console.log(users)
    } catch (error) {
        return error
    }
}

/** Gerar numeros aleatórios
* @author Giulia Ventura
* @date 01/11/2022
* @param {Number} min número mínimo
* @param {Number} max número máximo
* @return {Number} numero aleatório
*/
async function between(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

async function insert_keyWords() {
    try {
        const users = await User.find({})
        for (const user of users) {
            const key_words = []
            const numberRandom = await between(3, 5)
            const genres = await Genre.aggregate([
                {
                    $sample: { size: numberRandom }
                }
            ])
            for (const genre of genres) {
                key_words.push(ObjectId(genre._id))
            }
            const resp = await User.updateOne({ _id: user._id }, { genres: key_words })
            console.log(genres.length)
        }
    } catch (error) {

    }
}

/*
𝘼𝙋𝙄
*/

/**  Listar todos os usuário cadastrados
* @author Giulia Ventura
* @date 29/09/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Object} dados do usuário
* @return {Array} Dados do usuário ou mensagem de erro 
*/
async function listAll(req, res) {
    try {
        const user = await User.find({})
        if (user.length === 0) return res.status(200).json({ message: `Nenhum usuário cadastrado no momento!` });
        return res.status(201).send(user);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (ListAll)` });
    }
}

/** Registrar usuário na base de dados
* @author Giulia Ventura
* @date 04/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} Dados do usuário ou mensagem de erro 
*/
async function register(req, res) {
    try {
        const obj = req.body;
        if (!obj.name || !obj.email || !obj.password) return res.status(400).json({ message: `Por favor, preencha todos os campos!` });
        if (obj.password !== obj.confirmPass) return res.status(400).json({ message: `As senhas precisam ser iguais!` });

        const userExist = await getByEmail(obj.email)
        if (userExist) return res.status(200).json({ message: `Endereço de e-mail (${userExist.email}) já cadastrado` });

        const user = new User(obj);
        const resp = await user.save()
        const token = '1234';
        // Envio de e-mail para confirmação
        const messages = {
            confirmation: {
                subject: `Bem-vindo ao Liber, ${user.name}!`,
                message: "Muito obrigada por se inscrever!",
                message2: "Confirme o token recebido no aplicativo!",
                link: token,
                username: `${user.name}`,
            },
        };
        await sendConfirmationMail(user, messages);
        return res.status(201).json({ token, message: `Enviamos um código para: ${resp.email}, por favor confirme seu e-mail antes de realizar o login` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (register)` });
    }
}

/** Acessar conta
* @author Giulia Ventura
* @date 04/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} token e nome de usuário ou mensagem de erro 
*/
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !email) return res.status(400).json({ message: `Por favor, preencha todos os campos!` });

        const user = await User.findOne({ email, password });
        if (!user || user === null || user.length === 0) return res.status(400).json({ message: `E-mail ou senha errado!` });
        if (user.verified === false) return res.status(403).json({ message: `Confirme seu e-mail antes de acessar!` });

        return res.status(200).json({ name: user.name, user: user });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (Login)` });
    }
}

/** Rota de validação do e-mail fornecido pelo usuário
* @author Giulia Ventura
* @date 11/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function validate(req, res) {
    try {
        const { email } = req.body
        if (!email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email }, { verified: true });
        if (!user) return res.status(406).json({ message: `Usuário inválido!` });
        return res.status(200).json({ message: `E-mail verificado com sucesso!` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (validate)` });
    }
}

/** Atualizar informações básicas do usuário
* OBS: os campos 'email', '_id', 'verified' e 'account_type' não poderão ser modificados através dessa rota
* @author Giulia Ventura
* @date 11/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function updateUserInformation(req, res) {
    try {
        const { token } = req.query
        const obj = req.body
        const userVerified = jwt.verify(token);
        if (!userVerified || !userVerified.email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.partialUpdate(userVerified.email, obj)
        if (!user) return res.status(403).json({ message: `Operação não realizada, informe o administrador!` });
        return res.status(200).json({ message: `Dados atualizados com sucesso!` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (updateUserInformation)` });
    }
}

/** Alterar senha mediante TOKEN de autenticação
* OBS: o token deve ser recuperado através da rota forgotPassword, um e-mail será encaminhado ao usuário
* @author Giulia Ventura
* @date 11/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function changePass(req, res) {
    try {
        const { email } = req.query
        const { password } = req.body
        if (!email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email }, { password });
        if (!user) return res.status(403).json({ message: `E-mail não encontrado!` })
        return res.status(200).json({ message: `Senha alterada com sucesso!` })
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (changePass)` });
    }
}

/** Solicitar alteração da senha
* OBS: aqui o usuário só vai requisitar a alteração e um e-mail será enviado, mas não é por essa rota que ele irá trocar de senha
* @author Giulia Ventura
* @date 11/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function forgotPassword(req, res) {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(403).json({ message: `E-mail não cadastrado!` })
        if (user.verified === false) return res.status(403).json({ message: `Verifique seu e-mail primeiro!` })

        // Envio de e-mail para confirmação
        const token = '1234';
        const messages = {
            confirmation: {
                subject: 'Esqueceu sua senha?',
                message: "Se você não solicitou a alteração de senha desconsidere essa mensagem!",
                message2: "Caso você tenha solicitado, clique no link abaixo para alterar sua senha:",
                link: `link do app (da página de alterar senha)`,
                username: token,
                button: `Alterar senha`,
            },
        };
        await sendConfirmationMail(user, messages);
        return res.status(201).json({ token, message: `Enviamos um e-mail para: ${user.email} :)` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (forgotPassword)` });
    }
}

/** ATIVAR ou DESATIVAR a conta mediante autenticação com TOKEN 
* OBS: o usuário precisa estar logado para ativar ou desativar a conta
* @author Giulia Ventura
* @date 11/10/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function settingsAccount(req, res) {
    try {
        const { token } = req.query
        const { activated } = req.body
        const userVerified = jwt.verify(token);
        if (!userVerified || !userVerified.email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email: userVerified.email }, { activated });
        if (!user) return res.status(500).json({ message: `Operação não realizada, contate o administrador!` });
        return res.status(201).json({ message: `Conta ${activated === true ? 'reativada' : 'desativada'}!` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (activateAccount)` });
    }
}

async function listAllIfosUser(req, res) {
    try {
        const { email } = req.params
        const address = await User.aggregate([
            {
                '$match': {
                  'email': email
                }
            },
            {
              '$lookup': {
                'from': 'address', 
                'localField': 'address', 
                'foreignField': '_id', 
                'as': 'address'
              }
            }, {
              '$unwind': {
                'path': '$address'
              }
            }, {
              '$match': {
                'address.main': true
              }
            }, {
              '$lookup': {
                'from': 'cards', 
                'localField': 'cards', 
                'foreignField': '_id', 
                'as': 'cards'
              }
            }, {
              '$unwind': {
                'path': '$cards'
              }
            }, {
              '$match': {
                'cards.main': true
              }
            }
          ])
        return res.status(200).json(address); 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (saveNewAddress)` });
    }
}

/** 
 * ADDRESS
*/
async function saveNewAddress(req, res) {
    try {
        const address = req.body
        const { email } = req.body
        const cleanObj = _.omit(address, ['email']);
        const addA = new Address(cleanObj)
        await addA.save()

        const userAddress = await User.findOne({ email })
        const obj = userAddress.address === 0 ? [] : userAddress.address
        obj.push(addA._id) 

        const user = await User.findOneAndUpdate({ email }, { address: obj }, { new: true })
        return res.status(200).json(user);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (saveNewAddress)` });
    }
}

async function updateAddress(req, res) {
    try {
        const address = req.body
        const { _id } = req.body
        const cleanObj = _.omit(address, ['_id']);
        const newAddress = await Address.findOneAndUpdate({ _id: ObjectId(_id) }, cleanObj, { new: true })
        return res.status(200).json(newAddress); 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (updateAddress)` });
    }
}

async function listAddressByUser(req, res) {
    try {
        const { email } = req.params
        const address = await User.aggregate([
            {
                '$match': {
                  'email': email
                }
            },
            {
              '$project': {
                'address': 1
              }
            }, {
              '$lookup': {
                'from': 'address', 
                'localField': 'address', 
                'foreignField': '_id', 
                'as': 'address'
              }
            }
        ])
        return res.status(200).json(address); 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (listAddressByUser)` });
    }
}

async function deleteAddressById(req, res) {
    try {
        const { _id } = req.body
        await Address.findByIdAndDelete(_id)
        const user = await User.findOne({ address: ObjectId(_id) })
        const cleanObj = []
        for(const a of user.address){
            if(String(a) !== _id) cleanObj.push(a)
        }
        await User.findOneAndUpdate({ email: user.email }, { address: cleanObj })
        const addressUp = await User.aggregate([
            {
                '$match': {
                  'email': user.email
                }
            },
            {
              '$project': {
                'address': 1
              }
            }, {
              '$lookup': {
                'from': 'address', 
                'localField': 'address', 
                'foreignField': '_id', 
                'as': 'address'
              }
            }
        ])
        return res.status(200).json(addressUp)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (deleteAddressByUser)` });
    }
}

/** 
 * CARD
*/
async function saveNewCard(req, res) {
    try {
        const card = req.body
        const { email } = req.body
        const cleanObj = _.omit(card, ['email']);
        const addC = new Card(cleanObj)
        await addC.save()

        const userCard = await User.findOne({ email })
        const obj = userCard.cards === 0 ? [] : userCard.cards
        obj.push(addC._id) 

        const user = await User.findOneAndUpdate({ email }, { cards: obj }, { new: true })
        return res.status(200).json(user);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (saveNewAddress)` });
    }
}

async function updateCard(req, res) {
    try {
        const card = req.body
        const { _id } = req.body
        const cleanObj = _.omit(card, ['_id']);
        const newCard = await Card.findOneAndUpdate({ _id: ObjectId(_id) }, cleanObj, { new: true })
        return res.status(200).json(newCard); 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (updateCard)` });
    }
}

async function listCardsByUser(req, res) {
    try {
        const { email } = req.params
        const cards = await User.aggregate([
            {
                '$match': {
                  'email': email
                }
            },
            {
              '$project': {
                'cards': 1
              }
            }, {
              '$lookup': {
                'from': 'cards', 
                'localField': 'cards', 
                'foreignField': '_id', 
                'as': 'cards'
              }
            }
          ])
        return res.status(200).json(cards); 
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (listCardsByUser)` });
    }
}

async function deleteCardById(req, res) {
    try {
        const { _id } = req.body
        await Card.findByIdAndDelete(_id)
        const user = await User.findOne({ cards: ObjectId(_id) })
        const cleanObj = []
        for(const c of user.cards){
            if(String(c) !== _id) cleanObj.push(c)
        }
        await User.findOneAndUpdate({ email: user.email }, { cards: cleanObj })
        const cardsUp = await User.aggregate([
            {
                '$match': {
                  'email': user.email
                }
            },
            {
              '$project': {
                'cards': 1
              }
            }, {
              '$lookup': {
                'from': 'cards', 
                'localField': 'cards', 
                'foreignField': '_id', 
                'as': 'cards'
              }
            }
        ])
        return res.status(200).json(cardsUp)
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/app_user (deleteAddressByUser)` });
    }
}

/** CHAMANDO SISTEMA DE RECOMENDAÇÃO
* OBS: o usuário precisa estar logado
* @author Arthur Rocha
* @date 15/11/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function getRecommendations(req, res) {
    try {
        const { _id } = req.body
        const user = await User.findOne({ id: ObjectId(_id) })
        const py = spawn('python3.8', ['/home/giulia/Documentos/Liber/scripts/recommendation.py', '-uid', String(user._id)], {
        });
        py.stdout
            .on('data', async(data) => {
                const json = JSON.parse(data.toString())
                console.log(json);
                res.type('application/json')
                res.send(json)
            })
        py.stderr
            .on('data', async(data) => {
                console.log('Deu ruim');
                res.type('application/json')
                res.send(data)
            })
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        /*deixei essa linha pq n sabia oq significava :)*/ 
        return res.status(500).json({ message: `Erro na rota api/app_user (getRecommendations)` });
    }
}

module.exports = {
    getByEmail,
    listAll,
    register,
    login,
    validate,
    updateUserInformation,
    forgotPassword,
    changePass,
    settingsAccount,
    listAllIfosUser,
    saveNewAddress,
    updateAddress,
    listAddressByUser,
    deleteAddressById,
    saveNewCard,
    updateCard,
    listCardsByUser,
    deleteCardById,
    getRecommendations
}