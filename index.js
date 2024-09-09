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


//1. User 
app.use(`/api/v1`, user);

//2.Office 
app.use('/api/office', office);

//3. Department
app.use('/api/department', department);

//4. Livestats
app.use("/api/v1/admin",recentdataRoutes);

//5.Checkins
app.use('/api/checkins', checkinRoutes);



app.get('/', (req, res)=>{
    res.json('HELLO WORLD')
})

app.listen(3000, ()=>{
    console.log("Server is running on port: 3000");
})






