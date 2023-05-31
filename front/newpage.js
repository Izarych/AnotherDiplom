const changeBtn = document.getElementById('changeBtn');
changeBtn.addEventListener('click', changeCan);

const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.addEventListener('click', deleteCan);

async function deleteCan() {
  const id = document.getElementById('deleteCanId').value;

  try {
    const response = await fetch(`http://localhost:3000/${id}` , {
      method: 'DELETE'
    })

    if (response.ok) {
      showMessage('Контейнер был успешно удален', 'success');
    } else {
      showMessage('Такого контейнера не существует', 'error');
    }
  } catch (error) {
    showMessage('Ошибка', 'error');
  }
}

async function changeCan() {
  const id = document.getElementById('canId').value;
  const content = document.getElementById('canContent').value;

  try {
    const response = await fetch(`http://localhost:3000/change/${id}/${content}`, {
      method: 'PUT'
    });

    if (response.ok) {
      showMessage('Объём контейнера успешно изменен', 'success');
    } else {
      showMessage('Такого контейнера не существует', 'error');
    }
  } catch (error) {
    showMessage('Ошибка', 'error')
  }

}

function showMessage(message, type) {
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = message;
  msgDiv.classList.add(type);

  setTimeout(() => {
    msgDiv.textContent = '';
    msgDiv.classList.remove(type);
  }, 3000);
}