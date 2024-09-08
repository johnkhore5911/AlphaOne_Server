// const Location = require('../models/Office'); // Adjust the path as needed

// // Create a new location
// exports.createLocation = async (req, res) => {
//   try {
//     const { name, latitude, longitude } = req.body;

//     // Check if all required fields are provided
//     if (!name || latitude === undefined || longitude === undefined) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all required fields (name, latitude, longitude).",
//       });
//     }

//     // Create a new location
//     const location = await Location.create({
//       name,
//       latitude,
//       longitude,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Location created successfully",
//       location,
//     });
//   } catch (error) {
//     console.error("Error creating location:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };

// // Get all locations
// exports.getAllLocations = async (req, res) => {
//   try {
//     const locations = await Location.find();
//     return res.status(200).json({
//       success: true,
//       locations,
//     });
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error. Please try again later.",
//     });
//   }
// };

// const Office = require('../models/Office');

// // Create a new Office
// exports.createOffice = async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Validate input
//     if (!name) {
//       return res.status(400).json({ message: "Office name is required" });
//     }

//     // Create the new Office
//     const newOffice = new Office({ name });

//     // Save the office to the database
//     const savedOffice = await newOffice.save();

//     res.status(201).json(savedOffice);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all Offices
// exports.getAllOffices = async (req, res) => {
//   try {
//     const offices = await Office.find().populate('departments');
//     res.status(200).json(offices);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get an Office by ID
// exports.getOfficeById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const office = await Office.findById(id).populate('departments');

//     if (!office) {
//       return res.status(404).json({ message: "Office not found" });
//     }

//     res.status(200).json(office);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const Office = require('../models/Office');

