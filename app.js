const express = require('express')
require('dotenv').config({ path: './.env' })
const app = express()
const cors = require('cors')
const sendMailRouter = require('./sendMail')

app.get('/api/porfolio', (request, response) => {
  response.send('Bienvenido a la API de mi portfolio!')
})

app.use('/api/porfolio/sendMail', sendMailRouter)

app.use(cors())

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} 🚀`))
