let editingDoctorId = null

function generateDoctorId() {
let next = doctors.length + 1
let existingIds = new Set(doctors.map(d => String(d.doctorId || "")))
let id = `D${String(next).padStart(3, "0")}`
while (existingIds.has(id)) {
next += 1
id = `D${String(next).padStart(3, "0")}`
}
return id
}

function normalizeDoctor(doctor) {
return {
id: doctor.id || Date.now(),
doctorId: doctor.doctorId || "",
name: (doctor.name || "").trim(),
specialization: (doctor.specialization || "").trim(),
availableSlot: (doctor.availableSlot || "").trim()
}
}

function ensureUniqueDoctorIds() {
let used = new Set()
let counter = 1

doctors.forEach(doctor => {
if (doctor.doctorId && !used.has(doctor.doctorId)) {
used.add(doctor.doctorId)
return
}
let nextId = `D${String(counter).padStart(3, "0")}`
while (used.has(nextId)) {
counter += 1
nextId = `D${String(counter).padStart(3, "0")}`
}
doctor.doctorId = nextId
used.add(nextId)
counter += 1
})
}

function setInitialDoctorId() {
document.getElementById("doctorId").value = generateDoctorId()
}

function validateDoctor(doctor) {
if (!doctor.name || !doctor.specialization || !doctor.availableSlot) {
alert("Please fill all doctor fields.")
return false
}

if (doctor.name.length < 2) {
alert("Doctor name must be at least 2 characters.")
return false
}

let duplicateDoctor = doctors.some(d =>
d.name.toLowerCase() === doctor.name.toLowerCase() &&
d.specialization.toLowerCase() === doctor.specialization.toLowerCase() &&
d.id !== doctor.id
)
if (duplicateDoctor) {
alert("This doctor already exists.")
return false
}

return true
}

function getDoctorFormData() {
let doctorId = document.getElementById("doctorId").value.trim() || generateDoctorId()
let name = document.getElementById("dname").value.trim()
let specialization = document.getElementById("specialization").value.trim()
let availableSlot = document.getElementById("availableSlot").value.trim()

return {
id: editingDoctorId || Date.now(),
doctorId,
name,
specialization,
availableSlot
}
}

function saveDoctor() {
let doctor = getDoctorFormData()
if (!validateDoctor(doctor)) return

if (editingDoctorId) {
let index = doctors.findIndex(d => d.id === editingDoctorId)
if (index !== -1) {
doctors[index] = doctor
}
} else {
doctors.push(doctor)
}

saveData()
displayDoctors()
editingDoctorId = null
clearDoctorForm()
setInitialDoctorId()
document.getElementById("saveDoctorBtn").innerText = "Add Doctor"
document.getElementById("cancelDoctorEditBtn").style.display = "none"
}

function editDoctor(id) {
let doctor = doctors.find(d => d.id === id)
if (!doctor) return

editingDoctorId = doctor.id
document.getElementById("doctorId").value = doctor.doctorId || ""
document.getElementById("dname").value = doctor.name || ""
document.getElementById("specialization").value = doctor.specialization || ""
document.getElementById("availableSlot").value = doctor.availableSlot || ""

document.getElementById("saveDoctorBtn").innerText = "Update Doctor"
document.getElementById("cancelDoctorEditBtn").style.display = "inline-block"
}

function cancelDoctorEdit() {
editingDoctorId = null
clearDoctorForm()
setInitialDoctorId()
document.getElementById("saveDoctorBtn").innerText = "Add Doctor"
document.getElementById("cancelDoctorEditBtn").style.display = "none"
}

function displayDoctors() {
let table = document.getElementById("doctorTable")
table.innerHTML = ""

doctors.forEach(d => {
table.innerHTML += `
<tr>
<td>${d.doctorId || "-"}</td>
<td>${d.name || "-"}</td>
<td>${d.specialization || "-"}</td>
<td>${d.availableSlot || "-"}</td>
<td><button class="btn btn-sm btn-info text-white" onclick="editDoctor(${d.id})">Edit</button></td>
</tr>`
})
}

function clearDoctorForm() {
document.getElementById("dname").value = ""
document.getElementById("specialization").selectedIndex = 0
document.getElementById("availableSlot").value = ""
}

doctors = doctors.map(normalizeDoctor)
ensureUniqueDoctorIds()
saveData()
setInitialDoctorId()
displayDoctors()
