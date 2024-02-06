// session.js

export class SessionData {
  static propertyEmailVerified = 'emailVerified'
  static propertyEmail = 'email'
  static propertyName = 'name'
  static propertyUid = 'uid'
  static propertyLastLoginDateTime = 'lastLoginDateTime'
  static propertyViews = 'views'

  constructor () {
    this.sessionData = {}
  }

  set (key, value) {
    this.sessionData[key] = value
  }

  get (key) {
    return this.sessionData[key]
  }

  getAll () {
    return { ...this.sessionData }
  }

  clear () {
    this.sessionData = {}
  }
}
