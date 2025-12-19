import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, timer } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, delayWhen, takeUntil, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface WebSocketMessage {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService implements OnDestroy {
  private socket$: WebSocketSubject<WebSocketMessage> | null = null;
  private messagesSubject = new Subject<WebSocketMessage>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private heartbeatInterval: any;

  public readonly messages$ = this.messagesSubject.asObservable();
  public readonly connectionStatus$ = this.connectionStatusSubject.asObservable();

  constructor() {}

  connect(token: string): void {
    if (this.socket$) {
      return;
    }

    const wsUrl = `${environment.wsUrl}?token=${token}`;
    
    this.socket$ = webSocket<WebSocketMessage>({
      url: wsUrl,
      openObserver: {
        next: () => {
          console.log('WebSocket connected');
          this.connectionStatusSubject.next(true);
          this.reconnectAttempts = 0;
          this.startHeartbeat();
        },
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket disconnected');
          this.connectionStatusSubject.next(false);
          this.stopHeartbeat();
        },
      },
    });

    this.socket$
      .pipe(
        retryWhen((errors) =>
          errors.pipe(
            tap((error) => {
              console.error('WebSocket error:', error);
              this.reconnectAttempts++;
              
              if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
                throw error;
              }
            }),
            delayWhen(() => {
              const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
              console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
              return timer(delay);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (message) => this.messagesSubject.next(message),
        error: (error) => console.error('WebSocket error:', error),
      });
  }

  disconnect(): void {
    this.stopHeartbeat();
    
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
    
    this.connectionStatusSubject.next(false);
  }

  emit(event: string, data: any): void {
    if (this.socket$ && this.connectionStatusSubject.value) {
      this.socket$.next({ event, data });
    } else {
      console.warn('WebSocket is not connected. Cannot emit event:', event);
    }
  }

  on(event: string): Observable<any> {
    return this.messages$.pipe(
      filter((message) => message.event === event),
      tap((message) => console.log(`Received event: ${event}`, message.data))
    );
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.socket$ && this.connectionStatusSubject.value) {
        this.emit('ping', { timestamp: Date.now() });
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
  }
}
