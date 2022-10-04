const nodemailer = require('nodemailer');
const ejs = require('ejs');
const _ = require('underscore');
const variables = require('../../config/variables');

class Mailer {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: variables.mailer.host,
      secureConnection: false,
      port: variables.mailer.port,
      // secure: false, // true for 465, false for other ports
      service: 'hotmail',
      auth: {
        user: variables.mailer.user, // generated ethereal user
        pass: variables.mailer.password, // generated ethereal password
      },
      tls: {
        ciphers:'SSLv3'
      },
    });
    this._message = { from: 'giulia-ratti@hotmail.com', envelope: { to: '', bcc: `${variables.mailer.defaultBCC}` } };
  }

  setFrom(from) {
    this._message.from = from;
    this._message.envelope.from = from;
    return this;
  }

  setTo(to) {
    if (!_.isArray(to) && !_.isString(to)) { return this; }
    this._message.envelope.to += _.isArray(to) ? `,${to.join(',')}` : `,${to}`;
    return this;
  }

  setCC(cc) {
    return this.setTo(cc);
  }

  setBCC(bcc) {
    if (!_.isArray(bcc) && !_.isString(bcc)) { return this; }
    this._message.envelope.bcc += _.isArray(bcc) ? `,${bcc.join(',')}` : `,${bcc}`;
    return this;
  }

  setText(text) {
    this._message.text = text;
    return this;
  }

  setHTML(template, data) {
    ejs.renderFile(`${__dirname}/templates/${template}.ejs`, data, (err, dataRendered) => {
      if (err) { throw new Error(err); }
      this._message.html = dataRendered;
    });
    return this;
  }

  setSubject(subject) {
    this._message.subject = subject;
    return this;
  }

  async send(params) {
    try {
      this._message = params || this._message;
      return this.transporter.sendMail(this._message);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Mailer;
