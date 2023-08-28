const formulario = document.getElementById('formulario')
const listaTareas = document.getElementById('lista-tareas')
const template = document.getElementById('template').content //Content es para obtener solo su contenido, excluyendo el nombre de la etiqueta
const fragment = document.createDocumentFragment()

// Variable Global para las tareas, guardada como objeto
let tareas = {}

// Agregamos eventos
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('tareas')){
        tareas = JSON.parse(localStorage.getItem('tareas'))
    }
    pintarTareas()
})

formulario.addEventListener('submit', e => {
    e.preventDefault()
    setTarea(e)
})

listaTareas.addEventListener('click', e => {
    btnAcciones(e)
})

const btnAcciones = e => {
    if(e.target.classList.contains('fa-circle-check')){
        tareas[e.target.dataset.id].estado = true
        pintarTareas()
    }
    if(e.target.classList.contains('fa-undo-alt')){
        tareas[e.target.dataset.id].estado = false
        pintarTareas()
    }
    if(e.target.classList.contains('fa-circle-minus')){
        delete tareas[e.target.dataset.id]
        pintarTareas()
    }
}

const setTarea = e => {
    const texto = e.target.querySelector('input').value

    if(texto.trim() === '') {
        alert('Tarea Vacia')
        return
    }

    const tarea = {
        id: Date.now(),
        texto, 
        estado: false //False indica que no está terminada la tarea
    }

    tareas[tarea.id] = tarea
    pintarTareas()
    formulario.reset()
    e.target.querySelector('input').focus()
}

const pintarTareas = () => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
    if (Object.values(tareas).length === 0){
        listaTareas.innerHTML = `
            <div class="alert alert-dark">
                No task pending
            </div>
        `
        return
    }
    listaTareas.innerHTML = ''
    Object.values(tareas).forEach((tarea) => {
        const clone = template.cloneNode(true)
        clone.querySelector('p').textContent = tarea.texto
        if(tarea.estado) {
            clone.querySelectorAll('.fa-solid')[0].classList.replace('fa-circle-check', 'fa-undo-alt') //Icono izquierdo es actual, icono derecho con la que se reemplazará
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary')
            clone.querySelector('p').style.textDecoration = 'line-through'
        }
        clone.querySelectorAll('.fa-solid')[0].dataset.id = tarea.id //Un querySelectorAll obtiene todas las clases que pongamos entre ('')
        clone.querySelectorAll('.fa-solid')[1].dataset.id = tarea.id 
        fragment.appendChild(clone)
    })
    listaTareas.appendChild(fragment)
}