const User = require('../models/User')

async function list(req, res) {
    try {
        return res.status(201).json({ message: `Alou` });
    } catch (error) {
        return Promise.reject(new HttpError(error));
    }
}

async function getByEmail(email) {
    try {
        const user = await User.findOne({ email })
        if (user) return user
        return false
    } catch (error) {
        return res.status(500).json({ message: `Api app error route User (getByEmail)` });
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