import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv');
const analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8');

const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const analytical_sample_filtered = analytical_sample.filter(filledRow)
console.log(analytical_sample_filtered.every(isRowValid))

function filledRow(row) {
  const a = Boolean(row['Üzemeltető']) && row['Üzemeltető'].length > 0
  return a
}

function isRowValid(row) {
  const date = /^\d{4}-\d{2}-\d{2}$/
  const adoszam = /^\d{8}-\d{1}-\d{2}$/
  const szamjel = /^\d{8} \d{4} \d{3} \d{2}$/

  const a = Boolean(row['Üzemeltető']) && row['Üzemeltető'].length > 0
  let b
  try {
    new URL(row['Forrás (üzemeltető)'])
    b = true
  } catch (e) {
    console.error(e, row['Forrás (üzemeltető)'])
    return false
  }
  const c = date.test(row['Ellenőrzés dátuma (üzemeltető)'])
  const d = adoszam.test(row['Adószám'])
  let e
  try {
    new URL(row['Forrás (adószám)'])
    e = true
  } catch (e) {
    console.error(e, row['Forrás (adószám)'])
    return false
  }
  const f = date.test(row['Ellenőrzés dátuma (adószám)'])
  const g = szamjel.test(row['Statisztikai számjel'])
  const h = date.test(row['Ellenőrzés dátuma (számjel)'])

  const valid = (a && b && c && d && e && f && g && h)
  if (!valid) console.error(row, a, b, c, d, e, f, g, h)
  return valid
}
