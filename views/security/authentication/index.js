const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signIn = document.getElementById('call-sign-in');
const signUp = document.getElementById('call-sign-up');
const passwordReset = document.getElementById('passwordReset');
const controller = 'authentication'

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.addEventListener("DOMContentLoaded", () => {
	console.log("Hello World!");
});


signIn.addEventListener('click', (event) => {
	event.preventDefault();
	const parameters =  {};
	const formulario = document.getElementById('form-sign-in');
	const datosFormulario = new FormData(formulario)
	
	datosFormulario.forEach((valor, clave) => {
		parameters[clave] = valor
	})
	const opciones = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(parameters)
	};

	fetch(`${controller}/SignIn`, opciones)
    .then(response => {
        return response.json();
    })
    .then(response => {
        if (response.success) {
            //formulario.reset();			
			if (response.redirect) {
				location.href = response.url		
			}
			else if (response.emailVerified) {
				location.href = '/'			
			} else {
				document.querySelector('form#form-sign-in p.error').innerHTML = ''
				document.querySelector('form#form-sign-in p.info').innerHTML = response.message
			}
        } else {
            document.querySelector('form#form-sign-in p.info').innerHTML = ''
            document.querySelector('form#form-sign-in p.error').innerHTML = response.message
        }
    })
    .catch(error => {
        // Manejo de errores generales
        alert('Error en la petición:', error);
    });
});

signUp.addEventListener('click', (event) => {
	event.preventDefault();
	const parameters =  {};
	const formulario = document.getElementById('form-sign-up');
	const datosFormulario = new FormData(formulario)
	
	datosFormulario.forEach((valor, clave) => {
		parameters[clave] = valor
	})
	const opciones = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(parameters)
	};

	fetch(`${controller}/signUp`, opciones)
    .then(response => {
        return response.json();
    })
    .then(response => {
        if (response.success) {
			formulario.reset();
			document.querySelector('form#form-sign-up p.error').innerHTML = ''
            document.querySelector('form#form-sign-up p.info').innerHTML = response.message
        } else {
			document.querySelector('form#form-sign-up p.info').innerHTML = ''
            document.querySelector('form#form-sign-up p.error').innerHTML = response.message
        }
    })
    .catch(error => {
        // Manejo de errores generales
        alert('Error en la petición:', error);
    });
});

passwordReset.addEventListener('click', (event) => {
	event.preventDefault();
	const parameters =  {};
	const formulario = document.getElementById('form-sign-in');
	const datosFormulario = new FormData(formulario)
	
	datosFormulario.forEach((valor, clave) => {
		parameters[clave] = valor
	})
	const opciones = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(parameters)
	};

	fetch(`${controller}/passwordReset`, opciones)
    .then(response => {
        return response.json();
    })
    .then(response => {
        if (response.success) {
			document.querySelector('form#form-sign-in p.error').innerHTML = ''
            document.querySelector('form#form-sign-in p.info').innerHTML = response.message
        } else {
			document.querySelector('form#form-sign-in p.info').innerHTML = ''
            document.querySelector('form#form-sign-in p.error').innerHTML = response.message
        }
    })
    .catch(error => {
        // Manejo de errores generales
        alert('Error en la petición:', error);
    });
});

// let mediaRecorder;
// let recordedChunks = [];

// navigator.mediaDevices.getDisplayMedia({ video:true, audio: true })
//   .then(function(stream) {
//     mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.ondataavailable = function(event) {
//       if (event.data.size > 0) {
//         recordedChunks.push(event.data);
//       }
//     };
	
// 	mediaRecorder.onstop = function() {
// 		console.log('onstop')
// 		const blob = new Blob(recordedChunks, { type: 'video/webm' });
// 		const url = URL.createObjectURL(blob);
// 		const a = document.createElement('a');
// 		a.href = url;
// 		a.download = 'video.webm';
// 		a.click();
// 		URL.revokeObjectURL(url);    
// 	};
//   })
//   .catch(function(err) {
//     console.error("Error al acceder al dispositivo de medios: ", err);
//   });

// navigator.mediaDevices.getUserMedia({ video: false, audio: true })
//   .then(function(stream) {
//     mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.ondataavailable = function(event) {
//       if (event.data.size > 0) {
//         recordedChunks.push(event.data);
//       }
//     };
	
// 	mediaRecorder.onstop = function() {
// 		const blob = new Blob(recordedChunks, { type: 'video/webm' });
// 		const url = URL.createObjectURL(blob);
// 		const a = document.createElement('a');
// 		a.href = url;
// 		a.download = 'video.webm';
// 		a.click();
// 		URL.revokeObjectURL(url);    
// 	};
//   })
//   .catch(function(err) {
//     console.error("Error al acceder al dispositivo de medios: ", err);
//   });