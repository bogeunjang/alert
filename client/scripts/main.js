const applicationServerPublicKey = 'BECDD6UBTO7vZcFrNU2BpLTeNgF8a14_j5RcgDM0rfuItWHt8j7_MJrmnde06CFUn7EQjUld1wnBPWeHpvoBbO8'

const pushButton = document.querySelector('#alertBtn');
const subscribe = document.querySelector('#subscribe');
const alertOption = document.querySelector('#alert-option');

let isSubscribed = false;
let swRegistration = null;

// base64로 암호화하는기능
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 현재 웹브라우저가 서비스워커랑 푸시기능을 지원할 경우
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push are supported');

  // 서비스워커 등록
  navigator.serviceWorker.register('./scripts/sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}

// 알람기능에 따라 버튼상태 설정
function updateBtn() {
  if (Notification.permission === 'denied') {
    alertOption.classList.remove('hidden')
    alertOption.textContent = '알람 기능을 허용해 주세요';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }else if(alertOption.classList.contains('hidden')) {
  }else{
    alertOption.classList.add('hidden');
  }

  if (isSubscribed) {
    subscribe.textContent = '알람 설정';
  } else {
    subscribe.textContent = '알람 취소';
  }

  pushButton.disabled = false;
}

// 클라이언트의 서비스워커를 통해 구독 여부 확인
function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    // updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

// 구독 시
function subscribeUser() {
  // 구독 데이터 생성
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(async function(subscription) {
    console.log('User is subscribed.');
    // 생성된 구독 데이터를 다루기 위한 함수
    await updateSubscriptionOnServer(subscription);
    isSubscribed = true;
    updateBtn();
  })
  .catch(function(error) {
    console.error('Failed to subscribe the user: ', error);
    updateBtn();
  });
}

// 서버가 구독정보 받는 함수
async function updateSubscriptionOnServer(subscription) {
  try {
    if (subscription) {
      await fetch('https://yu-notice.com/user', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json"
      }});
    } 
  } catch (error) {
    console.error('Error updating subscription on server: ', error);
    // 에러 처리 로직 추가
  }
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(async function(subscription) {
    if (subscription) {
      try{
        await fetch('https://yu-notice.com/user', {
        method: 'DELETE',
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json"
        }});
        await subscription.unsubscribe();
      } catch(e) {
        console.error(e)
      }
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}
