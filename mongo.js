const mongoose = require('mongoose')

//Missing password
if (process.argv.length < 3){ 
   console.log("Provide password pls")
   process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://raudikon:${password}@cluster0.20yxzms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` //collection named phonebook

mongoose.connect(url).then(console.log("connexion established~~"))


//Person schema and model
const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})
const Person = mongoose.model('Person', personSchema)


//Route for displaying all numbers.
if (process.argv.length === 3){

    Person.find({}).then(
        result => {result.forEach(
            (person) => console.log(person)
        ), mongoose.connection.close()})

}

//Route for adding a number 
if (process.argv.length === 5){

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log("Added ", person.name, " number ", person.number, " to phonebook!~")
        mongoose.connection.close()
    })

}
