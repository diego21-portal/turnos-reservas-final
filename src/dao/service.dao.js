import { ServiceModel } from "../models/service.model.js";

class ServiceDAO {
  create(data) {
    return ServiceModel.create(data);
  }

  findById(id) {
    return ServiceModel.findById(id).lean();
  }

  findMany({ filter, skip, limit, sort }) {
    return ServiceModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  count(filter = {}) {
    return ServiceModel.countDocuments(filter);
  }

  updateById(id, data) {
    return ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    }).lean();
  }

  deleteById(id) {
    return ServiceModel.findByIdAndDelete(id).lean();
  }

  findExistingIds(ids) {
    return ServiceModel.find({ _id: { $in: ids } }).select("_id").lean();
  }
}

export const serviceDAO = new ServiceDAO();
