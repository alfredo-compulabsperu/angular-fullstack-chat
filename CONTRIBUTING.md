# Contributing to CollabSpace

Thank you for your interest in contributing to CollabSpace! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Git
- Docker and Docker Compose (optional, for containerized development)

### Setting Up Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/angular-fullstack-chat.git
   cd angular-fullstack-chat
   ```

2. **Install Dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Configure Environment**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm start
   
   # Terminal 2 - Backend
   cd backend
   npm run start:dev
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Production hotfixes

### Making Changes

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Frontend tests
   cd frontend
   npm test
   npm run lint
   npm run build
   
   # Backend tests
   cd backend
   npm test
   npm run lint
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

5. **Push Your Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- No `any` types (use `unknown` if necessary)
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names

### Angular

- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- Use OnPush change detection strategy
- Implement proper unsubscribe patterns (takeUntil)
- Use reactive forms over template-driven forms
- Add `trackBy` functions to `*ngFor` directives

### NestJS

- Follow [NestJS Best Practices](https://docs.nestjs.com/)
- Use DTOs for request validation
- Implement proper error handling
- Use dependency injection
- Keep controllers thin, logic in services

### Testing

- Write tests for all new features
- Maintain 80%+ code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

### Code Style

- Use Prettier for formatting (configuration provided)
- Follow ESLint rules (configuration provided)
- Use meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic only

## Testing Guidelines

### Unit Tests

**Frontend:**
```bash
cd frontend
npm test
```

**Backend:**
```bash
cd backend
npm test
```

### E2E Tests

```bash
cd frontend
npm run e2e
```

### Test Coverage

```bash
# Frontend
cd frontend
npm run test:coverage

# Backend
cd backend
npm run test:cov
```

## Documentation

When adding new features:

1. Update relevant documentation files
2. Add JSDoc comments for complex functions
3. Update API.md for new endpoints
4. Update WEBSOCKET.md for new events
5. Update README.md if necessary

## Pull Request Process

1. **Ensure CI Passes**
   - All tests must pass
   - Linting must pass
   - Build must succeed

2. **Update Documentation**
   - Update relevant docs
   - Add API documentation
   - Update CHANGELOG.md

3. **Request Review**
   - At least one approval required
   - Address all review comments
   - Keep PR focused and small

4. **Merge**
   - Squash and merge for feature branches
   - Keep main branch clean and linear

## Reporting Issues

### Bug Reports

When reporting bugs, include:

- Clear, descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)
- Error messages and stack traces

### Feature Requests

When requesting features, include:

- Clear description of the feature
- Use case and benefits
- Proposed implementation (if any)
- Mockups or diagrams (if applicable)

## Communication

- GitHub Issues - Bug reports and feature requests
- Pull Requests - Code contributions and discussions
- GitHub Discussions - General questions and ideas

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Create a new issue with the "question" label

Thank you for contributing to CollabSpace!
