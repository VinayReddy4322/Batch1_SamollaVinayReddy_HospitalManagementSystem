function generateAppointmentId() {
let next = appointments.length + 1
let existingIds = new Set(appointments.map(a => String(a.appointmentId || "")))
let id = `A${String(next).padStart(3, "0")}`
while (existingIds.has(id)) {
next += 1
id = `A${String(next).padStart(3, "0")}`
}
return id
}

function normalizeAppointment(appointment) {
return {
id: appointment.id || Date.now(),
appointmentId: appointment.appointmentId || "",
patient: (appointment.patient || "").trim(),
doctor: (appointment.doctor || "").trim(),
date: appointment.date || "",
time: (appointment.time || "").trim(),
status: appointment.status || "Booked"
}
}

function ensureUniqueAppointmentIds() {
let used = new Set()
let counter = 1

appointments.forEach(appointment => {
if (appointment.appointmentId && !used.has(appointment.appointmentId)) {
used.add(appointment.appointmentId)
return
}
let nextId = `A${String(counter).padStart(3, "0")}`
while (used.has(nextId)) {
counter += 1
nextId = `A${String(counter).padStart(3, "0")}`
}
appointment.appointmentId = nextId
used.add(nextId)
counter += 1
})
}

function setInitialAppointmentId() {
document.getElementById("appointmentId").value = generateAppointmentId()
}

function loadDropdowns() {
let pDrop = document.getElementById("patient")
let dDrop = document.getElementById("doctor")
if (!pDrop || !dDrop) return

pDrop.innerHTML = '<option value="">Select Patient</option>'
dDrop.innerHTML = '<option value="">Select Doctor</option>'

patients.forEach(p => {
let label = `${p.patientId || ""} - ${p.name || ""}`.trim()
pDrop.innerHTML += `<option value="${label}">${label}</option>`
})

doctors.forEach(d => {
let label = `${d.doctorId || ""} - ${d.name || ""}`.trim()
dDrop.innerHTML += `<option value="${label}">${label}</option>`
})
}

function bookAppointment() {
let appointmentId = document.getElementById("appointmentId").value.trim() || generateAppointmentId()
let patient = document.getElementById("patient").value.trim()
let doctor = document.getElementById("doctor").value.trim()
let date = document.getElementById("date").value
let time = document.getElementById("time").value.trim()
let status = document.getElementById("status").value

if (!patient || !doctor || !date || !time || !status) {
alert("Please fill all appointment fields.")
return
}

let today = new Date()
today.setHours(0, 0, 0, 0)
let selectedDate = new Date(date)
selectedDate.setHours(0, 0, 0, 0)
if (selectedDate < today) {
alert("Appointment date cannot be in the past.")
return
}

let exists = appointments.find(a =>
a.doctor === doctor && a.date === date && a.time === time && a.status !== "Cancelled"
)
if (exists) {
alert("This doctor is already booked for the selected date and time slot.")
return
}

appointments.push({
id: Date.now(),
appointmentId,
patient,
doctor,
date,
time,
status
})

saveData()
displayAppointments()
clearAppointmentForm()
setInitialAppointmentId()
}

function displayAppointments() {
let table = document.getElementById("appointmentTable")
table.innerHTML = ""

appointments.forEach(a => {
let badgeClass = "bg-primary"
if (a.status === "Cancelled") badgeClass = "bg-danger"
if (a.status === "Completed") badgeClass = "bg-success"

table.innerHTML += `
<tr>
<td>${a.appointmentId || "-"}</td>
<td>${a.patient || "-"}</td>
<td>${a.doctor || "-"}</td>
<td>${a.date || "-"}</td>
<td>${a.time || "-"}</td>
<td><span class="badge ${badgeClass}">${a.status || "Booked"}</span></td>
</tr>`
})
}

function clearAppointmentForm() {
document.getElementById("patient").selectedIndex = 0
document.getElementById("doctor").selectedIndex = 0
document.getElementById("date").value = ""
document.getElementById("time").selectedIndex = 0
document.getElementById("status").value = "Booked"
}

appointments = appointments.map(normalizeAppointment)
ensureUniqueAppointmentIds()
saveData()
loadDropdowns()
let dateInput = document.getElementById("date")
if (dateInput) {
dateInput.min = new Date().toISOString().split("T")[0]
}
setInitialAppointmentId()
displayAppointments()
