import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: spy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store tokens', () => {
      const mockResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const credentials = { email: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('accessToken')).toBe(mockResponse.accessToken);
        expect(localStorage.getItem('refreshToken')).toBe(mockResponse.refreshToken);
        expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse.user));
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const credentials = { email: 'test@example.com', password: 'wrong' };
      const errorMessage = 'Invalid credentials';

      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.error.message).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register successfully', () => {
      const mockResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          id: '1',
          email: 'new@example.com',
          username: 'newuser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      const userData = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };

      service.register(userData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should logout and clear storage', () => {
      // Set up initial state
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      localStorage.setItem('currentUser', JSON.stringify({ id: '1' }));

      service.logout().subscribe(() => {
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(localStorage.getItem('currentUser')).toBeNull();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // Create a new service instance that will read from localStorage
      const http = TestBed.inject(HttpClient);
      const tempService = new AuthService(http, routerSpy);
      expect(tempService.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      localStorage.setItem('refreshToken', 'old-refresh-token');

      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      service.refreshToken().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('accessToken')).toBe(mockResponse.accessToken);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });
});
