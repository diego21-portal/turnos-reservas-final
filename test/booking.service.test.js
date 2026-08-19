import test from "node:test";
import assert from "node:assert/strict";
import { bookingService } from "../src/services/booking.service.js";
import { bookingRepository } from "../src/repositories/booking.repository.js";
import { serviceRepository } from "../src/repositories/service.repository.js";

const BOOKING_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
const SERVICE_ID = "bbbbbbbbbbbbbbbbbbbbbbbb";

function withPatchedMethods(patches, callback) {
  const originals = patches.map(({ target, method }) => ({
    target,
    method,
    value: target[method]
  }));

  for (const { target, method, value } of patches) {
    target[method] = value;
  }

  return Promise.resolve()
    .then(callback)
    .finally(() => {
      for (const original of originals) {
        original.target[original.method] = original.value;
      }
    });
}

test(
  "addService agrega el servicio con quantity cuando todavía no existe",
  async () => {
    let addCalled = false;

    await withPatchedMethods(
      [
        {
          target: bookingRepository,
          method: "getById",
          value: async () => ({
            _id: BOOKING_ID,
            services: []
          })
        },
        {
          target: serviceRepository,
          method: "getById",
          value: async () => ({
            _id: SERVICE_ID,
            name: "Servicio prueba"
          })
        },
        {
          target: bookingRepository,
          method: "addService",
          value: async (bookingId, serviceId, quantity) => {
            addCalled = true;
            assert.equal(bookingId, BOOKING_ID);
            assert.equal(serviceId, SERVICE_ID);
            assert.equal(quantity, 2);

            return {
              _id: BOOKING_ID,
              services: [
                {
                  service: SERVICE_ID,
                  quantity: 2
                }
              ]
            };
          }
        }
      ],
      async () => {
        const result = await bookingService.addService(
          BOOKING_ID,
          SERVICE_ID,
          2
        );

        assert.equal(addCalled, true);
        assert.equal(result.services.length, 1);
        assert.equal(result.services[0].quantity, 2);
      }
    );
  }
);

test(
  "addService incrementa quantity y no duplica el mismo servicio",
  async () => {
    let addCalled = false;
    let updateCalled = false;

    await withPatchedMethods(
      [
        {
          target: bookingRepository,
          method: "getById",
          value: async () => ({
            _id: BOOKING_ID,
            services: [
              {
                service: SERVICE_ID,
                quantity: 2
              }
            ]
          })
        },
        {
          target: serviceRepository,
          method: "getById",
          value: async () => ({
            _id: SERVICE_ID
          })
        },
        {
          target: bookingRepository,
          method: "addService",
          value: async () => {
            addCalled = true;
            return null;
          }
        },
        {
          target: bookingRepository,
          method: "updateServiceQuantity",
          value: async (bookingId, serviceId, quantity) => {
            updateCalled = true;
            assert.equal(bookingId, BOOKING_ID);
            assert.equal(serviceId, SERVICE_ID);
            assert.equal(quantity, 3);

            return {
              _id: BOOKING_ID,
              services: [
                {
                  service: SERVICE_ID,
                  quantity
                }
              ]
            };
          }
        }
      ],
      async () => {
        const result = await bookingService.addService(
          BOOKING_ID,
          SERVICE_ID,
          1
        );

        assert.equal(addCalled, false);
        assert.equal(updateCalled, true);
        assert.equal(result.services.length, 1);
        assert.equal(result.services[0].quantity, 3);
      }
    );
  }
);

test(
  "addService rechaza una cantidad acumulada superior a 100",
  async () => {
    await withPatchedMethods(
      [
        {
          target: bookingRepository,
          method: "getById",
          value: async () => ({
            _id: BOOKING_ID,
            services: [
              {
                service: SERVICE_ID,
                quantity: 99
              }
            ]
          })
        },
        {
          target: serviceRepository,
          method: "getById",
          value: async () => ({
            _id: SERVICE_ID
          })
        }
      ],
      async () => {
        await assert.rejects(
          () =>
            bookingService.addService(
              BOOKING_ID,
              SERVICE_ID,
              2
            ),
          (error) => {
            assert.equal(error.statusCode, 400);
            assert.match(error.message, /no puede superar 100/i);
            return true;
          }
        );
      }
    );
  }
);

test(
  "addService devuelve 404 si el servicio no existe",
  async () => {
    await withPatchedMethods(
      [
        {
          target: bookingRepository,
          method: "getById",
          value: async () => ({
            _id: BOOKING_ID,
            services: []
          })
        },
        {
          target: serviceRepository,
          method: "getById",
          value: async () => null
        }
      ],
      async () => {
        await assert.rejects(
          () =>
            bookingService.addService(
              BOOKING_ID,
              SERVICE_ID,
              1
            ),
          (error) => {
            assert.equal(error.statusCode, 404);
            assert.match(error.message, /servicio no encontrado/i);
            return true;
          }
        );
      }
    );
  }
);
