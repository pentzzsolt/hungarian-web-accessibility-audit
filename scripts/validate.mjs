import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { parse } from 'csv-parse/sync'

const analytical_sample_file_path = resolve('data/processed/analytical_sample.csv');
const analytical_sample_file = await readFile(analytical_sample_file_path, 'utf8');

const analytical_sample = parse(analytical_sample_file, {
  columns: true
})

const analytical_sample_filtered = analytical_sample.filter(filledRow)

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
    b = false
  }
  const c = date.test(row['Ellenőrzés dátuma (üzemeltető)'])
  const d = adoszam.test(row['Adószám'])
  let e
  try {
    new URL(row['Forrás (adószám)'])
    e = true
  } catch (e) {
    e = false
  }
  const f = date.test(row['Ellenőrzés dátuma (adószám)'])
  const g = szamjel.test(row['Statisztikai számjel'])
  const h = date.test(row['Ellenőrzés dátuma (számjel)'])

  const [torzsszam1] = row['Adószám'].split('-');
  const [torzsszam2] = row['Statisztikai számjel'].split(' ');

  const i = torzsszam1 === torzsszam2;

  const valid = (a && b && c && d && e && f && g && h && i)
  if (!valid) {
    console.error(`${row.Domain} is invalid.`)
    if (!a) {
      console.error(`Üzemeltető is ${row['Üzemeltető']}.`)
    }
    if (!b) {
      console.error(`Forrás (üzemeltető) is ${row['Forrás (üzemeltető)']}.`)
    }
    if (!c) {
      console.error(`Ellenőrzés dátuma (üzemeltető) is ${row['Ellenőrzés dátuma (üzemeltető)']}.`)
    }
    if (!d) {
      console.error(`Adószám is ${row['Adószám']}.`)
    }
    if (!e) {
      console.error(`Forrás (adószám) is ${row['Forrás (adószám)']}.`)
    }
    if (!f) {
      console.error(`Ellenőrzés dátuma (adószám) is ${row['Ellenőrzés dátuma (adószám)']}.`)
    }
    if (!g) {
      console.error(`Statisztikai számjel is ${row['Statisztikai számjel']}.`)
    }
    if (!h) {
      console.error(`Ellenőrzés dátuma (számjel) is ${row['Ellenőrzés dátuma (számjel)']}.`)
    }
    if (!i) {
      console.error(`Törzsszám mismatch in Adószám (${row['Adószám']}) and Statisztikai számjel(${row['Statisztikai számjel']}).`)
    }
  }
  return valid
}

const done = analytical_sample_filtered.length,
      all = analytical_sample.length,
      left = all - done,
      percentage = Math.round(done / all * 100);

if (analytical_sample_filtered.every(isRowValid)) {
  console.log('All rows are valid.');
}

console.log(`${done} of ${all} done (${percentage}%), ${left} to go.`);

