# Algorithm-Javascript-Implementation

## Bechmarks of pathfinding algorithms between Array and Binary Heap as Priority Queue

> Following benchmarks are based on travelling through open grids (grids with no obstacles) from 0x0 to WxH

### A\*

| dimension | Array            | Binary Heap |
| --------- | ---------------- | ----------- |
| 100       | 550-570ms        | 10-15ms     |
| 150       | 1600-1650ms      | 30-34ms     |
| 250       | 8000-8200ms      | 65-70ms     |
| 500       | 1 min 24s 162mms | 45-50ms     |
