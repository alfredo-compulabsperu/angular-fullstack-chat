import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, retryWhen, mergeMap } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            // Only retry on network errors or 5xx server errors
            if (
              index < this.maxRetries &&
              (error.status === 0 || error.status >= 500)
            ) {
              const delay = this.retryDelay * Math.pow(2, index);
              console.log(`Retrying request (attempt ${index + 1}/${this.maxRetries}) after ${delay}ms`);
              return timer(delay);
            }
            return throwError(() => error);
          })
        )
      ),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = error.error?.message || `Server Error: ${error.status} ${error.statusText}`;
        }

        console.error('HTTP Error:', errorMessage, error);
        return throwError(() => ({ ...error, userMessage: errorMessage }));
      })
    );
  }
}
