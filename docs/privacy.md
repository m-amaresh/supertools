# Privacy and Data Handling

## Core Model

SuperTools is designed so tool payload processing is local to the browser.

Examples of payloads:

- Plaintext/ciphertext entered into tools
- Password generator output
- Keys and passphrases used in crypto tools
- Tokens and encoded strings

## What Is Not Sent for Processing

- Tool input/output is not sent to a backend compute service for transformation.
- No server-side API is required for core tool operations.

## Telemetry

If deployed on Vercel, telemetry can be enabled for:

- Web analytics
- Performance insights

Policy:

- Collect usage/performance metadata only.
- Do not log sensitive raw tool payload content in analytics events.

## Browser Storage and Offline

- Service worker/offline support may cache app shell resources for resilience.
- Caching improves availability but does not change the local-processing model.
