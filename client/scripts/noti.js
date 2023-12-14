window.onload = () => {
    const notiBoard = document.querySelector('.noti-table');
}

function buildCalendar(firstDate) {
    let lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0);

    let tbody = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = firstDate.getFullYear();
    document.getElementById("calMonth").innerText = firstDate.getMonth() + 1;

    while (tbody.rows.length > 0) {
        tbody.deleteRow(tbody.rows.length - 1);
    }

    let nowRow = tbody.insertRow();         

    for (let j = 0; j < firstDate.getDay(); j++) {
        nowRow.insertCell();
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {

        let nowColumn = nowRow.insertCell();
        let newDIV = document.createElement("p");
        newDIV.innerHTML = nowDay.getDate();
        nowColumn.appendChild(newDIV);

        if (nowDay.getDay() == 6) {
            nowRow = tbody.insertRow();
        }
    }
}
