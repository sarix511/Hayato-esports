// firebase.js import { initializeApp } from "firebase/app"; import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore"; import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = { apiKey: "AIzaSyDnbD4DjpY3gaD3s1NdHOs_q6LqWzk5VqI", authDomain: "hayato-esports-87c0e.firebaseapp.com", projectId: "hayato-esports-87c0e", storageBucket: "hayato-esports-87c0e.appspot.com", messagingSenderId: "516162272287", appId: "1:516162272287:web:12ecf2ae672cc0658ee92a", measurementId: "G-5QG34M1C94" };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const storage = getStorage(app);

// Register new user globalThis.registerUser = async function () { const email = document.getElementById("regEmail").value; const password = document.getElementById("regPassword").value; const fullName = document.getElementById("fullName").value; const phone = document.getElementById("regPhone").value; const uid = document.getElementById("regUid").value;

try { const userCredential = await createUserWithEmailAndPassword(auth, email, password); const user = userCredential.user; await setDoc(doc(db, "users", user.uid), { uid, email, fullName, phone, coins: 0 }); alert("Registration successful!"); location.reload(); } catch (error) { alert(error.message); } };

// Login user globalThis.loginUser = async function () { const email = document.getElementById("email").value; const password = document.getElementById("password").value; const uid = document.getElementById("uid").value; try { const userCredential = await signInWithEmailAndPassword(auth, email, password); const user = userCredential.user; const userData = await getDoc(doc(db, "users", user.uid)); if (!userData.exists() || userData.data().uid !== uid) { alert("UID does not match registered account."); return; } document.getElementById("login").style.display = "none"; document.getElementById("dashboard").style.display = "block"; document.getElementById("payment").style.display = "block"; document.getElementById("room").style.display = "block"; document.getElementById("leaderboard").style.display = "block"; } catch (error) { alert("Login failed: " + error.message); } };

// Submit payment screenshot globalThis.submitPayment = async function () { const user = auth.currentUser; if (!user) return alert("Please login first");

const fileInput = document.getElementById("screenshot"); const file = fileInput.files[0]; const name = document.getElementById("senderName").value; const number = document.getElementById("senderNumber").value;

if (!file || !name || !number) return alert("All fields required");

const storageRef = ref(storage, payments/${user.uid}/${file.name}); try { await uploadBytes(storageRef, file); const url = await getDownloadURL(storageRef); await addDoc(collection(db, "payments"), { userId: user.uid, name, number, screenshot: url, status: "pending", timestamp: new Date() }); alert("Payment submitted successfully!"); } catch (err) { alert("Upload failed: " + err.message); } };

