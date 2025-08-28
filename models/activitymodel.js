const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    ActivityName: {
      type: String,
      required: [true, 'Please enter activity name'],
    },

    Location: {
      type: String,
      required: [true, 'Please enter location'],
    },

    Date: {
      type: Date,
      required: [true, 'Please enter date'],
    },

    Time: {
      type: String,
      required: [true, 'Please enter time'],
      
    },

    Description: {
      type: String,
      required: [true, 'Please enter description'],
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
