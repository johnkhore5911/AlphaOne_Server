const mongoose = require("mongoose");
const InOutHistorySchema  = new mongoose.Schema({
  checkin: { type: String, required: true },
  checkout: { type: String, required: true }
});
const DailyHistorySchema  = new mongoose.Schema({
  id: { type: Number, required: true },
  workingHour: { type: String, required: true },
  workingMin: { type: String, required: true },
  date: { type: String, required: true },
  inOutHistory: [InOutHistorySchema]
});
const MonthlyHistorySchema = new mongoose.Schema({
  month: { type: String, required: true }, // e.g., 'January'
  days: [DailyHistorySchema]
});
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
  },
  EmployeeId: {
    type: String,
    required: [true, "Please enter a name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    // Mongoose's built-in validator for email format
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: [true, "Please select a gender"],
  },
  Address: {
    type: String,
    required: [true, "Please enter an address"],
  },
  OfficeId: {
    type: String,
    required: [true, "Please enter office location"],
  },
  departmentId: {
    type: String,
    required: [true, "Please enter Department"],
  },
  office: {
    type: String,
    required: [true, "Please enter office location"],
  },
  department: {
    type: String,
    required: [true, "Please enter Department"],
  },
  radius:{
    type:Number,
    required: true
  },
  history: [MonthlyHistorySchema],
  hybrid:{
    type:Boolean,
    required:true,
  },
  age: {
    type: Number,
    required: [true, "Please enter your age"],
  },
  checkedIN: {
    type: Boolean,
    default: false,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  OfficeLongitude:{
    type: Number,
  },
  OfficeLatitude:{
    type: Number,
  },


}, {
  timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);


// {
//   "id": 1,
//   "name": "Gaurav Patel",
//   "designation": "Team Lead",
//   "history": [
//     {
//       "month": "January",
//       "days": [
//         {
//           "id": 1,
//           "workingHour": "07",
//           "workingMin": "24",
//           "date": "1",
//           "inOutHistory": [
//             { "checkin": "07:00", "checkout": "16:29" },
//             { "checkin": "07:12", "checkout": "16:29" },
//             { "checkin": "07:12", "checkout": "16:29" }
//           ]
//         },
//         {
//           "id": 2,
//           "workingHour": "09",
//           "workingMin": "24",
//           "date": "2",
//           "inOutHistory": [
//             { "checkin": "07:12", "checkout": "16:29" },
//             { "checkin": "07:00", "checkout": "16:29" },
//             { "checkin": "07:12", "checkout": "16:29" }
//           ]
//         }
//       ]
//     },
//     {
//       "month": "February",
//       "days": [
//         {
//           "id": 1,
//           "workingHour": "09",
//           "workingMin": "24",
//           "date": "5",
//           "inOutHistory": [
//             { "checkin": "07:12", "checkout": "16:29" }
//           ]
//         }
//       ]
//     }
//   ]
// }
