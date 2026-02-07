# Contributing to SocialAi

Thank you for your interest in contributing to SocialAi! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Messages](#commit-messages)
6. [Pull Request Process](#pull-request-process)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background or experience level.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize the community's best interests

### Unacceptable Behavior

- Harassment, discrimination, or trolling
- Personal attacks or inflammatory comments
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Git configured with your name and email
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SocialAi.git
   cd SocialAi
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/SMSDAO/SocialAi.git
   ```

### Initial Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup database:
   ```bash
   createdb socialai_dev
   psql -U postgres -d socialai_dev -f db/schema.sql
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your local settings
   ```

4. Verify setup:
   ```bash
   npm run dev
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

**Branch Naming Conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### 2. Make Changes

- Keep changes focused and atomic
- Write clear, self-documenting code
- Add comments for complex logic
- Update documentation as needed
- Add tests for new functionality

### 3. Test Your Changes

Before committing:

```bash
# Run linting
npm run lint

# Run tests (if applicable)
npm run test

# Test all applications
npm run dev                # Backend
npm run dev:public         # Public app
npm run dev:admin          # Admin console
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "type: brief description"
```

### 5. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 6. Push and Create Pull Request

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### JavaScript/TypeScript Style

**General Guidelines:**
- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring where appropriate

**Example:**
```javascript
// Good
const getUserProfile = async (userId) => {
  const { data } = await fetchUser(userId);
  return data;
};

// Avoid
var getUserProfile = function(userId) {
  var response = fetchUser(userId);
  return response.data;
};
```

### File Organization

**Backend (Node.js):**
- Keep files focused and modular
- Export only what's needed
- Group related functionality
- Use clear, descriptive names

**Frontend (Astro/Angular):**
- Follow framework conventions
- Keep components small and focused
- Separate logic from presentation
- Use TypeScript for type safety

### Code Formatting

- **Indentation**: 2 spaces
- **Line Length**: 100 characters max
- **Semicolons**: Use them consistently
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Use in multi-line structures

### Naming Conventions

**Variables and Functions:**
```javascript
// camelCase for variables and functions
const userName = 'Alice';
const fetchUserData = () => {};
```

**Classes and Components:**
```javascript
// PascalCase for classes and components
class UserProfile {}
const ProfileCard = () => {};
```

**Constants:**
```javascript
// UPPER_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'http://localhost:3000';
```

**Files:**
- `kebab-case.js` for general files
- `PascalCase.tsx` for React/Astro components
- `PascalCase.component.ts` for Angular components

---

## Commit Messages

### Format

```
type(scope): brief description

Optional detailed explanation of the change.

Fixes #issue-number
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```
feat(api): add endpoint for user recommendations

Implements AI-powered user recommendations based on profile
similarity and interaction patterns.

Fixes #123
```

```
fix(worker): prevent Farcaster worker crash on invalid data

Added validation for incoming Farcaster cast data to handle
edge cases where required fields are missing.

Fixes #456
```

```
docs(installation): update PostgreSQL setup instructions

Added troubleshooting steps for common PostgreSQL connection
issues on macOS.
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with main
- [ ] No merge conflicts

### PR Title Format

```
type(scope): brief description
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How were these changes tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Fixes #issue-number
```

### Review Process

1. Maintainer reviews your PR
2. Address feedback if requested
3. Maintainer approves and merges
4. Your contribution is included in the next release!

### PR Best Practices

- Keep PRs focused and small
- Respond to feedback promptly
- Be open to suggestions
- Update PR based on review comments
- Squash commits if requested

---

## Testing Requirements

### Unit Tests

For new functionality, include unit tests:

```javascript
describe('getUserProfile', () => {
  it('should return user profile data', async () => {
    const profile = await getUserProfile('user-id');
    expect(profile).toBeDefined();
    expect(profile.username).toBe('testuser');
  });

  it('should handle missing user', async () => {
    await expect(getUserProfile('invalid-id'))
      .rejects.toThrow('User not found');
  });
});
```

### Integration Tests

Test interactions between components:

```javascript
describe('API Integration', () => {
  it('should create and retrieve a post', async () => {
    const post = await createPost({ content: 'Test' });
    const retrieved = await getPost(post.id);
    expect(retrieved.content).toBe('Test');
  });
});
```

### Manual Testing

Test the following before submitting:

1. **Backend**: API endpoints work correctly
2. **Public App**: Pages render without errors
3. **Admin Console**: Features function as expected
4. **Workers**: Background tasks run successfully

---

## Documentation

### Code Documentation

Add JSDoc comments for functions:

```javascript
/**
 * Fetches a user profile by ID
 * @param {string} userId - The user's UUID
 * @returns {Promise<Object>} The user profile object
 * @throws {Error} If user not found
 */
async function getUserProfile(userId) {
  // Implementation
}
```

### Documentation Files

When adding features, update:
- `docs/API.md` - For new API endpoints
- `docs/ARCHITECTURE.md` - For architectural changes
- `docs/INSTALLATION.md` - For setup changes
- `README.md` - For major features

### Inline Comments

Add comments for:
- Complex algorithms
- Non-obvious code
- Workarounds or hacks
- TODO items

**Example:**
```javascript
// TODO: Optimize this query for large datasets
// Currently loads all users into memory which may cause
// performance issues with 10k+ users
const users = await fetchAllUsers();
```

---

## Issue Reporting

### Before Creating an Issue

1. Search existing issues
2. Check documentation
3. Verify it's not a local configuration issue
4. Reproduce the issue

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., macOS 13]
- Node.js: [e.g., 18.12.0]
- Browser: [e.g., Chrome 120]

**Additional context**
Any other relevant information
```

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Alternative solutions or workarounds

**Additional context**
Any other relevant information
```

---

## Areas for Contribution

### High Priority

- **Testing**: Add unit and integration tests
- **Documentation**: Improve and expand docs
- **Bug Fixes**: Fix reported issues
- **Performance**: Optimize slow operations

### Feature Ideas

- **Network Integrations**: Lens, Bluesky, Mastodon
- **AI Enhancements**: Better recommendations, content analysis
- **Search Improvements**: Advanced filters, faceted search
- **Mobile App**: React Native or Flutter implementation
- **Analytics**: User metrics and system analytics

### Good First Issues

Look for issues labeled `good first issue` - these are beginner-friendly and a great way to get started!

---

## Questions?

If you have questions:
- Check the [documentation](README.md)
- Open a [discussion](https://github.com/SMSDAO/SocialAi/discussions)
- Ask in existing issues

---

## Recognition

All contributors are recognized in:
- Repository contributors list
- Release notes
- Project documentation

Thank you for contributing to SocialAi! 🎉

---

*Last Updated: 2026-02-07*
