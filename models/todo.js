const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    due_date: {
      type: Date,
      required: true
    },
    status: {
      type: Boolean,
      required: true,
      default: false
    },
    category: {
      type: 'String',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Todo", todoSchema);
