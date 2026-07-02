# PathoCare Pro Copilot Instructions

## Project context
- This repository is a healthcare SaaS frontend for PathoCare Pro.
- Keep changes production-ready, accessible, and aligned with the existing React + Vite architecture unless a migration is explicitly requested.
- Prefer small, composable changes over large rewrites.

## Coding standards
- Use TypeScript strictly. Avoid any, unsafe casts, and loose typing.
- Keep components focused on UI rendering. Move business logic into hooks, services, or shared modules.
- Reuse existing components, utilities, stores, and contracts before introducing new abstractions.
- Follow the current folder conventions and keep related code colocated.
- Write clear, descriptive names and keep functions small.

## Frontend architecture expectations
- Preserve the mock-to-real API cutover path.
- Use typed contracts and shared DTOs rather than ad-hoc shapes.
- Keep UI accessible, responsive, and resilient to loading, error, and empty states.
- Respect healthcare data sensitivity, tenant isolation, and secure-by-default behavior.
- Avoid coupling features to backend-specific assumptions.

## Validation expectations
- Verify changes with the most relevant checks available, such as TypeScript diagnostics, builds, or targeted tests.
- If a fix affects routing, forms, state, or API integration, verify the affected flow before declaring it complete.

## Preferred implementation approach
1. Review existing patterns in the codebase before changing behavior.
2. Make the smallest change that solves the issue.
3. Keep the user experience stable and predictable.
4. Document important tradeoffs when introducing architectural changes.
