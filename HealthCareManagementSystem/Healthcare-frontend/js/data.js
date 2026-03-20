let patients = JSON.parse(localStorage.getItem("patients")) || []
let doctors = JSON.parse(localStorage.getItem("doctors")) || []
let appointments = JSON.parse(localStorage.getItem("appointments")) || []

function saveData(){
localStorage.setItem("patients", JSON.stringify(patients))
localStorage.setItem("doctors", JSON.stringify(doctors))
localStorage.setItem("appointments", JSON.stringify(appointments))
}