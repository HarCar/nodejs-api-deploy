import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.URLDB ?? 'mongodb+srv://harvycardoza:Gy3hsDPKwxlO9dNz@development.dspmilv.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri)

// Crear un pool de conexiones
const connectionPromise = client.connect()

async function getCollection(collecition) {
  const client = await connectionPromise
  const database = client.db('isav')
  return database.collection(collecition)
}
async function get({ collecition }) {
  const collection = await getCollection(collecition)
  const data = await collection.find({}).toArray()
  return data
}

async function find({ id, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  const data = await collection.findOne({ _id })
  return data
}

async function findByName({ name, collecition }) {
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

async function addRange({ records, collecition }) {
  const collection = await getCollection(collecition)
  return await collection.insertMany(records)
}

async function add({ record, collecition }) {
  const collection = await getCollection(collecition)
  return await collection.insertOne(record)
}

async function update({ id, record, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  return await collection.updateOne({ _id }, { $set: record })
}

async function deleteOne({ id, collecition }) {
  const collection = await getCollection(collecition)
  const _id = new ObjectId(id)
  return await collection.deleteOne({ _id })
}

export const Contex = {
  Users: {
    collectionName: 'Users',
    get: async () => {
      return await get({ collecition: Contex.Users.collectionName })
    },
    find: async ({ id }) => {
      return await find({ id, collecition: Contex.Users.collectionName })
    },
    addRange: async ({ records }) => {
      return await addRange({ records, collecition: Contex.Users.collectionName })
    },
    add: async ({ record }) => {
      return await add({ record, collecition: Contex.Users.collectionName })
    },
    update: async ({ id, objet }) => {
      return await update({ id, record: objet, collecition: Contex.Users.collectionName })
    },
    deleteOne: async ({ id }) => {
      return await deleteOne({ id, collecition: Contex.Users.collectionName })
    }
  },
  Licenses: {
    collectionName: 'licenses',
    get: async () => {
      return await get({ collecition: Contex.Licenses.collectionName })
    },
    find: async ({ id }) => {
      return await find({ id, collecition: Contex.Licenses.collectionName })
    },
    findByName: async ({ name }) => {
      return await findByName({ name, collecition: Contex.Licenses.collectionName })
    },
    addRange: async ({ records }) => {
      return await addRange({ records, collecition: Contex.Licenses.collectionName })
    },
    add: async ({ record }) => {
      return await add({ record, collecition: Contex.Licenses.collectionName })
    },
    update: async ({ id, objet }) => {
      return await update({ id, record: objet, collecition: Contex.Licenses.collectionName })
    },
    deleteOne: async ({ id }) => {
      return await deleteOne({ id, collecition: Contex.Licenses.collectionName })
    }
  }
}
