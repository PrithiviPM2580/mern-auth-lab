import type { Request, Response } from "express";
import { sessionService } from "./session.service";
import { HTTP_STATUS } from "@/config/http.config";
import type { TypeRequest } from "@/types";
import type { SessionParams } from "./session.validation";
import { Types } from "mongoose";

const getSessions = async (req: Request, res: Response) => {
  const sessions = await sessionService.getSessions(req.auth!.userId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Sessions retrieved successfully",
    sessions,
  });
};

const revokeSession = async (
  req: TypeRequest<unknown, SessionParams>,
  res: Response,
) => {
  const { sessionId } = req.params;

  const result = await sessionService.revokeSession(
    req.auth!.userId,
    new Types.ObjectId(sessionId),
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "Session revoked successfully",
    result,
  });
};

const revokeAllSessions = async (req: Request, res: Response) => {
  const result = await sessionService.revokeAllSessions(
    req.auth!.userId,
    req.auth!.sessionId,
  );

  return res.status(HTTP_STATUS.OK).json({
    message: "All sessions revoked successfully",
    result,
  });
};

export const sessionController = {
  getSessions,
  revokeSession,
  revokeAllSessions,
};
