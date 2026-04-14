/**
 * Based on: https://www.ksh.hu/osztalyozasok_arbevetel
 */

const arbevetel_map = [
  {
    'Kód': '1',
    'Millió Ft': '0 - 20',
    lower_bound: 0,
    upper_bound: 20999999,
  },
  {
    'Kód': '2',
    'Millió Ft': '21 - 50',
    lower_bound: 21000000,
    upper_bound: 50999999,
  },
  {
    'Kód': '3',
    'Millió Ft': '51 - 300',
    lower_bound: 51000000,
    upper_bound: 300999999,
  },
  {
    'Kód': '4',
    'Millió Ft': '301 - 500',
    lower_bound: 301000000,
    upper_bound: 500999999,
  },
  {
    'Kód': '5',
    'Millió Ft': '501 - 700',
    lower_bound: 501000000,
    upper_bound: 700999999,
  },
  {
    'Kód': '6',
    'Millió Ft': '701 - 1000',
    lower_bound: 701000000,
    upper_bound: 1000999999,
  },
  {
    'Kód': '7',
    'Millió Ft': '1001 - 2500',
    lower_bound: 1001000000,
    upper_bound: 2500999999,
  },
  {
    'Kód': '8',
    'Millió Ft': '2501 - 4000',
    lower_bound: 2501000000,
    upper_bound: 4000999999,
  },
  {
    'Kód': 'A',
    'Millió Ft': '4001 - 7000',
    lower_bound: 4001000000,
    upper_bound: 7000999999,
  },
  {
    'Kód': 'B',
    'Millió Ft': '7001 - 10000',
    lower_bound: 7001000000,
    upper_bound: 10000999999,
  },
  {
    'Kód': 'C',
    'Millió Ft': '10001 -',
    lower_bound: 10001000000,
    upper_bound: Infinity,
  }
]

export { arbevetel_map };
