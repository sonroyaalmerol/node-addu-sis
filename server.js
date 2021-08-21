// Require the framework and instantiate it
require('dotenv').config()

const SIS = require('./index')

const fastify = require('fastify')()

fastify.register(require('fastify-cors'), { 
  // put your options here
  origin: '*'
})


fastify.register(require('fastify-auth'))
fastify.register(require('fastify-basic-auth'), { validate })
async function validate (username, password, req, reply) {
  const sis = new SIS(username, password)
  try {
    const registration = await sis.getRegistration()
    req.username = username
    req.password = password
    req.registration = registration
    req.sis = sis
  } catch (err) {
    return err
  }
}

fastify.after(() => {
  // use preHandler to authenticate all the routes
  fastify.addHook('preHandler', fastify.auth([fastify.basicAuth]))

  fastify.route({
    method: 'GET',
    url: '/subjects',
    // use onRequest to authenticate just this one
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: async (req, reply) => {
      return req.registration.subjects.all()
    }
  })
  fastify.route({
    method: 'GET',
    url: '/user',
    // use onRequest to authenticate just this one
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: async (req, reply) => {
      return req.registration.user.all()
    }
  })
  fastify.route({
    method: 'GET',
    url: '/grades',
    // use onRequest to authenticate just this one
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: async (req, reply) => {
      const grades = await req.sis.getGrades()
      return grades.all()
    }
  })
  fastify.route({
    method: 'GET',
    url: '/curriculum',
    // use onRequest to authenticate just this one
    onRequest: fastify.auth([fastify.basicAuth]),
    handler: async (req, reply) => {
      const curriculum = await req.sis.getCurriculum()
      return curriculum.all()
    }
  })
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(8080)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()