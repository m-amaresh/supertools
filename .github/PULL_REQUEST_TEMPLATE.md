## Summary

- What changed?
- Why was it needed?

## Scope

- [ ] New tool
- [ ] Existing tool enhancement
- [ ] UI/UX consistency update
- [ ] Security/privacy hardening
- [ ] Refactor/maintenance
- [ ] Documentation update

## Standards Checklist (Required)

### Architecture
- [ ] Tool logic is in `src/lib/*` (no heavy logic buried in page component)
- [ ] Route structure follows `src/app/tools/<category>/<tool>/page.tsx`
- [ ] Shared UI patterns use existing components (`Toolbar`, `AlertBox`, `CopyButton`, etc.)

### UI/UX Consistency
- [ ] Toolbar is at top of tool card
- [ ] Options bar is at top (below toolbar)
- [ ] Status messages use global `AlertBox` stack (`mx-4 mt-4`), not inline field alerts
- [ ] Input/output sections follow existing visual rhythm and typography
- [ ] Footnote states local-only processing

### Safety & Security
- [ ] Large input guards are present where needed (`MAX_INPUT_SIZE`)
- [ ] File size limits and user-facing errors are present for uploads
- [ ] No unsafe HTML rendering (`dangerouslySetInnerHTML`, `innerHTML`, eval-like patterns)
- [ ] Crypto flows validate attacker-controlled parameters and formats
- [ ] No misleading security claims in UI copy

### Accessibility
- [ ] Interactive controls are keyboard-accessible
- [ ] Inputs have labels/ARIA where required
- [ ] Contrast remains acceptable in light and dark themes

## Validation (Required)

Paste command outputs or confirm they passed locally:

- [ ] `pnpm -s exec biome check src/app src/components src/hooks src/lib src/middleware.ts next.config.ts`
- [ ] `pnpm -s exec tsc --noEmit`
- [ ] `pnpm -s build`

## Screenshots / Recording

For UI changes, attach before/after screenshots (desktop and mobile if layout changed).

## Risk Assessment

- User-facing risk level: `Low | Medium | High`
- Main failure modes considered:
  - 
  - 

## Rollback Plan

If this causes regression, how should it be reverted/disabled quickly?

