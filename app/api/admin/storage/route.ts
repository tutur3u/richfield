import { forwardStorageRequest } from "@/lib/richfield-admin-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return forwardStorageRequest(request, "GET");
}

export async function POST(request: Request) {
  return forwardStorageRequest(request, "POST");
}

export async function PATCH(request: Request) {
  return forwardStorageRequest(request, "PATCH");
}

export async function DELETE(request: Request) {
  return forwardStorageRequest(request, "DELETE");
}
