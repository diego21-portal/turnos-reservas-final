import test from "node:test";
import assert from "node:assert/strict";
import { validate } from "../src/middlewares/validate.middleware.js";
import {
  createServiceSchema,
  serviceQuerySchema
} from "../src/schemas/service.schemas.js";
import {
  bookingServiceParamsSchema
} from "../src/schemas/booking.schemas.js";

function executeMiddleware(middleware, req) {
  return new Promise((resolve) => {
    middleware(req, {}, (error) => {
      resolve({ error, req });
    });
  });
}

test(
  "Zod bloquea un servicio incompleto antes del controller",
  async () => {
    const middleware = validate({
      body: createServiceSchema
    });

    const { error } = await executeMiddleware(
      middleware,
      {
        body: {
          name: "A"
        }
      }
    );

    assert.ok(error);
    assert.equal(error.statusCode, 400);
    assert.match(error.message, /datos inválidos en body/i);
  }
);

test(
  "Zod transforma query params de paginación y booleanos",
  async () => {
    const middleware = validate({
      query: serviceQuerySchema
    });

    const { error, req } = await executeMiddleware(
      middleware,
      {
        query: {
          page: "2",
          limit: "5",
          available: "true",
          sort: "asc"
        }
      }
    );

    assert.equal(error, undefined);
    assert.equal(req.validated.query.page, 2);
    assert.equal(req.validated.query.limit, 5);
    assert.equal(req.validated.query.available, true);
    assert.equal(req.validated.query.sort, "asc");
  }
);

test(
  "Zod rechaza ObjectId inválidos en reservas",
  async () => {
    const middleware = validate({
      params: bookingServiceParamsSchema
    });

    const { error } = await executeMiddleware(
      middleware,
      {
        params: {
          bookingId: "abc",
          serviceId: "def"
        }
      }
    );

    assert.ok(error);
    assert.equal(error.statusCode, 400);
  }
);
