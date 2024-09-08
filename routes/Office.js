const express = require('express');
const router = express.Router();
// const { createLocation,getAllLocations } = require('../Controllers/Office'); // Adjust the path as needed
const {createOffice,getAllOffices,getOfficeById,getCheckedInEmployeesCount,getLocationAndDistance,checkInUser,checkOutUser,giveAllOfficesDashboard,getAllOfficesDetails, findOfficeByName} =require('../Controllers/Office');
const { authenticateToken } = require('../Controllers/Auth');

// Route to create a new Office
router.post('/createOffice', createOffice);

// Route to get all Office
router.get('/getAllOffices', getAllOffices);

// http://192.168.18.208:3000/api/office/66d96a4620494a783f0dfa1a


router.get('/getCheckedInEmployeesCount/:officeName',getCheckedInEmployeesCount);
router.post('/checkInUserOffice',authenticateToken, checkInUser);
router.post('/checkOutUserOffice',authenticateToken, checkOutUser);
router.get('/giveAllOfficesDashBoard', giveAllOfficesDashboard);
router.post('/findofficename',findOfficeByName);
router.get('/:id', getOfficeById);
// router.get('/getAllOfficesDetails', getAllOfficesDetails);
// router.get('/getLocationAndDistance', authenticateToken , getLocationAndDistance);

module.exports = router;

//should we write that
// no need just move to signuup controlled 
// no no auth controller -> exports.signup
