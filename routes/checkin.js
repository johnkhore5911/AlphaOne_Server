const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {


// const authenticateToken = (req, res, next) => {
//     // authorization -> check if i have to write capital letters or not
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);
  
//     jwt.verify(token, 'your_jwt_secret', (err, user) => {
//       if (err) return res.sendStatus(403);
//       req.user = user;
//       next();
//     });
// };

const authenticateToken = async (req, res, next) => {
    try{
        //extract token
        // const token = req.cookies.token 
        //                 || req.body.token 
        //                 || req.header("Authorisation").replace("Bearer ", "");
        
        const token = req.header("Authorization").replace("Bearer ", "");

        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, 'john');
            req.user = decode;
            console.log("decoding the token: " , req.user.id);
            // console.log(req.user.id);
        }
        catch(err) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token invalid hai (while checkin)',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }
}

// router.post('/checkin', authenticateToken, async (req, res) => {
//     const { latitude, longitude, status } = req.body;
//     try {
// 		const id = req.user.id;
//       const newCheckin = new Checkin({
//         // userId: req.user.userId,
//         userId: id,
//         latitude,
//         longitude,
//         status
//       });
//       await newCheckin.save();
//       res.status(201).send('Check-in recorded');
//     } catch (error) {
//       res.status(400).send('Error recording check-in');
//     }
//   });

// router.post('/checkin', authenticateToken, async (req, res) => {
//     const { latitude, longitude, status,totalWorkingHours } = req.body;
//     try {
//       const checkin = await Checkin.findOne({ userId: req.user.id });
//       if (!checkin) {
//           // If no checkin exists for the user, create a new one
//           const newCheckin = new Checkin({
//               userId: req.user.id,
//               checkins: [{ status, latitude, longitude }],
//               totalWorkingHours:totalWorkingHours
//           });
//           await newCheckin.save();
//           res.status(201).send('Check-in recorded');
//       } else {
//           // If a checkin already exists, add the new checkin to the array
//           checkin.checkins.push({ status, latitude, longitude });
//           await checkin.save();
//           res.status(201).send('Check-in recorded');
//       }
//     } catch (error) {
//       res.status(400).send('Error recording check-in');
//     }
// });


// Helper function to format milliseconds into "HH:MM:SS"
function formatDuration(milliseconds) {
    let totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Route for check-in/check-out
// router.post('/checkin', authenticateToken, async (req, res) => {
//     const { latitude, longitude, status } = req.body;

//     try {
//         let checkin = await Checkin.findOne({ userId: req.user.id });

//         if (!checkin) {
//             // If no checkin exists for the user, create a new one
//             const newCheckin = new Checkin({
//                 userId: req.user.id,
//                 checkins: [{ status, latitude, longitude }],
//                 totalWorkingHours: "00:00:00" // Initialize to 0
//             });
//             await newCheckin.save();
//             res.status(201).send('Check-in recorded');
//         } else {
//             checkin.checkins.push({ status, latitude, longitude });

//             if (status === 'Checked out' && checkin.checkins.length >= 2) {
//                 let totalMilliseconds = 0;

//                 for (let i = 0; i < checkin.checkins.length - 1; i += 2) {
//                     const checkinRecord = checkin.checkins[i];
//                     const checkoutRecord = checkin.checkins[i + 1];

//                     if (checkinRecord.status === 'Checked in' && checkoutRecord.status === 'Checked out') {
//                         totalMilliseconds += new Date(checkoutRecord.timestamp) - new Date(checkinRecord.timestamp);
//                     }
//                 }

//                 checkin.totalWorkingHours = formatDuration(totalMilliseconds);
//             }

//             await checkin.save();
//             res.status(201).send('Check-in recorded');
//         }
//     } catch (error) {
//         console.error('Error recording check-in:', error);
//         res.status(400).send('Error recording check-in');
//     }
// });

const { DateTime } = require('luxon');

// Function to convert time to 12-hour format
function get12HourTime() {
    const currentTimeInIST = DateTime.now().setZone('Asia/Kolkata');
    return currentTimeInIST.toFormat('hh:mm a'); // 12-hour format with AM/PM
}



router.post('/checkin',authenticateToken,  async (req, res) => {
    const { latitude, longitude, status,checkInAt} = req.body;

    try {
        let checkin = await Checkin.findOne({ userId: req.user.id });
        const timeIn12HourFormat = get12HourTime();
        if (!checkin) {
            console.log("This user is checkin");
            // If no checkin exists for the user, create a new one
            const newCheckin = new Checkin({
                userId: req.user.id,
                checkins: [{ status, latitude, longitude, timestamp: timeIn12HourFormat }],
                totalWorkingHours: "00:00:00" // Initialize to 0
            });
            await newCheckin.save();
            res.status(201).send('Check-in recorded');
        } else {
            checkin.checkins.push({ status, latitude, longitude, timestamp:timeIn12HourFormat });

            if (checkin.checkins.length > 1) {
                let totalMilliseconds = 0;
                let lastCheckIn = null;

                for (let i = 0; i < checkin.checkins.length; i++) {
                    const record = checkin.checkins[i];

                    if (record.status === 'Checked in') {
                        lastCheckIn = record;
                    } else if (record.status === 'Checked out' && lastCheckIn) {
                        totalMilliseconds += new Date(record.timestamp) - new Date(lastCheckIn.timestamp);
                        lastCheckIn = null; // Reset last check-in after pairing with check-out
                    }
                }

                checkin.totalWorkingHours = formatDuration(totalMilliseconds);
            }

            await checkin.save();
            res.status(201).send('Check-in recorded');
        }
    } catch (error) {
        console.error('Error recording check-in:', error);
        res.status(400).send('Error recording check-in');
    }
});


module.exports = router;

router.get('/checkins', authenticateToken, async (req, res) => {
    try {
        // Find the check-ins for the authenticated user
        const checkin = await Checkin.findOne({ userId: req.user.id });
        
        if (!checkin) {
            return res.status(404).json({
                success: false,
                message: 'No check-ins found for this user',
            });
        }

        res.status(200).json({
            success: true,
            checkins: checkin.checkins,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving check-ins',
        });
    }
});


// Route to fetch total working hours for a user
router.get('/working-hours', authenticateToken, async (req, res) => {
    try {
        const checkin = await Checkin.findOne({ userId: req.user.id });

        if (!checkin) {
            return res.status(404).send('No check-in records found for this user');
        }

        res.status(200).json({ totalWorkingHours: checkin.totalWorkingHours });
    } catch (error) {
        console.error('Error fetching total working hours:', error);
        res.status(500).send('Error fetching total working hours');
    }
});




module.exports = router;