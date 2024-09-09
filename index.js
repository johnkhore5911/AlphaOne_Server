const express = require('express');
const app = express();
const cors = require('cors')
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

const mongoose = require('mongoose');

// // Connect to MongoDB
mongoose.connect("mongodb+srv://johnkhore26:5iq8ltVcQg4DGMbQ@cluster0.khew0.mongodb.net/", {
})
.then(() => {
    console.log("Connection Successful");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

//route import and mount
const user = require("./routes/user");
const checkinRoutes = require('./routes/checkin')
const recentdataRoutes = require('./routes/LiveStats')
const department = require('./routes/Department')
const office = require('./routes/Office');
// const Location = require('./routes/Office')


//livestat
app.use("/api/v1/admin",recentdataRoutes);


// 
app.use(`/api/v1`, user);
app.use('/api/checkins', checkinRoutes);
app.use('/api/department', department);
app.use('/api/office', office); // check this later on 
// app.use('/api/Location', Location);

app.get('/', (req, res)=>{
    res.json('HELLO WORLD')
})

app.listen(3000, ()=>{
    console.log("Server is running on port:   https://localhost:3000 ");
})






