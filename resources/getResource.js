import path from 'node:path'
import { readFile } from 'node:fs/promises'

export const getResource = async ({ languageCode, field, text }) => {
  const filePath = path.join(path.resolve(), 'resources', field + '_' + languageCode + '.json')
  const rawRresource = await readFile(filePath, 'utf-8')
  const resource = JSON.parse(rawRresource)
  return resource[text]
}

export const getResourceTwoParameters = async ({ languageCode, field, text, parameter1, parameter2 }) => {
  const filePath = path.join(path.resolve(), 'resources', field + '_' + languageCode + '.json')
  const rawRresource = await readFile(filePath, 'utf-8')
  const resource = JSON.parse(rawRresource)
  const message = resource[text]
  return message.replace('{0}', parameter1).replace('{1}', parameter2)
}
