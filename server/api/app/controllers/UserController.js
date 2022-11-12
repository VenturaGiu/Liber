const User = require('../models/User')
const jwt = require('../../../config/jwt') 
const config = require('../../../config/variables')
const Mailer = require('../../../lib/mailer/Mailer')
const fs = require('fs');
const Genre = require('../models/Genre');
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

// save_fakeDatas('/home/giulia/Documentos/Liber/scripts/fake_datas.json')
/** Salvar dados fake de usuário no banco
 * @author Giulia Ventura
 * @date 01/11/2022
 * @param {String} pathFile caminho completo do arquivo JSON
 */
//  save_users('scripts\\datas\\fake_datas.json')
 async function save_users(path) {
     try {
         let rawdata = fs.readFileSync(path);
         const users = JSON.parse(rawdata);
         for(const user of users){
             const userModel = new User(user)
             const resp = await userModel.save()
             console.log(resp)
         }
         console.log(users)
     } catch (error) {
          return error
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
        if(userExist) return res.status(200).json({ message: `Endereço de e-mail (${userExist.email}) já cadastrado` });

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
        return res.status(201).json({token, message: `Enviamos um código para: ${resp.email}, por favor confirme seu e-mail antes de realizar o login` });
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
async function login(req, res){
    try {
        const { email, password } = req.body;
        if (!email || !email) return res.status(400).json({ message: `Por favor, preencha todos os campos!` });
        
        const user = await User.findOne({email, password});
        if (!user || user === null || user.length === 0) return res.status(400).json({ message: `E-mail ou senha errado!` });
        if(user.verified === false) return res.status(403).json({ message: `Confirme seu e-mail antes de acessar!` });

        return res.status(200).json({ name: user.name });
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
async function validate(req, res){
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
async function changePass(req, res){
    try {
        const { email } = req.query
        const { password } = req.body
        if (!email) return res.status(403).json({ message: `Token de validação inválido!` });
        const user = await User.findOneAndUpdate({ email }, { password });
        if(!user) return res.status(403).json({ message: `E-mail não encontrado!` })
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
async function forgotPassword(req, res){
    try {
        const { email } = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(403).json({ message: `E-mail não cadastrado!` })
        if(user.verified === false) return res.status(403).json({ message: `Verifique seu e-mail primeiro!` })
        
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
        return res.status(201).json({token, message: `Enviamos um e-mail para: ${user.email} :)` });
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
        return res.status(500).json({ message: `Erro na rota api/app_user (activateAccount)` });
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
    settingsAccount
}