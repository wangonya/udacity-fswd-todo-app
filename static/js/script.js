console.log('Welcome to Flask Todos!')

// add new todo item
document.getElementById('todo-form').onsubmit = (e) => {
  e.preventDefault()
  fetch('/todos/create', {
    method: 'POST',
    body: JSON.stringify({
      'description': document.getElementById('todo-description').value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {return response.json()})
    .then((jsonResponse) => {
      const todoList = document.getElementById('todos')
      const liItem = document.createElement('LI')
      liItem.innerHTML = jsonResponse['description']
      const checkBox = document.createElement('input')
      checkBox.type = "checkbox"
      checkBox.name = "check-done"
      checkBox.id = "check-done"
      checkBox.setAttribute('data-id', jsonResponse['id'])
      liItem.prepend(checkBox)
      const deleteButton = document.createElement('button')
      deleteButton.innerHTML = '&cross;'
      deleteButton.setAttribute('onclick', `deleteTodo(${jsonResponse['id']})`)
      liItem.append(deleteButton)
      todoList.appendChild(liItem)
      completeTodos()
    })
    .catch((e) => console.log('Something bad happened:', e))
}

// mark todo as done
const completeTodos = () => {
  const checkBoxes = document.querySelectorAll('#check-done')
  checkBoxes.forEach(checkBox => {
    checkBox.onchange = e => {
      checkBoxId = checkBox.getAttribute('data-id')
      fetch('/todos/complete', {
        method: 'PATCH',
        body: JSON.stringify({
          'id': checkBoxId,
          'done': e.target.checked
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .catch(e => console.log('Something bad happened:', e))
    }
  })
}

completeTodos()

// delete todos
const deleteTodo = (todoId) => {
  fetch('/todos/delete', {
    method: 'DELETE',
    body: JSON.stringify({
      'id': todoId
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(console.log('deleted!'))
    .catch(e => console.log('Something went wrong:', e))
}
