const User = require('../models/User')

async function list(req, res) {
    try {
        return res.status(201).json({ message: `Alou` });
    } catch (error) {
        return Promise.reject(new HttpError(error));
    }
}

async function register(req, res) {
    try {
        const { name, email, password, confirmPass } = req.body;

        if (!name || !email || !password) return Promise.reject(new BadRequestError('Fill datas'));
        if (password !== confirmPass) return Promise.reject(new BadRequestError('Please, passwords must be the same!'));

        const user = new User(obj);
        const resp = await user.save();
        // await sendConfirmationMail(user);
        return res.status(201).json({ message: `We've sent an email to ${resp.email}, please confirm your email before login` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Mongo error` });
        }
        return res.status(500).json({ message: `Api app error` });
    }
}

module.exports = {
    list,
    register,
}