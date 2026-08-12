import mongoose from "mongoose";

const bookingServiceSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  {
    _id: false
  }
);

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    services: {
      type: [bookingServiceSchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

bookingSchema.index({ scheduledAt: 1, status: 1 });
bookingSchema.index({ "services.service": 1 });

export const BookingModel = mongoose.model("Booking", bookingSchema);
