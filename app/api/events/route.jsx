import prisma from "../../../lib/prisma";
import { sendResponse } from "../utils/SendResponse";

// GET /api/events?frequency=WEEKLY&day=MON&stopped=true
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const frequency = searchParams.get("frequency"); // DAILY | WEEKLY | MONTHLY
    const day = searchParams.get("day"); // "MON", "TUE"
    const stopped = searchParams.get("stopped"); // "true" to show stopped events

    const where = {};

    if (frequency) {
      where.frequency = frequency.toUpperCase(); 
    }

    if (day) {
      where.daysOfWeek = {
        contains: day,
      };
    }

    // Use isActive field for soft delete
    if (stopped === "true") {
      where.isActive = false;
    } else {
      where.isActive = true;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" },
    });

    return sendResponse(200, "Events fetched successfully", events);
  } catch (error) {
    console.error("Error getting events:", error);
    return sendResponse(500, "Failed to fetch events");
  }
}

export async function POST(request) {
  try {
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

    const event = await prisma.event.create({
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

    return sendResponse(201, "Event created", event);
  } catch (error) {
    console.error("Error creating event:", error);
    return sendResponse(500, "Failed to create event");
  }
}
