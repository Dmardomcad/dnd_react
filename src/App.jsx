import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const App = () => {
  const tareasInitialState = JSON.parse(localStorage.getItem('tareas')) || []
  const tareaInitialState = {
    nombre: '',
    descripcion: '',
    estado: false,
    prioridad: false,
  }
  const [tareas, setTareas] = useState(tareasInitialState)
  const [tarea, setTarea] = useState(tareaInitialState)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [id, setId] = useState('')

  // Funciones
    const agregarTarea = e => {
      e.preventDefault()
      if (!tarea.nombre.trim()) {
        e.target[0].focus()
        Swal.fire({
          title: 'Error',
          text: 'El campo nombre es obligatorio',
          icon: 'error',
        })
        return
      }
      if (!tarea.descripcion.trim()) {
        e.target[0].focus()
        Swal.fire({
          title: 'Error',
          text: 'El campo descripción es obligatorio',
          icon: 'error',
        })
        return
      }
      Swal.fire({
        title: 'Éxito',
        text: 'Tarea agregada con éxito',
        icon: 'success',
      })
      setTareas([...tareas, tarea])
      setTarea(tareaInitialState)
    }

    const reorder = (startIndex, endIndex) => {
      const result = [...tareas];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      setTareas(result);
    };

    const eliminarTarea = id => {
      setTareas(tareas.filter(item => item.id !== id))
    }

    const finalizarTarea = id => {
      setTareas(
        tareas.map(item =>
          item.id === id ? { ...item, estado: !item.estado } : item
        )
      )
    }

    const activarModoEdicion = item => {
      setModoEdicion(true)
      setTarea(item)
      setId(item.id)
    }

    const editar = e => {
      e.preventDefault()
      if (!tarea.nombre.trim()) {
        e.target[0].focus()
        Swal.fire({
          title: 'Error',
          text: 'El campo nombre es obligatorio',
          icon: 'error',
        })
        return
      }
      if (!tarea.descripcion.trim()) {
        e.target[1].focus()
        Swal.fire({
          title: 'Error',
          text: 'El campo descripción es obligatorio',
          icon: 'error',
        })
        return
      }
      const arrayEditado = tareas.map(item =>
        item.id === id
          ? {
              id: id,
              nombre: tarea.nombre,
              descripcion: tarea.descripcion,
              prioridad: tarea.prioridad,
            }
          : item
      )

      Swal.fire({
        title: 'Éxito',
        text: 'Tarea actualizada con éxito',
        icon: 'success',
      })
      setTareas(arrayEditado)
      setTarea(tareaInitialState)
      setModoEdicion(false)
    }

    const handleChange = e => {
      setTarea({
        ...tarea,
        [e.target.name]:
          e.target.type === 'checkbox' ? e.target.checked : e.target.value,
        id: Date.now(),
      })
      console.log(tarea)
    }

    const handleonDragEnd = (result) => {
      const { destination, source } = result;
      if (!destination) return;
      const startIndex = source.index;
      const endIndex = destination.index;

      reorder(startIndex, endIndex);
    };

    useEffect(() => {
      localStorage.setItem('tareas', JSON.stringify(tareas))
    }, [tareas])

    return (
      <div className='container mt-4'>
        <h1 className='text-center'>Tareas App</h1>
        <hr />
        <div className='row mt-2'>
          <div className='col-8'>
            <DragDropContext onDragEnd={handleonDragEnd}>
              <h4 className='text-center'>Lista tareas</h4>
              <Droppable droppableId="droppable-1">
                {(droppableProvided) => (
                  <ul className='class="list-group' ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}>
                    {tareas.map((item, index) => (
                      <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                        {(dragableProvided) => (
                          <li
                            key={index}
                            className='list-group-item d-flex justify-content-between'
                            ref={dragableProvided.innerRef}
                            {...dragableProvided.draggableProps}
                            {...dragableProvided.dragHandleProps}
                          >
                            <div
                              className={item.estado ? 'text-decoration-line-through' : ''}
                            >
                              <div
                                className={
                                  item.prioridad
                                    ? 'fw-bold  d-flex align-items-start text-danger'
                                    : 'fw-bold  d-flex align-items-start'
                                }
                              >
                                {item.nombre}
                              </div>
                              <p>{item.descripcion}</p>
                            </div>

                            <div className='d-flex justify-content-end align-items-center'>
                              <button
                                type='button'
                                className='btn btn-secondary me-2 btn-sm float-end'
                                onClick={() => finalizarTarea(item.id)}
                              >
                                {item.estado ? 'Activar' : 'Finalizar'}
                              </button>
                              <button
                                className='btn btn-warning me-2 btn-sm float-end'
                                onClick={() => activarModoEdicion(item)}
                              >
                                Editar
                              </button>
                              <button
                                className='btn btn-danger me-2 btn-sm float-end'
                                onClick={e => eliminarTarea(item.id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className='col-4'>
            <h4 className='text-center'>
              {modoEdicion ? 'Editar Tarea' : 'Agregar tareas'}
            </h4>
            <form onSubmit={modoEdicion ? editar : agregarTarea}>
              <input
                name='nombre'
                type='text'
                className='form-control mb-2'
                placeholder='Introduce el nombre de la tarea'
                onChange={e => handleChange(e)}
                value={tarea.nombre}
              />
              <textarea
                name='descripcion'
                type='text'
                className='form-control mb-2'
                placeholder='Introduce la descripción de la tarea'
                onChange={e => handleChange(e)}
                value={tarea.descripcion}
              />
              <div className='form-check mb-2'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='prioridad'
                  checked={tarea.prioridad}
                  onChange={e => handleChange(e)}
                />
                <label className='form-check-label' htmlFor='flexCheckDefault'>
                  Prioridad
                </label>
              </div>
              {modoEdicion ? (
                <button className='btn btn-warning w-100 mt-2'>
                  Guardar Cambios
                </button>
              ) : (
                <button className='btn btn-dark w-100 mt-2'>Agregar</button>
              )}
            </form>
          </div>
        </div>
      </div>
    )
  }

  export default App
