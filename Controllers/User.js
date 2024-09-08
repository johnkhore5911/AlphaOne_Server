const User = require('../models/User');
const moment = require('moment');

// Controller to update the checkedIN status of a user
exports.updateCheckedInStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.body; 

        if (typeof status !== 'boolean') {
            return res.status(400).json({ error: 'Status must be a boolean (true or false).' });
        }

        // Find the user by ID and update the checkedIN status
        const user = await User.findByIdAndUpdate(userId, { checkedIN: status }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({
            message: 'CheckedIN status updated successfully.',
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


exports.getGenderCounts = async (req, res) => {
    try {

      const maleCount = await User.countDocuments({ gender: 'Male' });
  

      const femaleCount = await User.countDocuments({ gender: 'Female' });
  
      
      res.status(200).json({ data: [femaleCount,maleCount] });
    } catch (error) {
      console.error('Error retrieving gender counts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };




exports.UserFetch = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from authenticated user
      const { checkin, checkout } = req.body;
  
      const currentMonth = moment().format('MMMM'); // Get current month name
      const currentDate = moment().date(); // Get current day of the month
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      
      let monthHistory = user.history.find(h => h.month === currentMonth);
      if (!monthHistory) {
        monthHistory = { month: currentMonth, days: [] };
        user.history.push(monthHistory);
      }
  
     
      let dayHistory = monthHistory.days.find(d => d.date == currentDate);
      if (!dayHistory) {
        const newDayId = monthHistory.days.length + 1;
        dayHistory = { id: newDayId, workingHour: "00", workingMin: "00", date: currentDate.toString(), inOutHistory: [] };
        monthHistory.days.push(dayHistory);
      }
  
      // Update inOutHistory
      const check = { checkin: checkin, checkout: checkout }
      dayHistory.inOutHistory.push(check);
  
      // Save the user document
      await user.save();
  
      res.json({ message: 'Check-in and Check-out updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers=async (req,res)=>{
  try{
    const users=await User.find({});
    res.json(users);
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Server error'});
  }
  
}