let editingPatientId = null

function generatePatientId() {
let next = patients.length + 1
let existingIds = new Set(patients.map(p => String(p.patientId || "")))
let id = `P${String(next).padStart(3, "0")}`
while (existingIds.has(id)) {
next += 1
id = `P${String(next).padStart(3, "0")}`
}
return id
}

function normalizePatient(patient) {
return {
id: patient.id || Date.now(),
patientId: patient.patientId || "",
name: (patient.name || "").trim(),
age: Number(patient.age) || "",
gender: patient.gender || "",
email: (patient.email || "").trim(),
phone: (patient.phone || patient.mobile || "").toString().trim()
}
}

function ensureUniquePatientIds() {
let used = new Set()
let counter = 1

patients.forEach(patient => {
if (patient.patientId && !used.has(patient.patientId)) {
used.add(patient.patientId)
return
}
let nextId = `P${String(counter).padStart(3, "0")}`
while (used.has(nextId)) {
counter += 1
nextId = `P${String(counter).padStart(3, "0")}`
}
patient.patientId = nextId
used.add(nextId)
counter += 1
})
}

function setInitialPatientId() {
document.getElementById("patientId").value = generatePatientId()
}

function validatePatientForm(patient) {
if (!patient.name || !patient.age || !patient.gender || !patient.email || !patient.phone) {
alert("Please fill all patient fields.")
return false
}

if (patient.name.length < 2) {
alert("Patient name must be at least 2 characters.")
return false
}

if (!Number.isInteger(patient.age) || patient.age < 1 || patient.age > 120) {
alert("Age must be a valid number between 1 and 120.")
return false
}

let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailPattern.test(patient.email)) {
alert("Please enter a valid email address.")
return false
}

let phonePattern = /^\d{10}$/
if (!phonePattern.test(patient.phone)) {
alert("Phone number must be exactly 10 digits.")
return false
}

let duplicatePhone = patients.some(p =>
String(p.phone || "") === patient.phone && p.id !== patient.id
)
if (duplicatePhone) {
alert("Phone number already exists for another patient.")
return false
}

return true
}

function getPatientFormData() {
let idValue = document.getElementById("patientId").value.trim()
let name = document.getElementById("name").value.trim()
let age = Number(document.getElementById("age").value)
let genderNode = document.querySelector('input[name="gender"]:checked')
let email = document.getElementById("email").value.trim()
let phone = document.getElementById("phone").value.trim()

return {
id: editingPatientId || Date.now(),
patientId: idValue || generatePatientId(),
name,
age,
gender: genderNode ? genderNode.value : "",
email,
phone
}
}

function savePatient() {
let patient = getPatientFormData()
if (!validatePatientForm(patient)) return

if (editingPatientId) {
let index = patients.findIndex(p => p.id === editingPatientId)
if (index !== -1) {
patients[index] = patient
}
} else {
patients.push(patient)
}

saveData()
displayPatients()
editingPatientId = null
clearPatientForm()
setInitialPatientId()
document.getElementById("savePatientBtn").innerText = "Add Patient"
document.getElementById("cancelEditBtn").style.display = "none"
}

function editPatient(id) {
let patient = patients.find(p => p.id === id)
if (!patient) return

editingPatientId = patient.id
document.getElementById("patientId").value = patient.patientId || ""
document.getElementById("name").value = patient.name || ""
document.getElementById("age").value = patient.age || ""
document.getElementById("email").value = patient.email || ""
document.getElementById("phone").value = patient.phone || ""

document.querySelectorAll('input[name="gender"]').forEach(r => {
r.checked = r.value === patient.gender
})

document.getElementById("savePatientBtn").innerText = "Update Patient"
document.getElementById("cancelEditBtn").style.display = "inline-block"
}

function cancelPatientEdit() {
editingPatientId = null
clearPatientForm()
setInitialPatientId()
document.getElementById("savePatientBtn").innerText = "Add Patient"
document.getElementById("cancelEditBtn").style.display = "none"
}

function deletePatient(id) {
patients = patients.filter(p => p.id !== id)
if (editingPatientId === id) {
cancelPatientEdit()
}
saveData()
displayPatients()
}

function displayPatients() {
let table = document.getElementById("patientTable")
let search = (document.getElementById("patientSearch").value || "").trim().toLowerCase()

table.innerHTML = ""

let filteredPatients = patients.filter(p => {
let name = String(p.name || "").toLowerCase()
let phone = String(p.phone || "")
if (!search) return true
return name.includes(search) || phone.includes(search)
})

filteredPatients.forEach(p => {
table.innerHTML += `
<tr>
<td>${p.patientId || "-"}</td>
<td>${p.name || "-"}</td>
<td>${p.age || "-"}</td>
<td>${p.gender || "-"}</td>
<td>${p.email || "-"}</td>
<td>${p.phone || "-"}</td>
<td>
<button class="btn btn-sm btn-info text-white" onclick="editPatient(${p.id})">Edit</button>
<button class="btn btn-sm btn-danger" onclick="deletePatient(${p.id})">Delete</button>
</td>
</tr>`
})
}

function clearPatientForm() {
document.getElementById("name").value = ""
document.getElementById("age").value = ""
document.querySelectorAll('input[name="gender"]').forEach(g => g.checked = false)
document.getElementById("email").value = ""
document.getElementById("phone").value = ""
}

patients = patients.map(normalizePatient)
ensureUniquePatientIds()
saveData()
setInitialPatientId()
displayPatients()
