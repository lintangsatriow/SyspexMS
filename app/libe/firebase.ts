import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDHZ5G1Xm12QFcwNYhnwuI6tSolnvx7YFI",
  authDomain: "syspex-management-system.firebaseapp.com",
  projectId: "syspex-management-system",
  storageBucket: "syspex-management-system.firebasestorage.app",
  messagingSenderId: "899423940658",
  appId: "1:899423940658:web:8db8a9efe89d4784590c2b",
  measurementId: "G-29W5S1KC2Y"
}

// Inisialisasi Firebase (mencegah error inisialisasi ganda di Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Ekspor instance Firestore untuk digunakan di halaman lain
export const db = getFirestore(app)
