const Department = require('../models/Department');
const Office = require('../models/Office');

// Create a new Department
exports.createDepartment = async (req, res) => {
  try {
    const { name, officeName } = req.body;

    // Validate input
    if (!name || !officeName) {
      return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    // Find the office by name
    const office = await Office.findOne({ name: officeName });

    if (!office) {
      return res.status(404).json({ success: false, message: "Office not found" });
    }

    // Create the new Department with default values for latitude and longitude
    const newDepartment = new Department({
      name,
      office: office._id,
    });

    // Save the department to the database
    const savedDepartment = await newDepartment.save();

    // Add department to the office's departments array
    office.departments.push(savedDepartment._id);
    await office.save();

    res.status(201).json({ success: true, department: savedDepartment });
  } catch (error) {
    console.error('Error creating department:', error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// Get all Departments for a specific Office
exports.getDepartmentsByOffice = async (req, res) => {
  try {
    const { officeName } = req.params;

    // Find the office by name and populate departments
    const office = await Office.findOne({ name: officeName }).populate('departments');

    if (!office) {
      return res.status(404).json({ success: false, message: "Office not found" });
    }

    res.status(200).json({ success: true, departments: office.departments });
  } catch (error) {
    console.error('Error fetching departments:', error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};



const User = require('../models/User'); 

// Controller to get the count of checked-in employees for a particular department within an office
exports.getCheckedInEmployeesCountByDepartment = async (req, res) => {
    try {
        const { officeName, departmentName } = req.params; // Get the office and department names from request parameters

        // Find the office by its name
        const office = await Office.findOne({ name: officeName });

        if (!office) {
            return res.status(404).json({ error: 'Office not found.' });
        }

        // Find the department by its name and office
        const department = await Department.findOne({ name: departmentName, office: office._id }).populate('employees');

        if (!department) {
            return res.status(404).json({ error: 'Department not found in the specified office.' });
        }

        // Filter the employees who are checked in
        const checkedInEmployees = department.employees.filter(employee => employee.checkedIN);

        // Return the count of checked-in employees
        res.status(200).json({
            office: office.name,
            department: department.name,
            checkedInCount: checkedInEmployees.length
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};


// exports.DeparmentStatus = async (req, res) => {
//   try {
//     const { deptId } = req.params;

//     // Find the department and populate the employees field
//     const department = await Department.findById(deptId).populate({
//       path: 'employees',
//       select: 'EmployeeId name checkedIN', // Only select the fields you need
//     });

//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     // Respond with the employee data
//     res.json({
//       departmentName: department.name,
//       employees: department.employees.map(employee => ({
//         id: employee._id,
//         employeeId: employee.EmployeeId,
//         name: employee.name,
//         checkedIN: employee.checkedIN,
//       })),
//     });
//   } catch (error) {
//     console.error('Error fetching employee details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.DeparmentStatus = async (req, res) => {
//   try {
//     const { deptId } = req.params;

//     // Find the department and populate the employees field
//     const department = await Department.findById(deptId).populate({
//       path: 'employees',
//       select: 'EmployeeId name checkedIN', // Select only the necessary fields
//     });

//     if (!department) {
//       return res.status(404).json({ message: 'Department not found' });
//     }

//     // Respond with the employee data
//     res.json({
//       departmentName: department.name,
//       employees: department.employees.map(employee => ({
//         id: employee._id,
//         employeeId: employee.EmployeeId,
//         name: employee.name,
//         checkedIN: employee.checkedIN,
//       })),
//     });
//   } catch (error) {
//     console.error('Error fetching employee details:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.DeparmentStatus = async (req, res) => {
  try {
    const { deptId } = req.params;

    // Find the department and populate the employees field
    const department = await Department.findById(deptId).populate({
      path: 'employees',
      select: 'EmployeeId name checkedIN', // Select only the necessary fields
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Respond with the formatted employee data
    res.json({
      Dept: department.employees.map(employee => ({
        deptid: deptId, // Use the department ID
        Department: department.name, // Use the department name
        EmpId: employee.EmployeeId,
        EmpName: employee.name,
        checkedIN: employee.checkedIN,
      })),
    });
  } catch (error) {
    console.error('Error fetching employee details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};