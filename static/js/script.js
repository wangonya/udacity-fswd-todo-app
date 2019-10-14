console.log('Welcome to Flask Todos!')

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
      const liItem = document.createElement('LI')
      liItem.innerHTML = jsonResponse['description']
      document.getElementById('todos').appendChild(liItem)
    })
    .catch((e) => console.log('Something bad happened:', e))
}
