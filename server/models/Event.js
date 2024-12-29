import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    timeBefore: {
      type: Number, 
      required: true,
    },
    methods: {
      type: [String], 
      default: ['email'],
    },
    isSent: {
      type: Boolean, 
      default: false,
    }
  },
  { _id: false }
);

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
      required: false,
    },
    itemType: {
      type: String,
      default: "event",
    },
    notifications: {
      type: [NotificationSchema], 
      default: [],
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
  next();
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
