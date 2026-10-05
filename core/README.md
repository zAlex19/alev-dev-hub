# Core

Shared capabilities used by every adapter.

Initial target surface:
- workspaces
- files
- commands
- processes
- logs
- tests
- Git
- checkpoints

Adapters must call the core instead of reimplementing these capabilities.
