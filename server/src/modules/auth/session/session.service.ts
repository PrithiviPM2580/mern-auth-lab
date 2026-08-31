import { AppError } from "@/errors/app.error";
import Session from "@/models/session.model";
import type { Types } from "mongoose";

const getSessions = async (userId: Types.ObjectId) => {
  const sessions = await Session.find({
    userId,
    expiresAt: { $gt: new Date() },
  })
    .sort({ createdAt: -1 })
    .lean();

  return sessions;
};

const revokeSession = async (
  userId: Types.ObjectId,
  sessionId: Types.ObjectId,
) => {
  const session = await Session.findOneAndDelete({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw AppError.notFound("Session not found");
  }

  return {
    sessionId: session._id,
  };
};

const revokeAllSessions = async (
  userId: Types.ObjectId,
  currentSessionId: Types.ObjectId,
) => {
  const result = await Session.deleteMany({
    userId,
    _id: { $ne: currentSessionId },
  });

  return {
    revokedCount: result.deletedCount,
  };
};

export const sessionService = {
  getSessions,
  revokeSession,
  revokeAllSessions,
};
