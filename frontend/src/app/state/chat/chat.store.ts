import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Conversation, Message } from '../core/models';

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: { [conversationId: string]: Message[] };
  typingUsers: { [conversationId: string]: string[] };
  unreadCounts: { [conversationId: string]: number };
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  typingUsers: {},
  unreadCounts: {},
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class ChatStore {
  private state = new BehaviorSubject<ChatState>(initialState);
  public readonly state$ = this.state.asObservable();

  // Selectors
  public readonly conversations$ = this.select((s) => s.conversations);
  public readonly activeConversationId$ = this.select((s) => s.activeConversationId);
  public readonly loading$ = this.select((s) => s.loading);
  public readonly error$ = this.select((s) => s.error);

  public readonly activeConversation$ = this.state$.pipe(
    map((state) => {
      if (!state.activeConversationId) return null;
      return state.conversations.find((c) => c.id === state.activeConversationId) || null;
    })
  );

  public readonly activeMessages$ = this.state$.pipe(
    map((state) => {
      if (!state.activeConversationId) return [];
      return state.messages[state.activeConversationId] || [];
    })
  );

  constructor() {}

  private select<K>(selector: (state: ChatState) => K): Observable<K> {
    return this.state$.pipe(map(selector));
  }

  private update(partial: Partial<ChatState>): void {
    this.state.next({ ...this.state.value, ...partial });
  }

  // Mutations
  setConversations(conversations: Conversation[]): void {
    this.update({ conversations });
  }

  addConversation(conversation: Conversation): void {
    const conversations = [...this.state.value.conversations, conversation];
    this.update({ conversations });
  }

  setActiveConversation(conversationId: string | null): void {
    this.update({ activeConversationId: conversationId });
  }

  setMessages(conversationId: string, messages: Message[]): void {
    const currentMessages = { ...this.state.value.messages };
    currentMessages[conversationId] = messages;
    this.update({ messages: currentMessages });
  }

  addMessage(conversationId: string, message: Message): void {
    const currentMessages = { ...this.state.value.messages };
    const conversationMessages = currentMessages[conversationId] || [];
    currentMessages[conversationId] = [...conversationMessages, message];
    this.update({ messages: currentMessages });

    // Update last message in conversation
    const conversations = this.state.value.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, lastMessage: message } : conv
    );
    this.update({ conversations });
  }

  updateMessage(conversationId: string, messageId: string, updates: Partial<Message>): void {
    const currentMessages = { ...this.state.value.messages };
    const messages = currentMessages[conversationId] || [];
    currentMessages[conversationId] = messages.map((msg) =>
      msg.id === messageId ? { ...msg, ...updates } : msg
    );
    this.update({ messages: currentMessages });
  }

  setTypingUsers(conversationId: string, users: string[]): void {
    const typingUsers = { ...this.state.value.typingUsers };
    typingUsers[conversationId] = users;
    this.update({ typingUsers });
  }

  setUnreadCount(conversationId: string, count: number): void {
    const unreadCounts = { ...this.state.value.unreadCounts };
    unreadCounts[conversationId] = count;
    this.update({ unreadCounts });

    // Update conversation unread count
    const conversations = this.state.value.conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: count } : conv
    );
    this.update({ conversations });
  }

  incrementUnreadCount(conversationId: string): void {
    const current = this.state.value.unreadCounts[conversationId] || 0;
    this.setUnreadCount(conversationId, current + 1);
  }

  markAsRead(conversationId: string): void {
    this.setUnreadCount(conversationId, 0);
    
    // Update all messages as read
    const currentMessages = { ...this.state.value.messages };
    const messages = currentMessages[conversationId] || [];
    currentMessages[conversationId] = messages.map((msg) => ({ ...msg, isRead: true }));
    this.update({ messages: currentMessages });
  }

  setLoading(loading: boolean): void {
    this.update({ loading });
  }

  setError(error: string | null): void {
    this.update({ error });
  }

  reset(): void {
    this.state.next(initialState);
  }
}
