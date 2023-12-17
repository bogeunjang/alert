window.onload = () => {
    const today = new Date();
    let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);

    const prev = document.querySelector('#prev');
    const next = document.querySelector('#next');

    prev.addEventListener("click", () => {
        firstDate = prevCalendar(firstDate);
        buildCalendar(firstDate);
    });
    
    next.addEventListener("click", () => {
        firstDate = nextCalendar(firstDate);
        buildCalendar(firstDate);
    });

    buildCalendar(firstDate); 
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

    // 학사일정용 날짜
    let month = lastDate.getMonth()+1;
    if(month < 10){
        month = "0"+month;
    }else{
        month = month+"";
    }
    let fullMonth = lastDate.getFullYear() + month;
    
    const container = document.getElementById('monthScheduleContainer');
    let monthScheduleList = scheduleList[fullMonth] || null;

    if(monthScheduleList){
        container.classList.remove('hidden');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        for(obj of monthScheduleList){
            const date = obj.split('#')[0];
            const content = obj.split('#')[1];
            const scheduleChild = document.createElement('div');
            scheduleChild.classList.add('scheduleChild');

            const dateElement = document.createElement('p');
            dateElement.textContent = date;

            const contentElement = document.createElement('p');
            contentElement.textContent = content;

            scheduleChild.appendChild(dateElement);
            scheduleChild.appendChild(contentElement);
            container.appendChild(scheduleChild);
        }
    }else{
        container.classList.add('hidden');
    }

}

// 이전달 버튼 클릭
function prevCalendar(prevDate) {
    const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 2, prevDate.getDate());
    return newDate;
}

// 다음달 버튼 클릭
function nextCalendar(prevDate) {
    const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
    return newDate;
}