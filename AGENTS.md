# AGENTS.md

## How to work in this repository
- Follow the standards in [.github/copilot-instructions.md](.github/copilot-instructions.md).
- Keep changes consistent with the existing React/Vite structure and healthcare SaaS expectations.
- Prefer minimal, typed, maintainable solutions.
- Do not introduce unnecessary abstractions or duplicate utilities.
- Verify relevant checks before considering work complete.

## API integration rule
- For any frontend task involving API calls, integration, or endpoint wiring, always consult the backend contract reference at [../Backend/PathoCareBackend/docs/IMPLEMENTED_API_CONTRACT.md](../Backend/PathoCareBackend/docs/IMPLEMENTED_API_CONTRACT.md) first.
- Use that document as the source of truth for endpoint paths, request payloads, headers, auth flow, and expected response shape.
- If the requested integration is not covered in the contract, note the gap explicitly before implementing.
- Prefer matching the documented contract over guessing or using ad-hoc assumptions.
