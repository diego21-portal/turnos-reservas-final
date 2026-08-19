import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");

async function read(relativePath) {
  return fs.readFile(
    path.join(root, relativePath),
    "utf8"
  );
}

test(
  "el flujo respeta routes → controllers → services → repositories → DAO → models",
  async () => {
    const serviceRouter = await read(
      "src/routes/service.router.js"
    );
    const bookingRouter = await read(
      "src/routes/booking.router.js"
    );
    const serviceController = await read(
      "src/controllers/service.controller.js"
    );
    const bookingController = await read(
      "src/controllers/booking.controller.js"
    );
    const serviceService = await read(
      "src/services/service.service.js"
    );
    const bookingService = await read(
      "src/services/booking.service.js"
    );
    const serviceRepository = await read(
      "src/repositories/service.repository.js"
    );
    const bookingRepository = await read(
      "src/repositories/booking.repository.js"
    );
    const serviceDao = await read(
      "src/dao/service.dao.js"
    );
    const bookingDao = await read(
      "src/dao/booking.dao.js"
    );

    for (const router of [serviceRouter, bookingRouter]) {
      assert.doesNotMatch(
        router,
        /repositories|\/dao\/|\/models\//
      );
    }

    for (const controller of [
      serviceController,
      bookingController
    ]) {
      assert.doesNotMatch(
        controller,
        /repositories|\/dao\/|\/models\/|mongoose/
      );
    }

    for (const service of [
      serviceService,
      bookingService
    ]) {
      assert.doesNotMatch(
        service,
        /\/dao\/|\/models\/|mongoose|req\.|res\./
      );
    }

    for (const repository of [
      serviceRepository,
      bookingRepository
    ]) {
      assert.match(repository, /\.\.\/dao\//);
      assert.doesNotMatch(
        repository,
        /\/models\/|mongoose|req\.|res\./
      );
    }

    assert.match(serviceDao, /\.\.\/models\/service\.model\.js/);
    assert.match(bookingDao, /\.\.\/models\/booking\.model\.js/);
  }
);

test(
  "Booking usa ObjectId + ref Service y existe MessageModel",
  async () => {
    const bookingModel = await read(
      "src/models/booking.model.js"
    );
    const messageModel = await read(
      "src/models/message.model.js"
    );

    assert.match(
      bookingModel,
      /mongoose\.Schema\.Types\.ObjectId/
    );
    assert.match(bookingModel, /ref:\s*"Service"/);
    assert.match(bookingModel, /quantity/);
    assert.match(
      messageModel,
      /mongoose\.model\(\s*"Message"/
    );
  }
);

test(
  "populate está implementado en la capa DAO",
  async () => {
    const bookingDao = await read(
      "src/dao/booking.dao.js"
    );

    assert.match(
      bookingDao,
      /path:\s*"services\.service"/
    );
    assert.match(bookingDao, /\.populate\(/);
  }
);

test(
  "la regla de quantity vive en booking.service.js",
  async () => {
    const bookingService = await read(
      "src/services/booking.service.js"
    );
    const bookingDao = await read(
      "src/dao/booking.dao.js"
    );

    assert.match(
      bookingService,
      /existingItem\.quantity\s*\+\s*quantity/
    );

    // DAO solo persiste valores; no decide cómo acumularlos.
    assert.doesNotMatch(
      bookingDao,
      /existingItem\.quantity\s*\+/
    );
  }
);
