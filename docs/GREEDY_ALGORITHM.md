# NEXUS — Greedy Algorithm

Located in: `apps/api/src/services/greedy.service.ts`

## What it does

Finds the optimal supply chain path for a given tender, scored across
price, risk, compliance, insurance, and reputation.

## Scoring Formula

```
NodeScore = (
  priceScore      × 0.35
  riskScore       × 0.25
  complianceScore × 0.20
  insuranceScore  × 0.10
  reputationScore × 0.10
)

PathScore = mean(NodeScores) - penalties
```

## Penalties

- Missing ISO 9001 certification: -10 per node
- Regulatory mismatch: -15
- Transit country risk: -5

## Steps

1. Load all nodes with REPLIED quotes for the tender
2. Build directed graph based on VALID_CONNECTIONS map
3. DFS to find all complete source-to-terminal paths
4. Score each path
5. Sort by score descending, save top 3 to DB
6. Mark best path as is_greedy_optimal = true
7. Update tender status to OPTIMAL_FOUND

## Adjusting Weights

To change scoring weights, edit the multipliers in `scorePath()`.
The weights must sum to 1.0.

## Valid Connection Types

```
GAS_SOURCE   -> TRADER | LIQUEFACTION
TRADER       -> LIQUEFACTION
LIQUEFACTION -> TRANSPORT
TRANSPORT    -> REGASIFICATION | STORAGE
REGASIFICATION -> (end)
STORAGE        -> (end)
```
