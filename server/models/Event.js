import mongoose from "mongoose";
const { Schema } = mongoose;

const ExtendedPropsSchema = new Schema(
  {
    location: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    timeZone: {
      type: String,
      default: "",
    },
    recurrenceType: {
      type: String,
      enum: ["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"],
      default: null,
    },
    itemType: {
      type: String,
      default: "event",
    },
    isPomodoro: {
      type: Boolean,
      default: false, 
    },
    pomodoroSettings: {
      studyTime: {
        type: Number, 
        required: function () {
          return this.isPomodoro;
        },
        default: null,
      },
      breakTime: {
        type: Number, 
        required: function () {
          return this.isPomodoro;
        },
        default: null,
      },
      cycles: {
        type: Number, 
        required: function () {
          return this.isPomodoro;
        },
        default: null,
      },
      completedCycles: {
        type: Number, 
        required: function () {
          return this.isPomodoro;
        },
        default: null,
      },
    },
  },
  { _id: false }
);

const eventSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => require("uuid").v4(),
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    rrule: {
      type: String,
      default: null,
    },
    duration: {
      type: String,
      default: "01:00",
    },
    extendedProps: {
      type: ExtendedPropsSchema,
      required: true,
    },
    exdate: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre("save", function (next) {
  if (!this.rrule && this.extendedProps.recurrenceType) {
    this.extendedProps.recurrenceType = undefined;
  }

  if (this.extendedProps.isPomodoro) { //forse si può togliere
    this.end = this.start; 
  }

  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
