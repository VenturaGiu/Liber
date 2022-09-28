require('dotenv').config();

module.exports = {
    app: {
      title: 'Liber',
    },
    server: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || '3000',
    },
  
    db: {
      dialect: process.env.DB_DIALECT || 'mongo',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '27017',
      name: process.env.DB_NAME || 'liber',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    },
  
    jwt: {
      encryption: process.env.JWT_ENCRYPTION || '9bIopuq2ea5gDTspoDzQHTdXFTZJgQFfsNKY',
      expiration: process.env.JWT_EXPIRATION || 86400,
    },
  
    mailer: {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      user: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASSWORD || '',
      defaultBCC: process.env.EMAIL_DEFAULT_BCC || 'jula.ventura',
    },
  };