import { MongoClient, ObjectId } from 'mongodb'
import process from 'node:process'
import session from 'express-session'
import MongoDBStore from 'express-mongodb-session'

const uri = process.env.URLDB ?? 'mongodb://127.0.0.1:27017'
const uriSession = uri.replace('?retryWrites=true&w=majority', 'IsavConfig?retryWrites=true&w=majority')
const client2 = new MongoClient(uri)

export function GetStore () {
  const MongoDBStoreSession = MongoDBStore(session)
  return new MongoDBStoreSession({
    uri: uriSession,
    collection: 'SessionsData'
  })
}

export class Context {
  constructor () {
    this.client = new MongoClient(uri)
    this.connectedDatabase = false
  }

  async connect () {
    try {
      await this.client.connect()
      this.connectedDatabase = true
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error)
    }
  }

  async closeConnection () {
    await this.client.close()
    this.connectedDatabase = false
    console.log('Conexión cerrada correctamente')
  }

  getConnection () {
    return this.client
  }
}

// Crear un pool de conexiones
const connectionPromise = client2.connect()

async function getCollection ({ DatabaseName, collecition }) {
  const client = await connectionPromise
  const database = client.db(DatabaseName)
  return database.collection(collecition)
}
export async function get ({ collecition }) {
  const collection = await getCollection(collecition)
  const data = await collection.find({}).toArray()
  return data
}

export async function find ({ id, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  const data = await collection.findOne({ _id })
  return data
}

export async function findByName ({ name, collecition }) {
  const collection = await getCollection(collecition)
  const data = await collection.findOne({ name })
  if (data == null) {
    const record = {
      name,
      email: 'Admin@example.com',
      rol: 'Admin',
      age: 30
    }
    await add({ record, collecition })
    return record
  }
  return data
}

export async function addRange ({ records, collecition }) {
  const collection = await getCollection(collecition)
  return await collection.insertMany(records)
}

export async function add ({ record, collecition }) {
  const collection = await getCollection(collecition)
  return await collection.insertOne(record)
}

export async function update ({ id, record, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  return await collection.updateOne({ _id }, { $set: record })
}

export async function deleteOne ({ id, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  return await collection.deleteOne({ _id })
}
