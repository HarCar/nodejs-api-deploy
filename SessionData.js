export class SessionData {
	static propertyEmailVerified = "emailVerified"
	static propertyEmail = "email"
	static propertyName = "name"
	static propertyUid = "uid"
	static propertyLastLoginDateTime = "lastLoginDateTime"

	static propertyCompany = "company"
	static propertyUserGroup = "userGroup"

	set(key, value) {
		this[key] = value
	}

	get(key) {
		return this[key]
	}

	// getAll () {
	//   return { ...this.sessionData }
	// }

	// clear () {
	//   this.sessionData = {}
	// }
}
