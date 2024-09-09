// const LiveState = require('../Models/LiveStats.js');
const LiveState = require('../models/LiveStats')
const User = require('../models/User'); 

// import LiveState from "../Models/LiveStats.js";

// Function to handle the recent data request
exports.recentData = async (req, res, next) => {
  try {
    const collec = await LiveState.findOne({ Date_of_rec: "29" });
    const total = collec?.Employ_checkedin;
    const numEmployee = total?.length || 0;
    const response = {
      totalEmp: numEmployee,
    };
    return res.json(response);
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};



exports.CheckedOUT = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the EmployeeId using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employeeId = user.EmployeeId;

    // Step 2: Get the current date
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    // Step 3: Remove the employee's check-in record
    await LiveState.findOneAndUpdate(
      { Date_of_rec: formattedDate },
      {
        $pull: { Employ_checkedin: { employeeId: employeeId } },
      }
    );

    console.log("Checked out employee and removed their record.");
    return res.json({ message: `Employee ${employeeId} checked out.` });
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};


// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const now = new Date();
//     // Format date as DDMMYYYY
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const year = now.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as HH:MM:SS
//     const timeString = now.toTimeString().split(' ')[0]; // Extract the time portion
//     const formattedTime = timeString;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Update or create check-in record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
//       if (existingCheckin) {
//         // Update the existing check-in time
//         await LiveState.updateOne(
//           { 'Date_of_rec': formattedDate, 'Employ_checkedin.employeeId': employeeId },
//           { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
//         );
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         await Today.updateOne({
//           $push: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } },
//         });
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: employeeId });
//   } catch (error) {
//     next(error); // Pass the error to the next middleware
//   }
// };


