require('dotenv').config({ path: './.env' })
const nodemailer = require('nodemailer')
const express = require('express')
const { google } = require('googleapis')
const cors = require('cors')

const OAuth2 = google.auth.OAuth2
const app = express()

const gmailClientId = process.env.GMAIL_CLIENT_ID
const gmailClientSecret = process.env.GMAIL_CLIENT_SECRET
const gmailApiKey = process.env.GMAIL_API_KEY

app.use(cors())
app.use(express.json())

async function createTransporter () {
  const oauth2Client = new OAuth2(
    gmailClientId,
    gmailClientSecret,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    access_token: gmailApiKey,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  })

  const accessToken = await oauth2Client.getAccessToken()

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ivantelleria96@gmail.com',
      clientId: gmailClientId,
      clientSecret: gmailClientSecret,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

app.get('/api/portfolio', (request, response) => {
  response.send('Bienvenido a la API de mi portfolio!')
})

app.post('/api/portfolio/sendMail', async (req, res) => {
  const { email, name, message } = req.body
  const transporter = await createTransporter()

  const mailOptions = {
    from: 'ivantelleria96@gmail.com',
    to: 'ivantelleria96@gmail.com',
    subject: `Mensaje de ${name} desde el Portfolio`,
    text: `${email}, ${message}`
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      res.status(500).send(error.message)
    } else {
      console.log('Correo enviado')
      res.status(200).jsonp(email)
    }
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} 🚀`))

module.exports = { app }
