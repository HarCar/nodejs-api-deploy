const resources = {
	en: {
		authentication: "Authentication",
		authentication_environment_not_configured: "Authentication environment not configured",
		caption: "Name",
		code: "Code",
		email: "Email",
		email_already_in_use: "Email already in use.",
		email_not_registered: "The email is not registered in the authentication database.",
		email_or_password_incorrect: "The email or password is incorrect.",
		in_use: "is already in use",
		inactive: "Inactive",
		invalid: "is invalid",
		logout_error: "Logout error:",
		name: "Name",
		max: "cannot be more than",
		min: "must be at least",
		not_found: "not found",
		password: "Password",
		password_reset_email_sent: "A password reset email has been sent.",
		required: "is required",
		role: "Role",
		verification_sent_to: "A verification was sent to email to activate the account",
		welcome: "Welcome!",
		goodbye: "Goodbye!",
		weakPassword: "The password is too weak. It must be at least 6 characters long.",
		invalidEmail: "The value provided for the property email is invalid.",
		tooManyRequests: "The number of requests exceeds the maximum allowed.",
		invalidOrExpiredSession: "Invalid or expired session.",
	},
	es: {
		authentication: "Autenticación",
		authentication_environment_not_configured: "entorno de autenticación no configurado",
		caption: "Nombre",
		code: "Código",
		email: "Correo electrónico",
		email_already_in_use: "Correo electrónico ya en uso",
		email_not_registered: "El correo electrónico no está registrado en la base de datos de autenticación.",
		email_or_password_incorrect: "El correo electrónico o la contraseña son incorrectos.",
		in_use: "ya está en uso",
		inactive: "Inactivo",
		invalid: "es invalido",
		logout_error: "Error al cerrar sesión:",
		name: "Nombre",
		max: "no puede ser más de",
		min: "debe ser al menos",
		not_found: "no se encontró",
		password: "Contraseña",
		password_reset_email_sent: "Se ha enviado un correo electrónico de restablecimiento de contraseña.",
		required: "es requerido",
		role: "Rol",
		verification_sent_to: "Se envió una verificación al correo electrónico para activar la cuenta",
		welcome: "¡Bienvenido!",
		goodbye: "¡Adiós!",
		weakPassword: "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.",
		invalidEmail: "El valor que se proporcionó para la propiedad del correo no es válido.",
		tooManyRequests: "La cantidad de solicitudes supera el máximo permitido.",
		invalidOrExpiredSession: "Sesión no válida o expirada.",
	},
}

const t = (lang, value) => {
	if (resources[lang] && resources[lang][value]) {
		return resources[lang][value]
	} else {
		return `Texto no encontrado para el idioma "${lang}" y clave "${value}"`
	}
}

export default t