function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours}:${minutes} ${period}`;
}

// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const now = new Date();
    
//     // Convert to IST
//     // const offset = 40 * 60 * 60 * 1000; // IST is UTC+5:30
//     // const istDate = new Date(now.getTime() );
//     const isDate = new Date();
//     // const hour = isDate.getHour();
//     const hour = isDate.getHours();
//     const min = isDate.getMinutes();

//     // Format date as DDMMYYYY
//     const day = String(isDate.getDate()).padStart(2, '0');
//     const month = String(isDate.getMonth() + 1).padStart(2, '0');
//     const year = isDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as 'H:MM AM/PM' in IST
//     const formattedTime = `${hour}:${min}`;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Update or create check-in record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
//       if (existingCheckin) {
//         // Update the existing check-in time
//         await LiveState.updateOne(
//           { 'Date_of_rec': formattedDate, 'Employ_checkedin.employeeId': employeeId },
//           { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
//         );
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         await Today.updateOne({
//           $push: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } },
//         });
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: employeeId });
//   } catch (error) {
//     console.log("This is the error",error);
//     next(error); // Pass the error to the next middleware
//   }
// };

// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const isDate = new Date();
//     const hour = isDate.getHours();
//     const min = isDate.getMinutes();

//     // Format date as DDMMYYYY
//     const day = String(isDate.getDate()).padStart(2, '0');
//     const month = String(isDate.getMonth() + 1).padStart(2, '0');
//     const year = isDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as 'H:MM' in IST
//     const formattedTime = `${hour}:${min}`;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Update or create check-in record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       // Check if the employee is already checked in
//       const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);
//       if (existingCheckin) {
//         // Update the existing check-in time
//         existingCheckin.checkedInAt = formattedTime;
//         await Today.save();
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         Today.Employ_checkedin.push({ employeeId, checkedInAt: formattedTime });
//         await Today.save();
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: `Employee ${employeeId} checked in.` });
//   } catch (error) {
//     console.error("This is the error", error);
//     next(error); // Pass the error to the next middleware
//   }
// };



// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const isDate = new Date();
//     const hour = isDate.getHours();
//     const min = isDate.getMinutes();

//     // Format date as DDMMYYYY
//     const day = String(isDate.getDate()).padStart(2, '0');
//     const month = String(isDate.getMonth() + 1).padStart(2, '0');
//     const year = isDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as 'H:MM' in IST
//     const formattedTime = `${hour}:${min}`;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Find today's record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       // Check if the employee is already checked in
//       const employeeExists = Today.Employ_checkedin.some(checkin => checkin.employeeId === employeeId);

//       if (employeeExists) {
//         // Update the existing check-in time
//         await LiveState.updateOne(
//           { Date_of_rec: formattedDate, 'Employ_checkedin.employeeId': employeeId },
//           { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
//         );
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         await Today.updateOne({
//           $push: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } },
//         });
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: `Employee ${employeeId} checked in.` });
//   } catch (error) {
//     console.error("This is the error", error);
//     next(error); // Pass the error to the next middleware
//   }
// };


// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const isDate = new Date();
//     const hour = isDate.getHours();
//     const min = isDate.getMinutes();

//     // Format date as DDMMYYYY
//     const day = String(isDate.getDate()).padStart(2, '0');
//     const month = String(isDate.getMonth() + 1).padStart(2, '0');
//     const year = isDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as 'H:MM' in IST
//     const formattedTime = `${hour}:${min}`;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Find today's record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       // Check if the employee is already checked in
//       const employeeExists = Today.Employ_checkedin.some(checkin => checkin.employeeId === employeeId);

//       if (employeeExists) {
//         // Update the existing check-in time
//         await LiveState.updateOne(
//           { Date_of_rec: formattedDate, 'Employ_checkedin.employeeId': employeeId },
//           { $set: { 'Employ_checkedin.$.checkedInAt': formattedTime } }
//         );
//         console.log("Updated check-in time for the employee.");
//       } else {
//         // Add new check-in record with formatted time
//         await LiveState.updateOne(
//           { Date_of_rec: formattedDate },
//           { $addToSet: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } } }
//         );
//         console.log("Checked in employee with current time.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: `Employee ${employeeId} checked in.` });
//   } catch (error) {
//     console.error("This is the error", error);
//     next(error); // Pass the error to the next middleware
//   }
// };



// exports.CheckedIn = async (req, res, next) => {
//   try {
//     const userId = req.user.id;

//     // Step 1: Find the EmployeeId using the userId
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const employeeId = user.EmployeeId;

//     // Step 2: Get the current date and time in IST
//     const isDate = new Date();
//     const hour = isDate.getHours();
//     const min = isDate.getMinutes();

//     // Format date as DDMMYYYY
//     const day = String(isDate.getDate()).padStart(2, '0');
//     const month = String(isDate.getMonth() + 1).padStart(2, '0');
//     const year = isDate.getFullYear();
//     const formattedDate = `${day}${month}${year}`;

//     // Format time as 'H:MM' in IST
//     const formattedTime = `${hour}:${min}`;

//     console.log(`Current Time: ${formattedTime}`);
//     console.log(`Formatted Date: ${formattedDate}`);

//     // Step 3: Find today's record in LiveState
//     const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

//     if (Today) {
//       // Check if the employee is already checked in
//       const employeeExists = Today.Employ_checkedin.some(checkin => checkin.employeeId === employeeId);

//       if (!employeeExists) {
//         // If the employee does not exist, add new check-in record with formatted time
//         await LiveState.updateOne(
//           { Date_of_rec: formattedDate },
//           { $addToSet: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } } }
//         );
//         console.log("Checked in employee with current time.");
//       } else {
//         console.log("Employee is already checked in. No update made.");
//       }
//     } else {
//       // Create a new entry for the day if it doesn't exist
//       await LiveState.create({
//         Date_of_rec: formattedDate,
//         Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
//       });
//       console.log("Created new entry and checked in employee.");
//     }

//     return res.json({ message: `Employee ${employeeId} checked in.` });
//   } catch (error) {
//     console.error("This is the error", error);
//     next(error); // Pass the error to the next middleware
//   }
// };


const DEBOUNCE_TIME_MS = 30000; // 30 seconds debounce time

exports.CheckedIn = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Step 1: Find the EmployeeId using the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const employeeId = user.EmployeeId;

    // Step 2: Get the current date and time in IST
    const isDate = new Date();
    const hour = isDate.getHours();
    const min = isDate.getMinutes();

    // Format date as DDMMYYYY
    const day = String(isDate.getDate()).padStart(2, '0');
    const month = String(isDate.getMonth() + 1).padStart(2, '0');
    const year = isDate.getFullYear();
    const formattedDate = `${day}${month}${year}`;

    // Format time as 'H:MM' in IST
    const formattedTime = `${hour}:${min}`;

    console.log(`Current Time: ${formattedTime}`);
    console.log(`Formatted Date: ${formattedDate}`);

    // Step 3: Find today's record in LiveState
    const Today = await LiveState.findOne({ Date_of_rec: formattedDate });

    if (Today) {
      // Check if the employee is already checked in
      const existingCheckin = Today.Employ_checkedin.find(checkin => checkin.employeeId === employeeId);

      if (existingCheckin) {
        // Check the time difference since last check-in
        const lastCheckedInAt = new Date(`${formattedDate}T${existingCheckin.checkedInAt}:00`);
        const now = new Date();
        const timeDifference = now - lastCheckedInAt;

        if (timeDifference < DEBOUNCE_TIME_MS) {
          // If the last check-in was within the debounce time, do nothing
          console.log("Check-in request is within debounce period. No update made.");
          return res.status(429).json({ message: 'Frequent check-in requests are not allowed' });
        }

        // Update the existing check-in time if debounce period has passed
        existingCheckin.checkedInAt = formattedTime;
        await Today.save();
        console.log("Updated check-in time for the employee.");
      } else {
        // Add new check-in record with formatted time
        await LiveState.updateOne(
          { Date_of_rec: formattedDate },
          { $addToSet: { Employ_checkedin: { employeeId, checkedInAt: formattedTime } } }
        );
        console.log("Checked in employee with current time.");
      }
    } else {
      // Create a new entry for the day if it doesn't exist
      await LiveState.create({
        Date_of_rec: formattedDate,
        Employ_checkedin: [{ employeeId, checkedInAt: formattedTime }],
      });
      console.log("Created new entry and checked in employee.");
    }

    return res.json({ message: `Employee ${employeeId} checked in.` });
  } catch (error) {
    console.error("This is the error", error);
    next(error); // Pass the error to the next middleware
  }
};


// exports.getRecentlyCheckedInEmployees = async (req, res) => {
//   try {
//     // Generate today's date in the format "DDMMYYYY"
//     const today = new Date().toISOString().split('T')[0].split('-').reverse().join('');

//     // Find the live stat document for today's date
//     const liveStat = await LiveState.findOne({ Date_of_rec: today }).exec();

//     if (!liveStat) {
//       return res.status(404).json({ message: 'No check-in records found for today' });
//     }

//     // Get the last 6 employees from the Employ_checkedin array
//     const checkedInEmployees = liveStat.Employ_checkedin;
//     const recentEmployees = checkedInEmployees.slice(-6); // Get last 6 or fewer employees

//     // Retrieve additional user details
//     const employeeDetails = await Promise.all(recentEmployees.map(async (e) => {
//       const user = await User.findOne({ EmployeeId: e.employeeId }).exec();
//       return {
//         officeid: user.department,
//         office: user.office,
//         EmpName: user.name,
//         Time: e.checkedInAt
//       };
//     }));

//     // Respond with the details in the specified format
//     res.status(200).json({ transaction: employeeDetails });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// exports.getRecentlyCheckedInEmployees = async (req, res) => {
//   try {
//     // Generate today's date in the format "DDMMYYYY"
//     const today = new Date().toISOString().split('T')[0].split('-').reverse().join('');

//     // Find the live stat document for today's date
//     const liveStat = await LiveState.findOne({ Date_of_rec: today }).exec();

//     if (!liveStat) {
//       return res.status(404).json({ message: 'No check-in records found for today' });
//     }

//     // Get the checked-in employees
//     const checkedInEmployees = liveStat.Employ_checkedin;

//     // Filter out duplicate employees based on employeeId
//     const uniqueEmployees = [];
//     const seenEmployeeIds = new Set();

//     for (const e of checkedInEmployees.reverse()) { // Reverse to get recent entries first
//       if (!seenEmployeeIds.has(e.employeeId)) {
//         seenEmployeeIds.add(e.employeeId);
//         uniqueEmployees.push(e);
//       }
//     }

//     // Get the last 6 unique employees
//     const recentEmployees = uniqueEmployees.slice(0, 6);

//     // Retrieve additional user details
//     const employeeDetails = await Promise.all(recentEmployees.map(async (e) => {
//       const user = await User.findOne({ EmployeeId: e.employeeId }).exec();
//       return {
//         officeid: user.department,
//         office: user.office,
//         EmpName: user.name,
//         Time: e.checkedInAt
//       };
//     }));

//     // Respond with the details in the specified format
//     res.status(200).json({ transaction: employeeDetails });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };



// exports.getRecentlyCheckedInEmployees = async (req, res) => {
//   try {
//     // Generate today's date in the format "DDMMYYYY"
//     const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('');
//     console.log("today",today);
//     // Find the live stat document for today's date
//     const liveStat = await LiveState.findOne({ Date_of_rec: today }).exec();

//     if (!liveStat) {
//       return res.status(404).json({ message: 'No check-in records found for today' });
//     }

//     // Get the checked-in employees
//     const checkedInEmployees = liveStat.Employ_checkedin;

//     // Filter out duplicate employees based on employeeId
//     const uniqueEmployees = [];
//     const seenEmployeeIds = new Set();

//     for (const e of checkedInEmployees.reverse()) { // Reverse to get recent entries first
//       if (!seenEmployeeIds.has(e.employeeId)) {
//         seenEmployeeIds.add(e.employeeId);
//         uniqueEmployees.push(e);
//       }
//     }

//     // Get the last 6 unique employees
//     const recentEmployees = uniqueEmployees.slice(0, 6);

//     // Retrieve additional user details
//     const employeeDetails = await Promise.all(recentEmployees.map(async (e) => {
//       const user = await User.findOne({ EmployeeId: e.employeeId }).exec();
//       return {
//         officeid: user.department,
//         office: user.office,
//         EmpName: user.name,
//         Time: e.checkedInAt
//       };
//     }));

//     // Respond with the details in the specified format
//     res.status(200).json({ transaction: employeeDetails });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.getRecentlyCheckedInEmployees = async (req, res) => {
  try {
    // Generate today's date in the format "DDMMYYYY"
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    const formattedDate = `${day}${month}${year}`; // "DDMMYYYY" format
    // console.log(formattedDate);
    console.log("one done ",formattedDate);

    // Find the live stat document for today's date
    const liveStat = await LiveState.findOne({ Date_of_rec: formattedDate }).exec();
    console.log("two done ",liveStat);

    

    if (!liveStat) {
      return res.status(404).json({ message: 'No check-in records found for today' });
    }

    // Get the checked-in employees
    const checkedInEmployees = liveStat.Employ_checkedin;
    console.log("Three done",checkedInEmployees);

    // Filter out duplicate employees based on employeeId
    const uniqueEmployees = [];
    const seenEmployeeIds = new Set();

    for (const e of checkedInEmployees.reverse()) { // Reverse to get recent entries first
      if (!seenEmployeeIds.has(e.employeeId)) {
        seenEmployeeIds.add(e.employeeId);
        uniqueEmployees.push(e);
      }
    }

    // Get the last 6 unique employees
    const recentEmployees = uniqueEmployees.slice(0, 6);

    // Retrieve additional user details
    const employeeDetails = await Promise.all(recentEmployees.map(async (e) => {
      const user = await User.findOne({ EmployeeId: e.employeeId }).exec();
      return {
        officeid: user.department,
        office: user.office,
        EmpName: user.name,
        Time: e.checkedInAt
      };
    }));

    // Respond with the details in the specified format
    res.status(200).json({ transaction: employeeDetails });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
