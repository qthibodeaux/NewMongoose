require('dotenv').config()
const express = require('express')
const app = express('')
const PORT = process.env.PORT

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const cors = require('cors')
const corsOptions = require('./config/corsOptions')

const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')

const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

connectDB()

app.use(credentials)
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser())

app.use('/auth', require('./routes/AuthRoute'))
app.use('/logout', require('./routes/logoutRoute'))
app.use('/refresh', require('./routes/refreshRoute'))

app.get("/", (req, res) => {
  res.send("Hello World QT!");
});

app.post('/asdf', (req, res) => {
  console.log(req.body)
  res.send("Hello QT")
})

app.post('/twi', (req,res) => {
  var body = `
  name: ${req.body.name}
  phone: ${req.body.phone}
  email: ${req.body.email}`
  console.log(body)
  client.messages
    .create({
      body: body,
      from: process.env.TWILIO_NUMBER,
      to: process.env.TWILIO_TO_NUMBER
    })
    .then(message => console.log(message.sid))
    .catch((err) => {console.log(err)})

    res.status(200).json({
      all: "good"
      })
})


app.use(verifyJWT)
app.use('/users', require('./routes/api/userRoute'))
app.use('/profile', require('./routes/api/postRoute'))

  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});