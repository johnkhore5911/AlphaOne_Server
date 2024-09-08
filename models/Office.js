const mongoose = require('mongoose');

// i am writing here lets see if its working finely
// here we have to make a
const OfficeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the office name"],
    unique: true,
  },
  Address:{
    type: String,
    required: [true, "Please enter the address"],
  },
  latitude: {
    type: Number,
    required: [true, "Please enter the latitude"],
  },
  longitude: {
    type: Number,
    required: [true, "Please enter the longitude"],
  },
  distance:{
    type:Number,
    required: [true, "Please enter the office name"],
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  employees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  CheckedINemployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  //now move to controlle
}, {
  timestamps: true,
});

const Office = mongoose.model('Office', OfficeSchema);

module.exports = Office;
