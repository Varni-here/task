export function sendResponse(status, message, data = null) {
  return Response.json(
    {
      success: status < 400,
      message,
      data,
    },
    { status }
  );
}