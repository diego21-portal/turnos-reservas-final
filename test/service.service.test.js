import test from "node:test";
import assert from "node:assert/strict";
import { serviceService } from "../src/services/service.service.js";
import { serviceRepository } from "../src/repositories/service.repository.js";

function withRepositoryMocks(getPaginated, count, callback) {
  const originalGetPaginated = serviceRepository.getPaginated;
  const originalCount = serviceRepository.count;

  serviceRepository.getPaginated = getPaginated;
  serviceRepository.count = count;

  return Promise.resolve()
    .then(callback)
    .finally(() => {
      serviceRepository.getPaginated = originalGetPaginated;
      serviceRepository.count = originalCount;
    });
}

test(
  "category es exacta pero case-insensitive",
  async () => {
    let capturedFilter;

    await withRepositoryMocks(
      async ({ filter }) => {
        capturedFilter = filter;
        return [];
      },
      async () => 0,
      async () => {
        await serviceService.list({
          page: 1,
          limit: 10,
          category: "salud"
        });

        assert.ok(capturedFilter.category instanceof RegExp);
        assert.equal(capturedFilter.category.test("Salud"), true);
        assert.equal(capturedFilter.category.test("SALUD"), true);
        assert.equal(capturedFilter.category.test("salud"), true);
        assert.equal(capturedFilter.category.test("Salud Mental"), false);
      }
    );
  }
);

test(
  "list calcula paginación, filtros y ordenamiento",
  async () => {
    let capturedOptions;

    await withRepositoryMocks(
      async (options) => {
        capturedOptions = options;
        return [{ _id: "1" }];
      },
      async () => 21,
      async () => {
        const result = await serviceService.list({
          page: 2,
          limit: 5,
          available: true,
          minPrice: 1000,
          maxPrice: 20000,
          sort: "desc"
        });

        assert.equal(capturedOptions.skip, 5);
        assert.equal(capturedOptions.limit, 5);
        assert.equal(capturedOptions.filter.available, true);
        assert.deepEqual(capturedOptions.filter.price, {
          $gte: 1000,
          $lte: 20000
        });
        assert.equal(capturedOptions.sort.price, -1);

        assert.equal(result.totalDocs, 21);
        assert.equal(result.totalPages, 5);
        assert.equal(result.page, 2);
        assert.equal(result.hasPrevPage, true);
        assert.equal(result.hasNextPage, true);
        assert.equal(result.prevPage, 1);
        assert.equal(result.nextPage, 3);
      }
    );
  }
);
