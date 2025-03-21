// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue, update } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAsCvKtCxax9bnnOjzwspBHE-pZgtmyQgY",
    authDomain: "pickup-system-eccfb.firebaseapp.com",
    databaseURL: "https://pickup-system-eccfb-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pickup-system-eccfb",
    storageBucket: "pickup-system-eccfb.firebasestorage.app",
    messagingSenderId: "540351945572",
    appId: "1:540351945572:web:f6c14ed038d447a54f3871",
    measurementId: "G-THD4R8W6FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 호출 번호 설정
function callNumber() {
    const number = parseInt(document.getElementById('orderNumber').value);
    if (!isNaN(number)) {
        updateNumber(number);
    }
}
window.callNumber = callNumber;

// 다음 번호로 증가 (100번에서 1번으로 순환)
function nextNumber() {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem/currentNumber')).then((snapshot) => {
        if (snapshot.exists()) {
            let next = snapshot.val() + 1;
            if (next > 100) next = 1;
            updateNumber(next);
            document.getElementById('orderNumber').value = next;
        }
    });
}
window.nextNumber = nextNumber;

// 이전 번호로 감소
function prevNumber() {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem/currentNumber')).then((snapshot) => {
        if (snapshot.exists()) {
            let prev = snapshot.val() - 1;
            if (prev < 1) prev = 100;
            updateNumber(prev);
            document.getElementById('orderNumber').value = prev;
        }
    });
}
window.prevNumber = prevNumber;

// 번호 업데이트
function updateNumber(number) {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem')).then((snapshot) => {
        let previousNumbers = [];
        if (snapshot.exists()) {
            const data = snapshot.val();
            previousNumbers = data.previousNumbers || [];
            const currentNumber = data.currentNumber || null;

            if (currentNumber !== null && currentNumber !== number) {
                previousNumbers.unshift(currentNumber);
                if (previousNumbers.length > 3) previousNumbers = previousNumbers.slice(0, 3);
            }
        }

        set(ref(database, 'pickupSystem/'), {
            currentNumber: number,
            previousNumbers: previousNumbers
        });
    });
}

// 실시간 업데이트
function updateDisplay() {
    const numberRef = ref(database, 'pickupSystem/');
    const sound = document.getElementById("dingdongSound");
    onValue(numberRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const currentNumber = data.currentNumber || '';
            const previousNumbers = data.previousNumbers || [];

            const currentNumberElem = document.getElementById('currentNumber');
            currentNumberElem.innerText = currentNumber;

            // 번호가 업데이트될 때 소리 재생
            if (currentNumber) {
                sound.currentTime = 0;
                sound.play();
            }

            // 100번인 경우 폰트 크기 줄이기
            if (currentNumber === 100) {
                currentNumberElem.style.fontSize = '25rem';
                currentNumberElem.style.transform = 'scale(0.8, 1)';
                currentNumberElem.style.position = 'relative';
                currentNumberElem.style.right = '50px';
            } else {
                currentNumberElem.style.fontSize = '35rem';
                currentNumberElem.style.transform = 'scale(0.85, 1)';
                currentNumberElem.style.position = '';  // 초기화
                currentNumberElem.style.right = '';     // 초기화
            }

            const prevNumberList = previousNumbers.slice(0, 3).map(num => `<li class="previous-number">${num}</li>`).join('');
            document.getElementById('prevNumberList').innerHTML = prevNumberList;

            if (currentNumber === '') {
                currentNumberElem.innerText = '';
            }
        }
    });
}
window.updateDisplay = updateDisplay;
