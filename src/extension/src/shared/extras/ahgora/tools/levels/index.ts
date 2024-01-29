import { GCLevel } from "./types";

export const gcLevelsMap: Record<string | number, GCLevel> = {
  0: {
    minRating: 0,
    maxRating: 1000,
    color: '#000000',
    level: 0,
  },
  1: {
    minRating: 1001,
    maxRating: 1056,
    color: '#643284',
    level: 1,
  },
  2: {
    minRating: 1057,
    maxRating: 1116,
    color: '#5c2d84',
    level: 2,
  },
  3: {
    minRating: 1117,
    maxRating: 1179,
    color: '#532883',
    level: 3,
  },
  4: {
    minRating: 1180,
    maxRating: 1246,
    color: '#492381',
    level: 4,
  },
  5: {
    minRating: 1247,
    maxRating: 1316,
    color: '#402686',
    level: 5,
  },
  6: {
    minRating: 1317,
    maxRating: 1390,
    color: '#2d3a8a',
    level: 6,
  },
  7: {
    minRating: 1391,
    maxRating: 1469,
    color: '#2967b0',
    level: 7,
  },
  8: {
    minRating: 1470,
    maxRating: 1552,
    color: '#2967b0',
    level: 8,
  },
  9: {
    minRating: 1553,
    maxRating: 1639,
    color: '#2a7bc2',
    level: 9,
  },
  10: {
    minRating: 1640,
    maxRating: 1732,
    color: '#2a8acc',
    level: 10,
  },
  11: {
    minRating: 1733,
    maxRating: 1830,
    color: '#3e9cb7',
    level: 11,
  },
  12: {
    minRating: 1831,
    maxRating: 1933,
    color: '#53a18b',
    level: 12,
  },
  13: {
    minRating: 1934,
    maxRating: 2042,
    color: '#68a761',
    level: 13,
  },
  14: {
    minRating: 2043,
    maxRating: 2158,
    color: '#7cac35',
    level: 14,
  },
  15: {
    minRating: 2159,
    maxRating: 2280,
    color: '#91b20a',
    level: 15,
  },
  16: {
    minRating: 2281,
    maxRating: 2408,
    color: '#bdb700',
    level: 16,
  },
  17: {
    minRating: 2409,
    maxRating: 2544,
    color: '#f0bc00',
    level: 17,
  },
  18: {
    minRating: 2545,
    maxRating: 2688,
    color: '#f89a06',
    level: 18,
  },
  19: {
    minRating: 2689,
    maxRating: 2840,
    color: '#f46e12',
    level: 19,
  },
  20: {
    minRating: 2841,
    maxRating: 2999,
    color: '#eb2f2f',
    level: 20,
  },
  21: {
    minRating: 3000,
    maxRating: Infinity,
    color: '#ff00c0',
    level: 21,
  },


}