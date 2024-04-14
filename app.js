const express = require('express')
const mongoose = require('mongoose')
const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')
const cors = require('cors')
const morgan = require('morgan')
const authorityRoute =require('./routes/authorityRoute');
const daaqRoute = require('./routes/daaqRoute');
const userGroupRoute = require('./routes/userGroupRoute');
const userRoute = require('./routes/userRoute');
const teamRoute = require('./routes/teamRoute');
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Microservice API Documentation',
      version: '1.0.0',
      description: 'ms-userall apis',
    },
  },
  apis: ['./routes/*.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

const port = process.env.PORT || 4000
const dbConnectionString = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_IP}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`
app.use(morgan('combined'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.listen(port, () => console.log(`ms-user is running on port ${port}`))
app.use('/api/v0.1', authorityRoute);
app.use('/api/v0.1', daaqRoute);
app.use('/api/v0.1', userGroupRoute);
app.use('/api/v0.1', userRoute);
app.use('/api/v0.1', teamRoute);


mongoose.connect(dbConnectionString).then((result) => {
  console.log(`connected to ${result.connections[0].name}`)
})
