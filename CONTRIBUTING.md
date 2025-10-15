# Contributing to Porichoy

Thank you for your interest in contributing to Porichoy! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and considerate of others. We aim to make Porichoy a welcoming project for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/yourusername/porichoy-web/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

### Suggesting Features

1. Check existing issues and discussions
2. Create a new issue with:
   - Feature description
   - Use case/motivation
   - Proposed implementation (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Submit a pull request

## Development Setup

See [README.md](README.md) for installation instructions.

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define types/interfaces for data structures
- Avoid `any` type when possible
- Use strict mode

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router conventions
- Use async/await for asynchronous operations
- Implement proper error handling with try-catch

### Styling

- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### Code Structure

```typescript
// ✅ Good
const MyComponent = () => {
  const [state, setState] = useState(initialValue)
  
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  const handleAction = async () => {
    try {
      // Action logic
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return <div>...</div>
}

// ❌ Avoid
function MyComponent() {
  // No error handling
  const handleAction = () => {
    // Direct API calls without try-catch
  }
  
  return <div>...</div>
}
```

### File Organization

- One component per file
- Co-locate related files
- Use meaningful file names
- Group by feature, not by type

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINT`)
- **Types/Interfaces**: PascalCase (e.g., `UserProfile`)

## i18n Guidelines

### Adding Translations

1. Add to both `bn` and `en` locale files
2. Use descriptive keys
3. Keep translations concise
4. Test with both languages

Example:

```json
// public/locales/en/common.json
{
  "button.save": "Save",
  "message.success": "Saved successfully"
}

// public/locales/bn/common.json
{
  "button.save": "সংরক্ষণ",
  "message.success": "সফলভাবে সংরক্ষিত হয়েছে"
}
```

### Bangla Typography

- Use `font-bengali` class for Bangla text
- Test rendering with Noto Sans Bengali font
- Ensure proper Unicode support

## Database Changes

### Schema Modifications

1. Update `supabase/schema.sql`
2. Create migration SQL file
3. Document changes in PR
4. Test with existing data

### RLS Policies

- Always add Row-Level Security policies
- Test policies thoroughly
- Document policy purpose

## Testing

### Manual Testing

Before submitting PR:
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices
- [ ] Test both Bangla and English interfaces
- [ ] Test with different user roles
- [ ] Verify database changes work

### Future: Automated Testing

We plan to add:
- Unit tests (Jest)
- Integration tests
- E2E tests (Playwright)

## Commit Messages

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add Google OAuth support
fix(editor): resolve save button state issue
docs(readme): update installation instructions
```

## Documentation

- Update README.md for feature changes
- Add JSDoc comments for complex functions
- Document API changes
- Update deployment guide if needed

## Review Process

1. PR is submitted
2. CI checks run (once set up)
3. Code review by maintainers
4. Address feedback
5. Approval and merge

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Porichoy! 🙏

