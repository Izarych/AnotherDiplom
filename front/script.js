const addButton = document.getElementById('addbtn');
addButton.addEventListener('click', sendData);

async function sendData() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    let content = document.getElementById('content').value;
    //!!! Обработка ошибки если пользователь вводит очень большое число, тогда число сбрасывается на 8
    if (content > 8) content = 8;

    const data = {
        latitude,
        longitude,
        content
    }

    await fetch('http://localhost:3000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    location.reload();
}


document.addEventListener('DOMContentLoaded', () => {
    let map = L.map('map').setView([52.417, 34.794], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);

    let canDates = []

    fetch('http://localhost:3000')
        .then(response => response.json())
        .then(data => {
            let totalContainers = data.length;
            let filledContainers = 0;
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
                    filledContainers++;
                }
                //!!! Добавлена дата обновления данных
                const year = obj.updateDate.getFullYear();
                const month = obj.updateDate.getMonth() + 1;
                const day = obj.updateDate.getDate();
                const formattedDate = `${year} - ${month} - ${day}`;

                let marker = L.marker([can.latitude, can.longitude]).addTo(map);
                marker.bindPopup('<div class="cont">' + `Номер контейнера: ${can.id}` + '</div>' +
                    (can.content === 0 ? '<div class="cont">' + 'Контейнер пуст' + '</div>' : '<div class="cont">' + `Объём мусора (в куб.м.): ${can.content.toString()}` + '</div>')
                    +
                    '<div class="cont">' + `Последнее обновление данных: ${formattedDate}` + '</div>' +
                    (can.content >= 8 ? '<div class="cont">Контейнер заполнен</div>' : ''))

                if (can.content >= 8) {
                    if (dayDiff(new Date(), obj.updateDate)) {
                        await updateContent(can.id, -can.content);
                    }
                }
            });

            const statsDiv = document.getElementById('stats');
            statsDiv.innerHTML = ` <p>Общая статистика контейнеров</p>
                                   <p>Всего контейнеров: ${totalContainers}</p>
                                   <p>Заполненных контейнеров: ${filledContainers}</p>
                                   <p>Общий объем мусора (в куб.м.): ${totalVolume}</p>`;
        })

    function getRandom(max, min) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function minDiff(firstDate, secondDate) {
        const diff = Math.abs(firstDate - secondDate);
        const msInMinute = 60 * 1000;
        return diff >= msInMinute
    } // Потом удалить

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