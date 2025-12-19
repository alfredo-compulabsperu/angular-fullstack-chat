# WebSocket Events Documentation

## Connection

Connect to WebSocket server at:
- Development: `ws://localhost:3000`
- Production: `wss://api.collabspace.com`

Include authentication token in connection query:
```javascript
const socket = io('ws://localhost:3000', {
  query: { token: 'your-jwt-token' }
});
```

## Connection Events

### Connected
**Event:** `connect`

Emitted when successfully connected to the server.

```javascript
socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Disconnected
**Event:** `disconnect`

Emitted when disconnected from the server.

```javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

### Error
**Event:** `error`

Emitted when connection error occurs.

```javascript
socket.on('error', (error) => {
  console.error('Connection error:', error);
});
```

## Heartbeat

### Ping
**Event:** `ping`

Client sends heartbeat to server every 30 seconds.

**Payload:**
```json
{
  "timestamp": 1640000000000
}
```

### Pong
**Event:** `pong`

Server responds to ping.

**Payload:**
```json
{
  "timestamp": 1640000000000
}
```

## Chat Events

### Send Message
**Event:** `chat:sendMessage`

Send a new message to a conversation.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "content": "Hello, world!",
  "type": "text"
}
```

### Message Received
**Event:** `chat:messageReceived`

Emitted when a new message is received.

**Payload:**
```json
{
  "id": "msg-456",
  "conversationId": "conv-123",
  "senderId": "user-789",
  "content": "Hello, world!",
  "type": "text",
  "isRead": false,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Typing Started
**Event:** `chat:typingStarted`

Emit when user starts typing.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "userId": "user-789"
}
```

### Typing Stopped
**Event:** `chat:typingStopped`

Emit when user stops typing.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "userId": "user-789"
}
```

### User Typing
**Event:** `chat:userTyping`

Emitted to other users when someone is typing.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "userId": "user-789",
  "username": "johndoe"
}
```

### Mark as Read
**Event:** `chat:markAsRead`

Mark messages as read.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "messageIds": ["msg-456", "msg-457"]
}
```

### Messages Read
**Event:** `chat:messagesRead`

Emitted when messages are marked as read.

**Payload:**
```json
{
  "conversationId": "conv-123",
  "userId": "user-789",
  "messageIds": ["msg-456", "msg-457"]
}
```

## Presence Events

### User Online
**Event:** `presence:userOnline`

Emitted when a user comes online.

**Payload:**
```json
{
  "userId": "user-789",
  "username": "johndoe",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### User Offline
**Event:** `presence:userOffline`

Emitted when a user goes offline.

**Payload:**
```json
{
  "userId": "user-789",
  "username": "johndoe",
  "lastSeen": "2025-01-01T00:00:00.000Z"
}
```

## Task Events

### Task Created
**Event:** `task:created`

Emitted when a new task is created.

**Payload:**
```json
{
  "id": "task-123",
  "title": "New Task",
  "description": "Task description",
  "status": "todo",
  "priority": "high",
  "workspaceId": "ws-456",
  "assigneeId": "user-789",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Task Updated
**Event:** `task:updated`

Emitted when a task is updated.

**Payload:**
```json
{
  "id": "task-123",
  "title": "Updated Task",
  "status": "in-progress",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Task Moved
**Event:** `task:moved`

Emitted when a task is moved to a different status.

**Payload:**
```json
{
  "id": "task-123",
  "fromStatus": "todo",
  "toStatus": "in-progress",
  "workspaceId": "ws-456",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### Task Deleted
**Event:** `task:deleted`

Emitted when a task is deleted.

**Payload:**
```json
{
  "id": "task-123",
  "workspaceId": "ws-456"
}
```

## Workspace Events

### Workspace Member Added
**Event:** `workspace:memberAdded`

Emitted when a member is added to workspace.

**Payload:**
```json
{
  "workspaceId": "ws-456",
  "member": {
    "id": "member-123",
    "userId": "user-789",
    "role": "member",
    "joinedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Workspace Member Removed
**Event:** `workspace:memberRemoved`

Emitted when a member is removed from workspace.

**Payload:**
```json
{
  "workspaceId": "ws-456",
  "userId": "user-789"
}
```

## Error Handling

### Error Event
**Event:** `error`

Emitted when an error occurs.

**Payload:**
```json
{
  "code": "UNAUTHORIZED",
  "message": "Authentication failed",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Rate Limiting

WebSocket events are rate-limited per connection:
- Maximum 100 events per minute
- Typing events: Maximum 1 per second

When rate limit is exceeded, the server will emit an `error` event with code `RATE_LIMIT_EXCEEDED`.

## Reconnection

The client should implement exponential backoff for reconnection:

```javascript
const socket = io('ws://localhost:3000', {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 30000,
  reconnectionAttempts: 10
});
```

## Best Practices

1. **Always listen for connection events** before emitting data
2. **Implement reconnection logic** with exponential backoff
3. **Handle errors gracefully** and show user-friendly messages
4. **Debounce typing events** to reduce server load
5. **Clean up listeners** when components are destroyed
6. **Use acknowledgments** for critical events
7. **Implement heartbeat mechanism** to detect stale connections
