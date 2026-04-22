<<<<<<< HEAD
# Task List for <feature-id>-<feature-name>

**Feature ID**: <feature-id>
**Feature Name**: <feature-name>
**Created Date**: <YYYY-MM-DD>
**Last Updated**: <YYYY-MM-DD>
**Language**: <detected-language>

## Summary

|| Total Tasks | TODO | In Progress | Done | Blocked | Cancelled |
||-------------|------|-------------|------|---------|-----------|
|| 0           | 0    | 0           | 0    | 0       | 0         |

## Task Registry

|| Task ID | Task Name               | Status      | Task PRD                | Dependencies | Estimated Effort | Created     | Updated     |
||---------|-------------------------|-------------|-------------------------|--------------|------------------|-------------|-------------|
|| TASK-001| example-task-name      | TODO        | NOT GENERATED           | NONE         | 2 hours          | 2026-01-20  | 2026-01-20  |
=======
# Task List

**Product:** {Product Name}
**Document:** Task List
**Version:** 1.0
**Last Updated:** {Date}

---

## Summary

| Metric | Value |
|--------|-------|
| Total Tasks | {N} |
| Completed | {N} |
| In Progress | {N} |
| Pending | {N} |
| Total Estimate | {N} hours/points |
| Completed | {N} hours/points |
| Remaining | {N} hours/points |

---

## Task Overview

| ID | Task | Feature | Priority | Status | Estimate | Assignee |
|----|------|---------|----------|--------|----------|----------|
| TASK-001 | {Task} | FEAT-001 | P0 | Done | 4h | {Name} |
| TASK-002 | {Task} | FEAT-001 | P0 | In Progress | 8h | {Name} |
| TASK-003 | {Task} | FEAT-001 | P0 | Pending | 2h | - |
| TASK-004 | {Task} | FEAT-002 | P1 | Pending | 4h | - |
| TASK-005 | {Task} | FEAT-002 | P1 | Pending | 6h | - |

---

## Tasks by Feature

### FEAT-001: {Feature Name}

**Feature Progress:** 50% (3/6 tasks)

| ID | Task | Priority | Status | Estimate | Assignee | Completed |
|----|------|----------|--------|----------|----------|-----------|
| TASK-001 | {Task name} | P0 | Done | 4h | {Name} | {Date} |
| TASK-002 | {Task name} | P0 | Done | 2h | {Name} | {Date} |
| TASK-003 | {Task name} | P0 | Done | 6h | {Name} | {Date} |
| TASK-004 | {Task name} | P0 | In Progress | 8h | {Name} | - |
| TASK-005 | {Task name} | P1 | Pending | 4h | - | - |
| TASK-006 | {Task name} | P1 | Pending | 2h | - | - |

---

### FEAT-002: {Feature Name}

**Feature Progress:** 0% (0/4 tasks)

| ID | Task | Priority | Status | Estimate | Assignee | Completed |
|----|------|----------|--------|----------|----------|-----------|
| TASK-007 | {Task name} | P1 | Pending | 4h | - | - |
| TASK-008 | {Task name} | P1 | Pending | 6h | - | - |
| TASK-009 | {Task name} | P2 | Pending | 2h | - | - |
| TASK-010 | {Task name} | P2 | Pending | 4h | - | - |

---

## Tasks by Status

### Pending ({N} tasks)

| ID | Task | Feature | Priority | Estimate |
|----|------|---------|----------|----------|
| TASK-005 | {Task} | FEAT-001 | P1 | 4h |
| TASK-006 | {Task} | FEAT-001 | P1 | 2h |
| TASK-007 | {Task} | FEAT-002 | P1 | 4h |
| TASK-008 | {Task} | FEAT-002 | P1 | 6h |

### In Progress ({N} tasks)

| ID | Task | Feature | Priority | Estimate | Assignee |
|----|------|---------|----------|----------|----------|
| TASK-004 | {Task} | FEAT-001 | P0 | 8h | {Name} |

### Done ({N} tasks)

| ID | Task | Feature | Completed By | Completed On |
|----|------|---------|--------------|--------------|
| TASK-001 | {Task} | FEAT-001 | {Name} | {Date} |
| TASK-002 | {Task} | FEAT-001 | {Name} | {Date} |
| TASK-003 | {Task} | FEAT-001 | {Name} | {Date} |

---

## Tasks by Priority

### P0 - Critical

| ID | Task | Feature | Status | Estimate |
|----|------|---------|--------|----------|
| TASK-004 | {Task} | FEAT-001 | In Progress | 8h |

### P1 - High

| ID | Task | Feature | Status | Estimate |
|----|------|---------|--------|----------|
| TASK-005 | {Task} | FEAT-001 | Pending | 4h |
| TASK-006 | {Task} | FEAT-001 | Pending | 2h |
| TASK-007 | {Task} | FEAT-002 | Pending | 4h |
| TASK-008 | {Task} | FEAT-002 | Pending | 6h |

### P2 - Medium

| ID | Task | Feature | Status | Estimate |
|----|------|---------|--------|----------|
| TASK-009 | {Task} | FEAT-002 | Pending | 2h |
| TASK-010 | {Task} | FEAT-002 | Pending | 4h |

---

## Dependencies

### Task Dependency Graph

```
TASK-001 ──► TASK-002 ──► TASK-004
                │
                ▼
           TASK-003

TASK-004 ──► TASK-005 ──► TASK-006
                            │
TASK-007 ──► TASK-008 ─────┘
```

### Blocked Tasks

| Task | Blocked By | Reason |
|------|------------|--------|
| TASK-005 | TASK-004 | Waiting for completion |
| TASK-006 | TASK-005 | Waiting for TASK-005 |
| TASK-008 | TASK-007 | Waiting for completion |

---

## Unassigned Tasks

| ID | Task | Feature | Priority | Estimate |
|----|------|---------|----------|----------|
| TASK-005 | {Task} | FEAT-001 | P1 | 4h |
| TASK-006 | {Task} | FEAT-001 | P1 | 2h |
| TASK-007 | {Task} | FEAT-002 | P1 | 4h |
| TASK-008 | {Task} | FEAT-002 | P1 | 6h |
| TASK-009 | {Task} | FEAT-002 | P2 | 2h |
| TASK-010 | {Task} | FEAT-002 | P2 | 4h |

---

## Burndown

| Date | Remaining | Completed |
|------|-----------|-----------|
| Day 1 | 42h | 0h |
| Day 2 | 36h | 6h |
| Day 3 | 28h | 8h |
| Day 4 | 28h | 0h |
| Day 5 | 18h | 10h |

---

## Notes

{Additional notes}
>>>>>>> experiment01
