const User = require('../models/User')
const jwt = require('../../../config/jwt') 
const config = require('../../../config/variables')
const Mailer = require('../../../lib/mailer/Mailer')
const fs = require('fs');
const { spawn } = require('child_process');
const { exec } = require('node:child_process');
const path = require('path');
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
        return res.status(500).json({ message: `Erro na rota api/dash_user (getByEmail)` });
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
        .setHTML('welcome', messages.confirmation)
        .send();
    } catch (error) {
        return res.status(500).json({ message: `Erro na rota api/dash_user (sendConfirmationMail) \n ${error}` });
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
        if(user.length === 0 ) return res.status(200).json({ message: `Nenhum usuário cadastrado no momento!` }); 
        return res.status(201).send(user);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/dash_user (ListAll)` });
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
        // Envio de e-mail para confirmação
        const token = jwt.sign({ email: user.email });
        const messages = {
            confirmation: {
                subject: `Bem-vindo a Dashboard do Liber, ${user.name}!`,
                message: "Muito obrigada por se cadastrar!",
                message2: "Primeiro você precisa confirmar sua conta. Apenas clique no botão abaixo!",
                link: `http://${config.server.host}:5173/dashboard/verified?token=${token}`,
                username: `${user.name}`,
                button: `Confirmar E-mail`,
            },
        };
        await sendConfirmationMail(user, messages);
        return res.status(201).json({ message: `Enviamos um e-mail para: ${resp.email}, por favor confirme seu e-mail antes de realizar o login` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        console.log(error)
        return res.status(500).json({ message: error });
    }
}

/** Acessar conta
 * @author Giulia Ventura
 * @date 04/10/2022
 * @param {Request} req requisição node
 * @param {Response} res resposta node
 * @return {Json} token e nome de usuário ou mensagem de erro 
 */
async function login(req, res){
    try {
        const { email, password } = req.body;
        if (!email || !email) return res.status(400).json({ message: `Por favor, preencha todos os campos!` });
        
        const user = await User.findOne({email, password});
        if (!user || user === null || user.length === 0) return res.status(400).json({ message: `E-mail ou senha errado!` });
        if(user.verified === false) return res.status(403).json({ message: `Confirme seu e-mail antes de acessar!` });
        
        const token = jwt.sign({ email: user.email })

        res.cookie('token', token)
        
        return res.status(200).json({ token, name: user.name });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/dash_user (Login)` });
    }
}

/** Rota de validação do e-mail fornecido pelo usuário
 * @author Giulia Ventura
 * @date 11/10/2022
 * @param {Request} req requisição node
 * @param {Response} res resposta node
 * @return {Json} mensagem de sucesso caso de certo ou de erro
 */
async function validate(req, res){
    try {
        const { token } = req.query
        const userVerified = jwt.verify(token);
        if (!userVerified || !userVerified.email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email: userVerified.email }, { verified: true });
        if (!user) return res.status(406).json({ message: `Usuário inválido!` });
        return res.status(200).json({ message: `E-mail verificado com sucesso!` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/dash_user (validate)` });
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
async function updateUserInformation(req, res){
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
        return res.status(500).json({ message: `Erro na rota api/dash_user (updateUserInformation)` });
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
async function changePass(req, res){
    try {
        const { token } = req.body
        const { password } = req.body
        const userVerified = jwt.verify(token);
        if (!userVerified || !userVerified.email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email: userVerified.email }, { password });
        if(!user) return res.status(403).json({ message: `E-mail não encontrado!` })
        return res.status(200).json({ message: `Senha alterada com sucesso!` })
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        console.log(error)
        return res.status(500).json({ message: `Erro na rota api/dash_user (changePass)` });
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
async function forgotPassword(req, res){
    try {
        const { email } = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(403).json({ message: `E-mail não cadastrado!` })
        if(user.verified === false) return res.status(403).json({ message: `Verifique seu e-mail primeiro!` })
        
        // Envio de e-mail para confirmação
        const token = jwt.sign({ email: user.email });
        const messages = {
            confirmation: {
                subject: 'Esqueceu sua senha?',
                message: "Se você não solicitou a alteração de senha desconsidere essa mensagem!",
                message2: "Caso você tenha solicitado, clique no link abaixo para alterar sua senha:",
                link: `http://${config.server.host}:5173/dashboard/reset?token=${token}`,
                username: `${user.name}`,
                button: `Alterar senha`,
            },
        };
        await sendConfirmationMail(user, messages);
        return res.status(201).json({ message: `Enviamos um e-mail para: ${user.email} :)` });
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(500).json({ message: `Erro no Mongo` });
        }
        return res.status(500).json({ message: `Erro na rota api/dash_user (forgotPassword)` });
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
async function settingsAccount(req, res){
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
        return res.status(500).json({ message: `Erro na rota api/dash_user (activateAccount)` });
    }
}

/** CHAMANDO SISTEMA DE RECOMENDAÇÃO
* OBS: o usuário precisa estar logado
* @author Arthur Rocha
* @date 19/11/2022
* @param {Request} req requisição node
* @param {Response} res resposta node
* @return {Json} mensagem de sucesso caso de certo ou de erro
*/
async function generateDataReports(req, res) {
    const { type } = req.params
    try {
        const py = spawn(process.env.PYTHON_V, [`${path.resolve()}/scripts/generate_report/pdf_reports.py`, '-url', String(type)], {
        });
        py.stdout
            .on('close', async() => {
                res.type('text/plain')
                res.send('ok')
            })
        py.stderr
            .on('data', async(data) => {
                console.log('Deu ruim');
                res.type('application/json')
                res.send(data.message)
            })
            
    } catch (error) {
        /*deixei essa linha pq n sabia oq significava :)*/ 
        return res.status(500).json({ message: `Erro na rota api/app_user (generateDataReports)` });
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
    generateDataReports
}