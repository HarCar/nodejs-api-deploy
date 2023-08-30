import { GetUsers } from '../user_list.js'

const userList = GetUsers()

export const userModel = {
  get: function ({ name, email, rol, age }) {
    let dataFilter = userList

    if (name) {
      dataFilter = dataFilter.filter(user => user.name === name)
    }

    if (email) {
      dataFilter = dataFilter.filter(user => user.email === email)
    }

    if (rol) {
      dataFilter = dataFilter.filter(user => user.rol === rol)
    }

    if (age) {
      dataFilter = dataFilter.filter(user => user.age === parseInt(age))
    }

    return dataFilter
  },

  find: function ({ id }) {
    return userList.find(user => user.id === parseInt(id))
  },

  insert: function (objet) {
    // todo pasar aqui validaciones
    userList.push(objet)
    return objet
  },

  update: function ({ id, objet }) {
    // todo pasar aqui validaciones
    const userIndex = userList.findIndex(user => user.id === id)

    if (userIndex === -1) { return null }

    userList[userIndex] = objet
    userList[userIndex].id = id

    return objet
  }

}
