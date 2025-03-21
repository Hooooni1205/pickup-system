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
            if (next > 100) next = 1; // 100번 다음은 1번으로
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
            if (prev < 1) prev = 100; // 1번 이전은 100번으로
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

            // 중복 제거와 동시에 현재 번호를 제외하고 추가
            if (currentNumber !== null && currentNumber !== number) {
                previousNumbers = previousNumbers.filter(num => num !== currentNumber);
                previousNumbers.push(currentNumber);
                if (previousNumbers.length > 3) previousNumbers.shift();
            }
        }
        set(ref(database, 'pickupSystem/'), {
            currentNumber: number,
            previousNumbers: previousNumbers
        });
    });
}

// 초기화 버튼 기능
function resetNumbers() {
    set(ref(database, 'pickupSystem/'), {
        currentNumber: null,
        previousNumbers: []
    });
}
window.resetNumbers = resetNumbers;

// 실시간 업데이트
function updateDisplay() {
    const numberRef = ref(database, 'pickupSystem/');
    onValue(numberRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const currentNumber = data.currentNumber || '';
            const previousNumbers = data.previousNumbers || [];

            const currentNumberElem = document.getElementById('currentNumber');
            currentNumberElem.innerText = currentNumber;

            // 100번인 경우 폰트 크기 줄이기
            if (currentNumber === 100) {
                currentNumberElem.style.fontSize = '25rem';
            } else {
                currentNumberElem.style.fontSize = '35rem';
            }

            // 이전 번호 리스트에서 현재 번호를 필터링하여 표시
            const filteredNumbers = previousNumbers.slice(-3).reverse().map(num => `<li class="previous-number">${num}</li>`).join('');
            document.getElementById('prevNumberList').innerHTML = filteredNumbers;

            // 초기화 시 현재 번호 숨기기
            if (currentNumber === '') {
                currentNumberElem.innerText = '';
            }
        }
    });
}
window.updateDisplay = updateDisplay;
