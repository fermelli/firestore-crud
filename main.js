// firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js';
// firestore
import {
	getFirestore,
	collection,
	getDocs,
	addDoc,
	getDoc,
	doc,
	setDoc,
	deleteDoc,
} from 'https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js';

const firebaseConfig = {
	// firebaseConfig
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let accion = 'Guardar';

async function getMaterias() {
	const materiasCol = collection(db, 'materias');
	const materiasSnapshot = await getDocs(materiasCol);
	const tbody = document.getElementById('tbody');
	tbody.innerHTML = '';
	let index = 0;

	if (materiasSnapshot.empty) {
		const tr = document.createElement('tr');
		const celda = `
             <td colspan="8"><span class="mensaje">No hay materias registradas</span></td>
         `;
		tr.innerHTML += celda;
		tbody.append(tr);
	}

	materiasSnapshot.forEach((doc) => {
		index += 1;
		const materia = doc.data();
		let id = doc.id;
		const tr = document.createElement('tr');
		const celdas = `
             <td>${index}</td>
             <td>${materia.sigla}</td>
             <td>${materia.nombre}</td>
             <td>${materia.contenido}</td>
             <td>${materia.profesor}</td>
             <td>${materia.curso}</td>
             <td><button class="btn-edit" data-id="${id}">Editar</button></td>
             <td><button class="btn-delete" data-id="${id}">Eliminar</button></td>
         `;
		tr.innerHTML += celdas;
		tbody.append(tr);
	});

	document.querySelectorAll('.btn-edit').forEach(function (boton) {
		boton.addEventListener('click', function (event) {
			let id = boton.dataset.id;
			getMateria(id);
		});
	});

	document.querySelectorAll('.btn-delete').forEach(function (boton) {
		boton.addEventListener('click', function (event) {
			let id = boton.dataset.id;
			if (confirm('¿Seguro que desea eliminar la materia?')) {
				deleteMateria(id);
			}
		});
	});
}

async function addMateria(data) {
	try {
		const docRef = await addDoc(collection(db, 'materias'), data);
		getMaterias();
	} catch (e) {
		console.error('Error al agregar documento: ', e);
	}
}

async function getMateria(id) {
	const docRef = doc(db, 'materias', id);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		accion = 'Actualizar';
		document.getElementById('modal').style.display = 'block';
		const materia = docSnap.data();
		const form = document.getElementById('form');
		form.id.value = id;
		form.sigla.value = materia.sigla;
		form.nombre.value = materia.nombre;
		form.contenido.value = materia.contenido;
		form.profesor.value = materia.profesor;
		form.curso.value = materia.curso;
		form.submit.value = accion;
	} else {
		console.log('¡No hay tal documento!');
	}
}

async function editMateria(id, data) {
	try {
		await setDoc(doc(db, 'materias', id), data);
		accion = 'Guardar';
		getMaterias();
	} catch (e) {
		console.error('Error al editar el documento: ', e);
	}
}

async function deleteMateria(id) {
	try {
		await deleteDoc(doc(db, 'materias', id));
		getMaterias();
	} catch (e) {
		console.error('Error al eliminar el documento: ', e);
	}
}

window.onload = function () {
	getMaterias();

	document
		.getElementById('btn-nuevo')
		.addEventListener('click', function (event) {
			accion = 'Guardar';
			document.getElementById('submit').value = accion;
			document.getElementById('modal').style.display = 'block';
		});

	document
		.getElementById('btn-cerrar')
		.addEventListener('click', function (event) {
			document.getElementById('form').reset();
			document.getElementById('modal').style.display = 'none';
		});

	document
		.getElementById('form')
		.addEventListener('submit', function (event) {
			event.preventDefault();
			const form = event.target;

			const data = {
				sigla: form.sigla.value,
				nombre: form.nombre.value,
				contenido: form.contenido.value,
				profesor: form.profesor.value,
				curso: form.curso.value,
			};

			form.reset();

			if (accion == 'Guardar') {
				addMateria(data);
			}

			if (accion == 'Actualizar') {
				let id = form.id.value;
				editMateria(id, data);
			}

			document.getElementById('modal').style.display = 'none';
		});
};
