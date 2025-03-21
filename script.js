// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getDatabase, ref, set, get, child, onValue } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";

// Your web app's Firebase configuration
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
    const number = document.getElementById('orderNumber').value;
    set(ref(database, 'pickupSystem/'), {
        currentNumber: parseInt(number)
    });
}
window.callNumber = callNumber;

// 다음 번호로 증가
function nextNumber() {
    const dbRef = ref(database);
    get(child(dbRef, 'pickupSystem/currentNumber')).then((snapshot) => {
        if (snapshot.exists()) {
            const next = snapshot.val() + 1;
            set(ref(database, 'pickupSystem/'), {
                currentNumber: next
            });
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
            set(ref(database, 'pickupSystem/'), {
                currentNumber: prev
            });
            document.getElementById('orderNumber').value = prev;
        }
    });
}
window.prevNumber = prevNumber;

// 디스플레이 페이지에서 번호 업데이트
function updateDisplay() {
    const numberRef = ref(database, 'pickupSystem/currentNumber');
    onValue(numberRef, (snapshot) => {
        const number = snapshot.val();
        document.getElementById('numberDisplay').innerText = number;
    });
}
window.updateDisplay = updateDisplay;
