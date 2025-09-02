//saved from exc 3.9
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Get all persons
app.get('/persons', (request, response) => {
  response.json(persons)
})

// //Get info: # people and request time 
// app.get('/info', (request, response) => {
//     const myResponse = 
//     `Phonebook has info for ${persons.length} people. Request made at `
//     const myDate = new Date().toUTCString(); 
//     response.json(myResponse + myDate)
// })

// //Get a single person's info
// app.get('/persons/:id', (request, response) =>{
//     const id = request.params.id
//     const individual = persons.find(indiv => indiv.id === id)

//     if(individual){
//         response.json(individual)
//     }else{
//         response.status(404).end()
//     }
// })

//Delete a single person 
app.delete('/persons/:id', (request, response)=>{
    const id = request.params.id
    persons = persons.filter(person => person.id !== id.toString())
    response.status(204).end()
})

//Add a person 
app.post('/persons', (request, response) => {
    const body = request.body
    
    if(!body.name){
        return response.status(400).json({
            error: 'Missing person name.'
        })
    }
    if(!body.number){
        return response.status(400).json({
            error: 'Missing person number.'
        })
    }
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({
            error: 'Person already exists!'
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: (Math.floor(Math.random() * 100)).toString()
    }

    persons = persons.concat(newPerson)
    response.json(newPerson)
    
})


lsdnfsnfndslk

//Delete a person 
app.delete('/persons/:id', (request, response) => {
    console.log("tryna delete person with id ", request.params.id)
    Person.findByIdAndDelete(request.params.id)
    .then(result => { 
        response.status(204).end()
    })
    .catch(error => console.log("weoops,... delete didn work :3"))

})

