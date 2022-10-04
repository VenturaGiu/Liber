const User = require('../models/User')
const jwt = require('../../../config/jwt') 
const config = require('../../../config/variables')
const Mailer = require('../../../lib/mailer/Mailer')

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
        return res.status(500).json({ message: `Api app error route User (getByEmail)` });
    }
}

/** Enviar confimação para email
 * @author Giulia Ventura
 * @date 04/10/2022
 * @param {Object} user dados do usuário
 */
async function sendConfirmationMail(user) {
    const token = jwt.sign({ email: user.email });
    const messages = {
      confirmation: {
        subject: 'Bem-vindo ao Liber',
        message: "Muito obrigada por se inscrever!",
        message2: "Primeiro você precisa confirmar sua conta. Apenas clique no botão abaixo!",
        link: `http://${config.server.host}:${config.server.port}/api/app_user/validate?token=${token}`,
        username: `${user.name}`,
      },
    };
  
    const m = new Mailer();
    await m.setTo(user.email)
      .setSubject(`${messages.confirmation.subject}, ${user.name}`)
      .setHTML('welcome', messages.confirmation)
      .send();
}

/*
    𝘼𝙋𝙄
*/

/** 
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
        if(user.length === 0 ) return res.status(200).json({ message: `Nenhum usuário cadastrado no momento!` }); 
        return res.status(201).send(user);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Api app error route User (ListAll)` });
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
        if(userExist) return res.status(200).json({ message: `Endereço de e-mail (${userExist.email}) já cadastrado` });

        const user = new User(obj);
        const resp = await user.save();
        await sendConfirmationMail(user);
        return res.status(201).json({ message: `Enviamos um e-mail para: ${resp.email}, por favor confirme seu e-mail antes de realizar o login` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Api app error route User (register)` });
    }
}

async function login(req, res){
    try {
        const { email, password } = req.body;
        if (!email || !email) return res.status(400).json({ message: `Por favor, preencha todos os campos!` });
        
        const user = await User.findOne({email, password});
        if (user.length === 0) return res.status(400).json({ message: `E-mail ou senha errado!` });

        return res.status(200).json({ token: jwt.sign({ email: user.email }), name: user.name });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Api app error route User (Login)` });
    }
}

module.exports = {
    listAll,
    register,
    login,
    getByEmail,
}