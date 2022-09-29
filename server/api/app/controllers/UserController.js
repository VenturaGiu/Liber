const User = require('../models/User')

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

/*
    𝘼𝙋𝙄
*/

/** 
 * @author Giulia Ventura
 * @date 29/09/2022
 * @param {Request} req requisição node
 * @param {Response} res resposta node
 * @return {Object} dados do usuário
 * @return {String} erro caso o usuário não esteja devidamente credenciado 
 */
async function list(req, res) {
    try {
        const { email, password } = req.body;
        
        return res.status(201).json({ message: `Alou` });
    } catch (error) {
        return Promise.reject(new HttpError(error));
    }
}


async function register(req, res) {
    try {
        const obj = req.body;
        if (!obj.name || !obj.email || !obj.password) return res.status(400).json({ message: `Por favor, preencha todos os dados!` });
        if (obj.password !== obj.confirmPass) return res.status(400).json({ message: `As senhas precisam ser iguais!` });

        const userExist = await getByEmail(obj.email)
        if(userExist) return res.status(200).json({ message: `Endereço de e-mail (${userExist.email}) já cadastrado` });

        const user = new User(obj);
        const resp = await user.save();
        // await sendConfirmationMail(user);
        return res.status(201).json({ message: `Enviamos um e-mail para: ${resp.email}, por favor confirme seu e-mail antes de realizar o login` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Mongo error` });
        }
        return res.status(500).json({ message: `Api app error route User (register)` });
    }
}

module.exports = {
    list,
    register,
}