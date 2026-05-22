import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'assets', 'reviews')

/** Unsplash — free to use (Unsplash License) */
const AVATARS = {
  'vesna-kostadinova.jpg': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop&crop=face&q=85',
  'petar-nikolov.jpg': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop&crop=face&q=85',
  'marcus-thompson.jpg': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&h=240&fit=crop&crop=face&q=85',
  'jennifer-walsh.jpg': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&h=240&fit=crop&crop=face&q=85',
  'robert-hayes.jpg': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&h=240&fit=crop&crop=face&q=85',
  'sarah-mitchell.jpg': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&h=240&fit=crop&crop=face&q=85',
  'david-chen.jpg': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&h=240&fit=crop&crop=face&q=85',
  'emily-foster.jpg': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&h=240&fit=crop&crop=face&q=85',
  'james-cooper.jpg': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&h=240&fit=crop&crop=face&q=85',
}

fs.mkdirSync(outDir, { recursive: true })

for (const [file, url] of Object.entries(AVATARS)) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed ${file}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(path.join(outDir, file), buf)
  console.log('OK', file)
}
