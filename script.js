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
        const dbRef = ref(database);
        get(child(dbRef, 'pickupSystem')).then((snapshot) => {
            let previousNumbers = [];
            if (snapshot.exists()) {
                const data = snapshot.val();
                previousNumbers = data.previousNumbers || [];
                // 중복 방지
                if (!previousNumbers.includes(number)) {
                    previousNumbers.push(number);
                    if (previousNumbers.length > 5) previousNumbers.shift(); // 최근 5개만 저장
                }
            }
            set(ref(database, 'pickupSystem/'), {
                currentNumber: number,
                previousNumbers: previousNumbers
            });
        });
    }
}
window.callNumber = callNumber;

// 다음 번호로 증가
function nextNumber() {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem/currentNumber')).then((snapshot) => {
        if (snapshot.exists()) {
            const next = snapshot.val() + 1;
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
            const prev = Math.max(1, snapshot.val() - 1);
            updateNumber(prev);
            document.getElementById('orderNumber').value = prev;
        }
    });
}
window.prevNumber = prevNumber;

// 번호 업데이트 (공통 함수)
function updateNumber(number) {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem')).then((snapshot) => {
        let previousNumbers = [];
        if (snapshot.exists()) {
            const data = snapshot.val();
            previousNumbers = data.previousNumbers || [];
            // 중복 방지
            if (!previousNumbers.includes(number)) {
                previousNumbers.push(number);
                if (previousNumbers.length > 5) previousNumbers.shift(); // 최근 5개만 저장
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
    onValue(numberRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const currentNumber = data.currentNumber;
            const previousNumbers = data.previousNumbers || [];

            // 현재 번호 표시
            document.getElementById('currentNumber').innerText = currentNumber;

            // 이전 번호 표시
            const prevNumberList = previousNumbers.slice(-5).reverse().map(num => `<li class="previous-number">${num}</li>`).join('');
            document.getElementById('prevNumberList').innerHTML = prevNumberList;
        }
    });
}
window.updateDisplay = updateDisplay;
