import type { NextRequest } from "next/server";
import { handlers } from "@/modules/auth/config/auth";
import { withApiErrorHandling } from "@/shared/lib/api/with-api-error-handling";

export const GET = withApiErrorHandling("auth.get", (request) => handlers.GET(request as NextRequest));
export const POST = withApiErrorHandling("auth.post", (request) => handlers.POST(request as NextRequest));