// Create a new Office
exports.createOffice = async (req, res) => {
  try {
    const { name,Address, distance, latitude, longitude } = req.body;

    // Validate input
    if (!name ||!Address|| latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, latitude, longitude).",
      });
    }

    // Create the new Office
    const newOffice = new Office({ name, Address,distance, latitude, longitude });

    // Save the office to the database
    const savedOffice = await newOffice.save();

    res.status(201).json({
      success: true,
      message: "Office created successfully",
      office: savedOffice,
    });
  } catch (error) {
    console.error("Error creating office:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all Offices
exports.getAllOffices = async (req, res) => {
  try {
    console.log("Get all offices");
    const offices = await Office.find().populate('departments');
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

exports.findOfficeByName = async (req, res) => {
  try {
    const officeName = req.body;
    console.log(`officeName ${officeName.name}`);
    console.log("findOfficeByName");

    const office = await Office.findOne({ name: officeName.name });
    if (!office) {

      console.log("!office wala section");
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.status(200).json({
      success: true,
      name: office.name,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};


// Get an Office by ID
exports.getOfficeById = async (req, res) => {
  try {
    const { id } = req.params;
    const office = await Office.findById(id).populate('departments');

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found",
      });
    }

    res.status(200).json({
      success: true,
      office,
    });
  } catch (error) {
    console.error("Error fetching office:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later......",
    });
  }
};

// const Office = require('../models/Office'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary

// Controller to get the count of checked-in employees for a particular office
exports.getCheckedInEmployeesCount = async (req, res) => {
    try {
        const { officeName } = req.params; // Get the office name from request parameters

        // Find the office by its name and populate the employees
        const office = await Office.findOne({ name: officeName }).populate('employees');

        if (!office) {
            return res.status(404).json({ error: 'Office not found.' });
        }

        // Filter the employees who are checked in
        const checkedInEmployees = office.employees.filter(employee => employee.checkedIN);

        // Return the count of checked-in employees
        res.status(200).json({
            office: office.name,
            checkedInCount: checkedInEmployees.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


exports.getLocationAndDistance = async (req, res) => {
  try {
      // 1. Get the user by ID
      const user = await User.findById(req.user.id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // 2. Get the Office ID from the User
      const officeId = user.OfficeId;

      // 3. Find the Office using the Office ID
      const office = await Office.findById(officeId);
      if (!office) {
          return res.status(404).json({ message: 'Office not found' });
      }

      // 4. Extract latitude, longitude, and distance from the Office document
      const { latitude, longitude, distance } = office;

      // 5. Return the data in the response
      return res.status(200).json({
          latitude,
          longitude,
          distance,
      });
  } catch (error) {
      console.error('Error fetching location and distance:', error);
      return res.status(500).json({ message: 'Server error' });
  }
};


//add checkedInEmployee
// exports.checkInUser = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the userId from the request (assuming userId is set in req.user)
    
//     // Find the user to get their OfficeId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const officeId = user.OfficeId; // Get the OfficeId from the user document

//     // Find the office and add the user to the CheckedINemployees array
//     const office = await Office.findById(officeId);

//     if (!office) {
//       return res.status(404).json({ message: 'Office not found' });
//     }

//     // Check if the user is already checked in
//     if (office.CheckedINemployees.includes(userId)) {
//       return res.status(400).json({ message: 'User is already checked in' });
//     }

//     // Add userId to CheckedINemployees array
//     office.CheckedINemployees.push(userId);
//     await office.save();

//     // Update the User document to set checkedIN to true
//     user.checkedIN = true;
//     await user.save();

//     res.status(200).json({ message: 'User checked in successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// exports.checkInUser = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the userId from the request (assuming userId is set in req.user)
    
//     // Find the user to get their OfficeId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const officeId = user.OfficeId; // Get the OfficeId from the user document

//     // Find the office and add the user to the CheckedINemployees array
//     const office = await Office.findById(officeId);

//     if (!office) {
//       return res.status(404).json({ message: 'Office not found' });
//     }

//     // Convert CheckedINemployees to a Set for efficient checking
//     const checkedInSet = new Set(office.CheckedINemployees);

//     // Check if the user is already checked in
//     if (checkedInSet.has(userId)) {
//       return res.status(400).json({ message: 'User is already checked in' });
//     }

//     // Add userId to the Set and convert back to an array
//     checkedInSet.add(userId);
//     office.CheckedINemployees = Array.from(checkedInSet);
//     await office.save();

//     // Update the User document to set checkedIN to true
//     user.checkedIN = true;
//     await user.save();

//     res.status(200).json({ message: 'User checked in successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.checkInUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get the userId from the request (assuming userId is set in req.user)
    
    // Find the user to get their OfficeId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const officeId = user.OfficeId; // Get the OfficeId from the user document

    // Find the office and add the user to the CheckedINemployees array
    const office = await Office.findById(officeId);

    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    // Check if the user is already checked in using the Set
    if (office.CheckedINemployees.includes(userId)) {
      return res.status(200).json({ message: 'User is already checked in' });
    }

    // Add userId to CheckedINemployees array only if it doesn't exist
    office.CheckedINemployees.push(userId);
    await office.save();

    // Update the User document to set checkedIN to true
    user.checkedIN = true;
    await user.save();

    res.status(200).json({ message: 'User checked in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.checkOutUser = async (req, res) => {
  try {
    const userId = req.user.id; // Get the userId from the request (assuming userId is set in req.user)
    
    // Find the user to get their OfficeId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const officeId = user.OfficeId; // Get the OfficeId from the user document

    // Find the office and remove the user from the CheckedINemployees array
    const office = await Office.findById(officeId);

    if (!office) {
      return res.status(404).json({ message: 'Office not found' });
    }

    // Check if the user is currently checked in
    if (!office.CheckedINemployees.includes(userId)) {
      return res.status(200).json({ message: 'User is not checked in' });
    }

    // Remove userId from CheckedINemployees array
    office.CheckedINemployees.pull(userId); // Using Mongoose's pull method
    await office.save();

    // Update the User document to set checkedIN to false
    user.checkedIN = false;
    await user.save();

    res.status(200).json({ message: 'User checked out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//give me all the offices
exports.giveAllOfficesDashboard = async (req, res) => {
  try{
    // // Retrieve all office documents from the database
    // const offices = await Office.find();

    // // Return the list of offices in the response
    // res.status(200).json(offices); 
        // Retrieve all office documents from the database
        const offices = await Office.find();

        // Transform the data into the desired format
        const transformedOffices = offices.map(office => {
          const totalEmployees = office.employees.length;
          const checkedInEmployees = office.CheckedINemployees.length;
    
          // Calculate percentage of checked-in employees
          const percentCheckedIn = totalEmployees > 0 ? (checkedInEmployees / totalEmployees) * 100 : 0;
    
          return {
            OfficeName: office.name,
            percents: Math.round(percentCheckedIn), // Rounded percentage
            employees_checkedIn: checkedInEmployees
          };
        });
    
        // Format the final response
        const response = {
          emp: transformedOffices
        };
    
        // Return the formatted data in the response
        res.status(200).json(response);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}



exports.getAllOfficesDetails = async(req,res) =>{
  try{
    const offices = await Office.find();
      res.status(200).json(offices);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getAllOfficesDetails = async (req, res) => {
  try {
    const offices = await Office.find().populate('departments').populate('employees').populate('CheckedINemployees');
    res.status(200).json(offices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};