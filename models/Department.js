const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the department name"],
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office',
    required: true,
  },
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = Department;
