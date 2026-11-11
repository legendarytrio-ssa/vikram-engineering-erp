import { useEffect, useState } from "react";

import {
  Chat as StreamChat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Window,
  WithComponents,
  useCreateChatClient,
} from "stream-chat-react";

import ChatMessage from "./ChatMessage";
import { ChatContactContext } from "./ChatContactContext";
import { createChatApi } from "./chatApi";
import "./chat.css";

const CONNECT_TIMEOUT_MS = 12000;

const ChatSession = ({
  credentials,
  roomId,
  roomName,
  apiBaseUrl,
  channelType,
  enableEmailContact,
  onContactUser,
  onReset,
}) => {
  const { apiKey, userId, username, email, token } = credentials;

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const client = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: { id: userId, name: username, email },
  });

  useEffect(() => {
    if (client) return;

    const timer = setTimeout(() => {
      setError("Could not connect to chat. Your session may have expired.");
    }, CONNECT_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [client]);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;

    const join = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await createChatApi(apiBaseUrl).joinRoom({
          roomId,
          name: username,
          email,
          roomName,
        });

        const roomChannel = client.channel(data.channelType || channelType, data.channelId);

        await roomChannel.watch();

        if (!cancelled) setChannel(roomChannel);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    join();

    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, channelType, client, roomId, roomName, userId]);

  if (error) {
    return (
      <div className="pc-status">
        <p className="pc-error">{error}</p>
        {onReset && (
          <button type="button" className="pc-ghost-button" onClick={onReset}>
            Start over
          </button>
        )}
      </div>
    );
  }

  if (!client || loading || !channel) {
    return (
      <div className="pc-status">
        Joining {roomName}...
      </div>
    );
  }

  return (
    <StreamChat client={client} theme="str-chat__theme-dark">
      <ChatContactContext.Provider
        value={{ enabled: enableEmailContact, onContact: onContactUser }}
      >
        <Channel channel={channel}>
          <WithComponents overrides={{ Message: ChatMessage }}>
            <Window>
              <ChannelHeader title={roomName} />
              <MessageList />
              <MessageInput />
            </Window>
          </WithComponents>
        </Channel>
      </ChatContactContext.Provider>
    </StreamChat>
  );
};

export default ChatSession;
