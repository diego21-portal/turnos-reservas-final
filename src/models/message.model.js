import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

messageSchema.index({ createdAt: -1 });

export const MessageModel = mongoose.model(
  "Message",
  messageSchema
);
