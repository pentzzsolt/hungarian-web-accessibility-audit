/**
 * Based on: https://www.ksh.hu/osztalyozasok_letszam
 */

const letszam_map = [
  {
    'Kód': '10',
    'Létszám (fő)': '0',
    lower_bound: 0,
    upper_bound: 0,
  },
  {
    'Kód': '11',
    'Létszám (fő)': '1',
    lower_bound: 1,
    upper_bound: 1,
  },
  {
    'Kód': '12',
    'Létszám (fő)': '2',
    lower_bound: 2,
    upper_bound: 2,
  },
  {
    'Kód': '15',
    'Létszám (fő)': '3-4',
    lower_bound: 3,
    upper_bound: 4,
  },
  {
    'Kód': '22',
    'Létszám (fő)': '5-9',
    lower_bound: 5,
    upper_bound: 9,
  },
  {
    'Kód': '30',
    'Létszám (fő)': '10-19',
    lower_bound: 10,
    upper_bound: 19,
  },
  {
    'Kód': '40',
    'Létszám (fő)': '20-49',
    lower_bound: 20,
    upper_bound: 49,
  },
  {
    'Kód': '50',
    'Létszám (fő)': '50-99',
    lower_bound: 50,
    upper_bound: 99,
  },
  {
    'Kód': '61',
    'Létszám (fő)': '100-149',
    lower_bound: 100,
    upper_bound: 149,
  },
  {
    'Kód': '62',
    'Létszám (fő)': '150-199',
    lower_bound: 150,
    upper_bound: 199,
  },
  {
    'Kód': '70',
    'Létszám (fő)': '200-249',
    lower_bound: 200,
    upper_bound: 249,
  },
  {
    'Kód': '81',
    'Létszám (fő)': '250-299',
    lower_bound: 250,
    upper_bound: 299,
  },
  {
    'Kód': '82',
    'Létszám (fő)': '300-499',
    lower_bound: 300,
    upper_bound: 499,
  },
  {
    'Kód': '91',
    'Létszám (fő)': '500-999',
    lower_bound: 500,
    upper_bound: 999,
  },
  {
    'Kód': '93',
    'Létszám (fő)': '1000-1999',
    lower_bound: 1000,
    upper_bound: 1999,
  },
  {
    'Kód': '94',
    'Létszám (fő)': '2000-4999',
    lower_bound: 2000,
    upper_bound: 4999,
  },
  {
    'Kód': '95',
    'Létszám (fő)': '5000-',
    lower_bound: 5000,
    upper_bound: Infinity,
  },
]

export { letszam_map };
