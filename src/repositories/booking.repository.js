import { bookingDAO } from "../dao/booking.dao.js";

class BookingRepository {
  create(data) {
    return bookingDAO.create(data);
  }

  getById(id, options) {
    return bookingDAO.findById(id, options);
  }

  getPaginated(options) {
    return bookingDAO.findMany(options);
  }

  count(filter) {
    return bookingDAO.count(filter);
  }

  update(id, data, options) {
    return bookingDAO.updateById(id, data, options);
  }

  delete(id) {
    return bookingDAO.deleteById(id);
  }

  addService(bookingId, serviceId, quantity) {
    return bookingDAO.addService(bookingId, serviceId, quantity);
  }

  updateServiceQuantity(bookingId, serviceId, quantity) {
    return bookingDAO.updateServiceQuantity(bookingId, serviceId, quantity);
  }

  removeService(bookingId, serviceId) {
    return bookingDAO.removeService(bookingId, serviceId);
  }

  clearServices(bookingId) {
    return bookingDAO.clearServices(bookingId);
  }

  removeServiceFromAllBookings(serviceId) {
    return bookingDAO.removeServiceFromAllBookings(serviceId);
  }
}

export const bookingRepository = new BookingRepository();
