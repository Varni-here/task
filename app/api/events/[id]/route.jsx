import prisma from "../../../../lib/prisma";
import { sendResponse } from "../../utils/SendResponse";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) {
      return sendResponse(404, "Event not found");
    }

    return sendResponse(200, "Event fetched", event);
  } catch (error) {
    return sendResponse(500, "Failed to fetch event");
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const restore = searchParams.get("restore") === "true";

    if (restore) {
      // Restore stopped event
      const event = await prisma.event.update({
        where: { id: parseInt(id) },
        data: {
          isActive: true,
        },
      });
      return sendResponse(200, "Event restored", event);
    }

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      isRecurring,
      frequency,
      daysOfWeek,
      recurringEndDate,
      isActive,
    } = body;

    if (!title || !startDate || !endDate) {
      return sendResponse(400, "title, startDate, endDate are required");
    }

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isRecurring: Boolean(isRecurring),
        frequency: frequency || null,
        daysOfWeek: daysOfWeek ?? null,
        recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    return sendResponse(200, "Event updated", event);
  } catch (error) {
    return sendResponse(500, "Failed to update event");
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      // Hard delete - permanently remove from database
      await prisma.event.delete({
        where: { id: parseInt(id) },
      });
      return sendResponse(200, "Event permanently deleted");
    } else {
      // Soft delete - mark as inactive
      const event = await prisma.event.update({
        where: { id: parseInt(id) },
        data: {
          isActive: false,
        },
      });
      return sendResponse(200, "Event stopped", event);
    }
  } catch (error) {
    return sendResponse(500, "Failed to delete event");
  }
}