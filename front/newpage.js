const changeBtn = document.getElementById('changeBtn');
changeBtn.addEventListener('click', changeCan);

const deleteBtn = document.getElementById('deleteBtn');
deleteBtn.addEventListener('click', deleteCan);

document.addEventListener('DOMContentLoaded', () => {
    let canDates = []

    fetch('http://localhost:3000')
        .then(response => response.json())
        .then(data => {
            let totalContainers = data.length;
            let filledContainers = 0;
            let filledContainersObj = [];
            let totalVolume = 0;

            data.forEach(async (can) => {
                if (!canDates.includes({can: can.id})) {
                    canDates.push({can: can.id, updateDate: new Date(can.updatedAt)})
                }
                const obj = canDates.find(obj => obj.can === can.id);
                if (can.content < 8) {
                    if (dayDiff(new Date(), obj.updateDate)) {
                        await updateContent(can.id, getRandom(2, 1))
                    }
                }
                totalVolume += can.content;
                if (can.content >= 8) {
                    filledContainersObj.push({
                        "canId": can.id,
                        "canLat": can.latitude,
                        "canLon": can.longitude,
                    })
                    filledContainers++;
                }
            });

            const statsDiv = document.getElementById('stats');
            const filledContDiv = document.getElementById('filledContDiv');
            statsDiv.innerHTML = ` <p>Общая статистика контейнеров</p>
                                   <p>Всего контейнеров: ${totalContainers}</p>
                                   <p>Заполненных контейнеров: ${filledContainers}</p>
                                   <p>Общий объем мусора (в куб.м.): ${totalVolume}</p>`;

            filledContainersObj.forEach((container, index) => {
                filledContDiv.innerHTML += `<p>${index + 1}. ID: ${container.canId}, Широта: ${container.canLat}, Долгота: ${container.canLon}</p>`;
            });
        })

    function getRandom(max, min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function dayDiff(firstDate, secondDate) {
        secondDate.setDate(secondDate.getDate() + 1);
        return firstDate > secondDate;
    }

    async function updateContent(id, num) {
        return await fetch(`http://localhost:3000/${id}/${num}`, {
            method: 'PUT'
        })
    }

})

async function deleteCan() {
    const id = document.getElementById('deleteCanId').value;

    try {
        const response = await fetch(`http://localhost:3000/${id}`, {
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