import { get, find, addRange, add, update, deleteOne, findByName } from './Context'

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
