import { serviceDAO } from "../dao/service.dao.js";

class ServiceRepository {
  create(data) {
    return serviceDAO.create(data);
  }

  getById(id) {
    return serviceDAO.findById(id);
  }

  getPaginated(options) {
    return serviceDAO.findMany(options);
  }

  count(filter) {
    return serviceDAO.count(filter);
  }

  update(id, data) {
    return serviceDAO.updateById(id, data);
  }

  delete(id) {
    return serviceDAO.deleteById(id);
  }

  async getExistingIdSet(ids) {
    const rows = await serviceDAO.findExistingIds(ids);
    return new Set(rows.map((row) => String(row._id)));
  }
}

export const serviceRepository = new ServiceRepository();
