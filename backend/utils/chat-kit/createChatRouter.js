import { createHash } from "node:crypto";
import express from "express";
import { StreamClient } from "@stream-io/node-sdk";

const DEFAULT_CHANNEL_TYPE = "messaging";

// Stream channel IDs only allow lowercase letters, numbers, "-" and "_".
export const toChannelId = (prefix, roomId, maxLength = 48) => {
  const safeRoomId = String(roomId ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);

  return { safeRoomId, channelId: `${prefix}-${safeRoomId}` };
};

// Each unique name + email pair maps to exactly one Stream user. Reusing the
// same user id keeps the app inside Stream's free-tier active-user quota
// instead of registering a brand new guest on every visit.
export const toUserId = (name, email) => {
  const composite = `${String(email ?? "").trim().toLowerCase()}|${String(name ?? "")
    .trim()
    .toLowerCase()}`;

  return `guest-${createHash("sha256").update(composite).digest("hex").slice(0, 32)}`;
};

/**
 * Creates an Express router that exposes a Stream Chat backend for
 * room-scoped ("project" / "group" / "ticket") chatrooms.
 *
 * Routes:
 *   POST /token                 -> { apiKey, userId, username, email, token }
 *   POST /rooms/:roomId/join    -> { channelId, channelType, roomId }
 *
 * Options:
 *   authenticate(req)  -> ({ id, name, email } | null)
 *       Use this to plug in your own session/auth. When omitted, the caller
 *       joins as a guest using the name + email sent in the request body.
 *       Name + email are hashed into a stable user id, so the same person
 *       reuses one Stream user across visits.
 *   getRoomMeta({ req, roomId }) -> ({ name } | null)
 *       Look the room up in your own DB so the channel name is trusted.
 *   onRoomJoin({ req, roomId, userId })
 *       Throw to reject a join (e.g. verify project membership in your DB).
 *   roomIdPrefix (default "room")
 *       Channel IDs become `${roomIdPrefix}-${roomId}`.
 */
export function createChatRouter({
  apiKey,
  apiSecret,
  channelType = DEFAULT_CHANNEL_TYPE,
  roomIdPrefix = "room",
  authenticate,
  getRoomMeta,
  onRoomJoin,
} = {}) {
  if (!apiKey || !apiSecret) {
    throw new Error("createChatRouter: apiKey and apiSecret are required");
  }

  const stream = new StreamClient(apiKey, apiSecret);

  const resolveUser = async (req) => {
    if (authenticate) {
      const user = await authenticate(req);

      if (!user?.id) {
        const error = new Error("Unauthorized");
        error.status = 401;
        throw error;
      }

      return {
        id: String(user.id),
        name: user.name?.trim() || user.email?.trim() || String(user.id),
        email: user.email?.trim() || "",
      };
    }

    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim();

    if (!name || !email) {
      const error = new Error("Name and email are required");
      error.status = 400;
      throw error;
    }

    return { id: toUserId(name, email), name, email };
  };

  const registerUser = (user) =>
    stream.upsertUsers([
      {
        id: user.id,
        name: user.name,
        custom: user.email ? { email: user.email } : {},
      },
    ]);

  const router = express.Router();

  router.post("/token", async (req, res) => {
    try {
      const user = await resolveUser(req);

      await registerUser(user);

      const token = stream.generateUserToken({ user_id: user.id });

      res.status(200).json({
        apiKey,
        userId: user.id,
        username: user.name,
        email: user.email,
        token,
      });
    } catch (error) {
      const status = error.status ?? 500;
      if (status >= 500) console.error("[chat-kit] token error:", error);
      res.status(status).json({
        message: status >= 500 ? "Unable to generate token" : error.message,
      });
    }
  });

  router.post("/rooms/:roomId/join", async (req, res) => {
    try {
      const roomId = req.params.roomId;

      if (!roomId) {
        return res.status(400).json({ message: "Room id is required" });
      }

      // Resolve identity server-side so a user id cannot be spoofed by the
      // client and so name + email always map to the same Stream user.
      const user = await resolveUser(req);
      const userId = user.id;

      const { safeRoomId, channelId } = toChannelId(roomIdPrefix, roomId);

      if (!safeRoomId) {
        return res.status(400).json({ message: "Invalid room id" });
      }

      if (onRoomJoin) {
        await onRoomJoin({ req, roomId, userId });
      }

      await registerUser(user);

      const meta = getRoomMeta ? await getRoomMeta({ req, roomId }) : null;
      const roomName = meta?.name || req.body?.roomName?.trim() || channelId;

      await stream.chat.getOrCreateChannel({
        type: channelType,
        id: channelId,
        data: {
          created_by_id: userId,
          custom: { name: roomName, projectCode: roomName },
        },
      });

      // Stream's v2 channel API stores display metadata in `custom`; write it
      // again so existing rooms always carry the project code as their name.
      await stream.chat.updateChannel({
        type: channelType,
        id: channelId,
        data: { custom: { name: roomName, projectCode: roomName } },
        add_members: [{ user_id: userId }],
      });

      res.status(200).json({ channelId, channelType, roomId });
    } catch (error) {
      const status = error.status ?? 500;
      if (status >= 500) console.error("[chat-kit] join room error:", error);
      res.status(status).json({
        message:
          status >= 500
            ? "Unable to join chat room"
            : error.message || "Unable to join chat room",
      });
    }
  });

  return router;
}
