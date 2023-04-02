import { initializeApp } from "@firebase/app"

const firebaseConfig = {
    apiKey: "AIzaSyAZQmMIdY6QR946mdYZl-3vrltjqs0kXZ4",
    authDomain: "sociapics-283cd.firebaseapp.com",
    projectId: "sociapics-283cd",
    storageBucket: "sociapics-283cd.appspot.com",
    messagingSenderId: "970185586384",
    appId: "1:970185586384:web:a02436d683a4ec9df5d0d5",
    measurementId: "G-K0462TBQD5"
}

const app = initializeApp(firebaseConfig);

export default app;