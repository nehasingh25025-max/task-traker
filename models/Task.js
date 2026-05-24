const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    taskType: {
      type: String,
      enum: [
        "Text-to-Image",
        "Image Compare",
        "Prompt Writing",
        "Video Review",
        "Audio Review",
      ],
      default: "Text-to-Image",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Completed",
      ],
      default: "Pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Task",
  TaskSchema
);