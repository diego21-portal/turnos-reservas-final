import test from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { serviceService } from "../src/services/service.service.js";
import { bookingService } from "../src/services/booking.service.js";

const BOOKING_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}`
      });
    });
  });
}

function stopServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

test(
  "GET /api/services conserva endpoint y respuesta paginada",
  async () => {
    const original = serviceService.list;
    serviceService.list = async (query) => ({
      payload: [],
      totalDocs: 0,
      totalPages: 1,
      page: query.page,
      limit: query.limit,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null
    });

    const { server, baseUrl } = await startServer();

    try {
      const response = await fetch(
        `${baseUrl}/api/services?page=1&limit=5`
      );
      const json = await response.json();

      assert.equal(response.status, 200);
      assert.equal(json.status, "success");
      assert.equal(json.page, 1);
      assert.equal(json.limit, 5);
      assert.deepEqual(json.payload, []);
    } finally {
      serviceService.list = original;
      await stopServer(server);
    }
  }
);

test(
  "POST /api/services inválido devuelve 400 por Zod",
  async () => {
    const original = serviceService.create;
    let reachedService = false;

    serviceService.create = async () => {
      reachedService = true;
      return {};
    };

    const { server, baseUrl } = await startServer();

    try {
      const response = await fetch(
        `${baseUrl}/api/services`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name: "A"
          })
        }
      );

      const json = await response.json();

      assert.equal(response.status, 400);
      assert.equal(reachedService, false);
      assert.equal(json.status, "error");
    } finally {
      serviceService.create = original;
      await stopServer(server);
    }
  }
);

test(
  "GET /api/bookings/:bookingId solicita populate en el endpoint principal",
  async () => {
    const original = bookingService.getById;
    let capturedOptions;

    bookingService.getById = async (id, options) => {
      assert.equal(id, BOOKING_ID);
      capturedOptions = options;

      return {
        _id: id,
        customerName: "Cliente",
        services: [
          {
            service: {
              _id: "bbbbbbbbbbbbbbbbbbbbbbbb",
              name: "Servicio poblado"
            },
            quantity: 2
          }
        ]
      };
    };

    const { server, baseUrl } = await startServer();

    try {
      const response = await fetch(
        `${baseUrl}/api/bookings/${BOOKING_ID}`
      );
      const json = await response.json();

      assert.equal(response.status, 200);
      assert.deepEqual(capturedOptions, {
        populate: true
      });
      assert.equal(
        json.payload.services[0].service.name,
        "Servicio poblado"
      );
    } finally {
      bookingService.getById = original;
      await stopServer(server);
    }
  }
);
