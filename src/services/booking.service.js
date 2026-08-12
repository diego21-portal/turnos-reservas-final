import { bookingRepository } from "../repositories/booking.repository.js";
import { serviceRepository } from "../repositories/service.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

function assertUniqueServiceIds(services) {
  const ids = services.map((item) => item.serviceId);
  if (new Set(ids).size !== ids.length) {
    throw new AppError(
      "Una reserva no puede contener el mismo servicio más de una vez",
      400
    );
  }
}

async function assertServicesExist(services) {
  if (services.length === 0) return;

  const ids = services.map((item) => item.serviceId);
  const existing = await serviceRepository.getExistingIdSet(ids);
  const missing = ids.filter((id) => !existing.has(id));

  if (missing.length > 0) {
    throw new AppError("Uno o más servicios no existen", 404, {
      missingServiceIds: missing
    });
  }
}

class BookingService {
  async create(data) {
    assertUniqueServiceIds(data.services);
    await assertServicesExist(data.services);

    const bookingData = {
      ...data,
      services: data.services.map((item) => ({
        service: item.serviceId,
        quantity: item.quantity
      }))
    };

    const created = await bookingRepository.create(bookingData);
    return bookingRepository.getById(created._id, { populate: true });
  }

  async getById(id, { populate = false } = {}) {
    const booking = await bookingRepository.getById(id, { populate });
    if (!booking) throw new AppError("Reserva no encontrada", 404);
    return booking;
  }

  async list(query) {
    const { page = 1, limit = 10, status, populate = false } = query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [payload, totalDocs] = await Promise.all([
      bookingRepository.getPaginated({
        filter,
        skip,
        limit,
        populate
      }),
      bookingRepository.count(filter)
    ]);

    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));

    return {
      payload,
      totalDocs,
      totalPages,
      page,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
  }

  async update(id, data) {
    await this.getById(id);
    const updated = await bookingRepository.update(id, data, { populate: true });
    if (!updated) throw new AppError("Reserva no encontrada", 404);
    return updated;
  }

  async delete(id) {
    await this.getById(id);
    const deleted = await bookingRepository.delete(id);
    if (!deleted) throw new AppError("Reserva no encontrada", 404);
    return deleted;
  }

  async addService(bookingId, serviceId, quantity) {
    const [booking, service] = await Promise.all([
      this.getById(bookingId),
      serviceRepository.getById(serviceId)
    ]);

    if (!service) throw new AppError("Servicio no encontrado", 404);

    const alreadyExists = booking.services.some(
      (item) => String(item.service) === serviceId
    );

    if (alreadyExists) {
      throw new AppError("El servicio ya está asociado a la reserva", 409);
    }

    const updated = await bookingRepository.addService(
      bookingId,
      serviceId,
      quantity
    );

    if (!updated) {
      throw new AppError(
        "No se pudo agregar el servicio; verifique que no esté duplicado",
        409
      );
    }

    return updated;
  }

  async updateServiceQuantity(bookingId, serviceId, quantity) {
    const booking = await this.getById(bookingId);
    const exists = booking.services.some(
      (item) => String(item.service) === serviceId
    );

    if (!exists) {
      throw new AppError("El servicio no está asociado a la reserva", 404);
    }

    const updated = await bookingRepository.updateServiceQuantity(
      bookingId,
      serviceId,
      quantity
    );

    if (!updated) {
      throw new AppError("No se pudo actualizar la cantidad", 404);
    }

    return updated;
  }

  async removeService(bookingId, serviceId) {
    const booking = await this.getById(bookingId);
    const exists = booking.services.some(
      (item) => String(item.service) === serviceId
    );

    if (!exists) {
      throw new AppError("El servicio no está asociado a la reserva", 404);
    }

    const updated = await bookingRepository.removeService(bookingId, serviceId);
    if (!updated) throw new AppError("Reserva no encontrada", 404);
    return updated;
  }

  async clearServices(bookingId) {
    await this.getById(bookingId);
    const updated = await bookingRepository.clearServices(bookingId);
    if (!updated) throw new AppError("Reserva no encontrada", 404);
    return updated;
  }
}

export const bookingService = new BookingService();
