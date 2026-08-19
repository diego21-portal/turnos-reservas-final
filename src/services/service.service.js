import { bookingRepository } from "../repositories/booking.repository.js";
import { serviceRepository } from "../repositories/service.repository.js";
import { AppError } from "../middlewares/error.middleware.js";

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

class ServiceService {
  async create(data) {
    return serviceRepository.create(data);
  }

  async getById(id) {
    const service = await serviceRepository.getById(id);
    if (!service) throw new AppError("Servicio no encontrado", 404);
    return service;
  }

  async list(query) {
    const {
      page = 1,
      limit = 10,
      category,
      available,
      minPrice,
      maxPrice,
      sort,
      search
    } = query;

    const filter = {};

    // Coincidencia exacta por categoría, pero sin distinguir mayúsculas.
    // "salud", "Salud" y "SALUD" encuentran la misma categoría.
    if (category) {
      filter.category = new RegExp(
        `^${escapeRegex(category)}$`,
        "i"
      );
    }

    if (available !== undefined) {
      filter.available = available;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const sortOption = sort
      ? { price: sort === "asc" ? 1 : -1, createdAt: -1 }
      : { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [payload, totalDocs] = await Promise.all([
      serviceRepository.getPaginated({
        filter,
        skip,
        limit,
        sort: sortOption
      }),
      serviceRepository.count(filter)
    ]);

    const totalPages = Math.max(
      1,
      Math.ceil(totalDocs / limit)
    );

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
    const updated = await serviceRepository.update(id, data);

    if (!updated) {
      throw new AppError("Servicio no encontrado", 404);
    }

    return updated;
  }

  async delete(id) {
    await this.getById(id);

    // Mantiene integridad referencial: al eliminar un servicio se retira
    // la referencia de todas las reservas que lo contengan.
    await bookingRepository.removeServiceFromAllBookings(id);

    const deleted = await serviceRepository.delete(id);

    if (!deleted) {
      throw new AppError("Servicio no encontrado", 404);
    }

    return deleted;
  }
}

export const serviceService = new ServiceService();
