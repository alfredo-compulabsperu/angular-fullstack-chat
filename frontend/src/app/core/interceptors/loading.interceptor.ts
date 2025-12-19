import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private loadingRequestsCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public readonly loading$ = this.loadingSubject.asObservable();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading indicator for certain requests
    if (request.headers.has('X-Skip-Loading')) {
      return next.handle(request);
    }

    this.incrementRequests();

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.decrementRequests();
        }
      }),
      finalize(() => {
        this.decrementRequests();
      })
    );
  }

  private incrementRequests(): void {
    this.loadingRequestsCount++;
    if (this.loadingRequestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  private decrementRequests(): void {
    this.loadingRequestsCount = Math.max(0, this.loadingRequestsCount - 1);
    if (this.loadingRequestsCount === 0) {
      this.loadingSubject.next(false);
    }
  }
}
