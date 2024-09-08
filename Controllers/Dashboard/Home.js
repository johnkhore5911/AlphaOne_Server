const Office = require('../models/Office');


exports.getAverageWorkingHours = async (req, res) => {
    try {
      console.log("Get all offices");
      const offices = await Office.find().populate('departments');
      const averageWorkingHours=offices.map(office=>{
         return office.employees
      })
      res.status(200).json({
        success: true,
        offices,
      });
    } catch (error) {
      console.error("Error fetching offices:", error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  };
  