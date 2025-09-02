//express
const express = require('express')
const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//cors 
const cors = require('cors')
app.use(cors())

//morgan
var morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//minified frontend 
app.use(express.static('dist'))

//mongoose
const mongoose = require('mongoose')
const password = process.argv[2]
const url = `mongodb+srv://raudikon:${password}@cluster0.20yxzms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` //collection named phonebook

mongoose.connect(url)
    .then(console.log("connexion established~~~~~~~~~~~~~~~~~~~~~"))
    .catch((error => console.log("connexion failed DDDDDDDDDDDDDDDDDDD:")))


const numberVal = (num) => {
    const twoLeading = /\d{2}-\d{6,}/
    const threeLeading = /\d{3}-\d{5,}/
    return (twoLeading.test(num) || threeLeading.test(num))
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true 
    },
    number: {
        type: String,
        validate: {
            validator: numberVal, 
            message: "Not valid number."
        },
        required: [true, 'Plz put user phone num']
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()  // add id
    delete returnedObject._id                            // remove _id
    delete returnedObject.__v                            // remove __v
  }
})
const Person = mongoose.model("Person", personSchema)

//Get all persons 
app.get('/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

//Add a person 
app.post('/persons', (request, response) => {
    const body = request.body 

    const indiv = new Person({
        name: body.name,
        number: body.number 
    })

    indiv.save()
    .then(
        savedPerson => {
            response.json(savedPerson)
        }
    )
    .catch(error => {
        const messages = Object.values(error.errors).map(e => e.message);
        response.status(400).json({ error: messages });
    })
}) 

//Get info: # people and request time 
app.get('/info', (request, response) => {
    let info = ""
    Person.countDocuments()
    .then(count =>{
        info = `Phonebook has info for ${count} people. Request made at `
        const myDate = new Date().toUTCString()
        response.json(info + myDate)
    })
})



//Get a single person's info
app.get('/persons/:id', (request, response) =>{
    const id = request.params.id
    console.log("cheeeyhofhsdifhosdf")
    console.log(request.params.id)
    console.log("cheeeyhofhsdifhosdf")
    Person.findById(id)
        .then(individual => {
            if(individual){
                response.send(individual)
            }else{
                response.status(404).end()
            }
        })
})

//Delete a single person 
app.delete('/persons/:id', (request, response) => {
    console.log("tryna delete person with id ", request.params.id)
    Person.findByIdAndDelete(request.params.id)
    .then(result => { 
        response.status(204).end()
    })
    .catch(error => console.log("weoops,... delete didn work :3"))

})

//Update a person 
app.put('/persons/:id', (request, response, next) =>{
    const {name, number} = request.body

    Person.findById(request.params.id)
    .then(indiv =>{
        if(!indiv){
            return response.status(404).end
        }

        indiv.name = name
        indiv.number = number 

        return indiv.save().then((newIndiv) =>{
            response.json(newIndiv)
        })
    })
    .catch(error => next(error))
   
})



