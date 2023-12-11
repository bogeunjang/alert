const alertBtn = document.querySelector('#alertBtn');

function showAlert() {
    alert('알람이 표시됩니다!');
}

alertBtn.addEventListener("click", showAlert);