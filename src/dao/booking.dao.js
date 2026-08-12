import { BookingModel } from "../models/booking.model.js";

const populateServices = {
  path: "services.service",
  select: "name description category price duration available"
};

class BookingDAO {
  create(data) {
    return BookingModel.create(data);
  }

  findById(id, { populate = false } = {}) {
    let query = BookingModel.findById(id);
    if (populate) query = query.populate(populateServices);
    return query.lean();
  }

  findMany({ filter = {}, skip = 0, limit = 10, populate = false }) {
    let query = BookingModel.find(filter)
      .sort({ scheduledAt: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (populate) query = query.populate(populateServices);
    return query.lean();
  }

  count(filter = {}) {
    return BookingModel.countDocuments(filter);
  }

  updateById(id, data, { populate = false } = {}) {
    let query = BookingModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (populate) query = query.populate(populateServices);
    return query.lean();
  }

  deleteById(id) {
    return BookingModel.findByIdAndDelete(id).lean();
  }

  addService(bookingId, serviceId, quantity) {
    return BookingModel.findOneAndUpdate(
      {
        _id: bookingId,
        "services.service": { $ne: serviceId }
      },
      {
        $push: {
          services: {
            service: serviceId,
            quantity
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate(populateServices)
      .lean();
  }

  updateServiceQuantity(bookingId, serviceId, quantity) {
    return BookingModel.findOneAndUpdate(
      {
        _id: bookingId,
        "services.service": serviceId
      },
      {
        $set: {
          "services.$.quantity": quantity
        }
      },
      {
        new: true,
        runValidators: true
      }
    )
      .populate(populateServices)
      .lean();
  }

  removeService(bookingId, serviceId) {
    return BookingModel.findByIdAndUpdate(
      bookingId,
      {
        $pull: {
          services: { service: serviceId }
        }
      },
      { new: true }
    )
      .populate(populateServices)
      .lean();
  }

  clearServices(bookingId) {
    return BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { services: [] } },
      { new: true }
    ).lean();
  }

  removeServiceFromAllBookings(serviceId) {
    return BookingModel.updateMany(
      { "services.service": serviceId },
      { $pull: { services: { service: serviceId } } }
    );
  }
}

export const bookingDAO = new BookingDAO();
