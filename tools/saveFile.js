import { writeFile } from 'node:fs/promises'

export const saveFile = async ({ objet }) => {
  const date = new Date()
  const fileName = String(date.getFullYear()) + String(date.getMonth() + 1) + String(date.getHours()) + String(date.getMinutes()) + String(date.getSeconds()) + '.json'
  const cadenaJSON = JSON.stringify(objet, null, 2) // null y 2 para formato y espaciado
  await writeFile('./' + fileName, cadenaJSON, 'utf8')
}
