const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { body, check } = require('express-validator')

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
  origin: isProduction ? 'https://tax-client.now.sh' : '*',
}

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(origin))
app.use(compression())
app.use(helmet())


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // 5 requests,
  })
  
  app.use(limiter)

  //show salary

  const getSalaries = (request, response) => {
    pool.query('SELECT * FROM salaries', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  //show by ID

  const getSalariesById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

// POST salaries
  
  const addSalaries = (request, response) => {
    const { name, salary, monthlyTax } = request.body
  
    pool.query('INSERT INTO salaries (name, salary, monthlyTax) VALUES ($1, $2, $3)', [name, salary, monthlyTax], error => {
      if (error) {
        throw error
      }
      response.status(201).json({ status: 'success', message: 'salaries added.' })
    })
  }
  

  const deleteSalaries = (request,response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }


  app
    .route('/salaries')
    // GET endpoint
    .get(getSalaries)
    .get(getSalariesById)
    // POST endpoint
    .post(addSalaries)
    //DELETE endpoint
    .delete(deleteSalaries)
  
  // Start server
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server listening`)
  })
