import { Enemy } from "./enemy.js";
import { ZigzagEnemy } from "./zigzagEnemy.js";
import { LustyEnemy } from "./lustyEnemy.js";

export const enemyTypeList = [
  { type: Enemy, maxSize: 10 },
  { type: ZigzagEnemy, maxSize: 10 },
  { type: LustyEnemy, maxSize: 10 },
];
