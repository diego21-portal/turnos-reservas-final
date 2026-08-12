import { bookingService } from "../services/booking.service.js";
import { serviceService } from "../services/service.service.js";

export async function renderServices(_req, res) {
  const result = await serviceService.list({ page: 1, limit: 100 });
  res.render("services", {
    title: "Servicios",
    services: result.payload,
    totalDocs: result.totalDocs
  });
}

export async function renderRealtimeServices(_req, res) {
  const result = await serviceService.list({ page: 1, limit: 100 });
  res.render("realtime-services", {
    title: "Servicios en tiempo real",
    services: result.payload,
    totalDocs: result.totalDocs
  });
}

export async function renderBooking(req, res) {
  const { bookingId } = req.validated?.params ?? req.params;
  const booking = await bookingService.getById(bookingId, {
    populate: true
  });

  const services = booking.services.map((item) => {
    const service = item.service;
    const subtotal = service ? service.price * item.quantity : 0;

    return {
      quantity: item.quantity,
      subtotal,
      service
    };
  });

  const total = services.reduce((sum, item) => sum + item.subtotal, 0);

  res.render("booking", {
    title: "Detalle de reserva",
    booking: {
      ...booking,
      services
    },
    total
  });
}
