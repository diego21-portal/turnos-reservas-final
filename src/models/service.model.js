import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 60
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

serviceSchema.index({ category: 1, available: 1, price: 1 });
serviceSchema.index({ name: "text", description: "text" });

export const ServiceModel = mongoose.model("Service", serviceSchema);
