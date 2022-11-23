const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
const redis = require('redis')


const client = redis.createClient({
    host: '127.0.0.1',
    port: 6379
})

client.connect()

const app = express()

app.use(responseTime())



app.get('/character', async (req,res) => {

    const result = client.get('characters', function(err, reply) {
        return reply; 
    });

    
    result.then(async (val) => {
        if(val){
            console.log('get from redis')
            res.json(JSON.parse(val))
        } else {
            console.log('get from axios')
            const response = await axios.get('https://rickandmortyapi.com/api/character')
            // set to redis for next time
            client.set('characters', JSON.stringify(response.data), (err, reply) => {
                if(err) console.log(err)
            })
            res.json(response.data)
        }
    })
})



app.listen(3000)
console.log('Server on port 3000')