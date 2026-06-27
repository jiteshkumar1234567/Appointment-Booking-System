import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const emptyMedicine = {
  medicineName: '',
  dosage: '',
  duration: '',
  instructions: '',
}

const DoctorAppointments = () => {

  const { dToken, backendUrl, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const [prescriptionMap, setPrescriptionMap] = useState({})
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [selectedPrescription, setSelectedPrescription] = useState(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [medicines, setMedicines] = useState([{ ...emptyMedicine }])
  const [notes, setNotes] = useState('')
  const [loadingPrescription, setLoadingPrescription] = useState(false)
  const [savingPrescription, setSavingPrescription] = useState(false)

  const loadAppointmentPrescriptions = async () => {
    try {
      const completedAppointments = appointments.filter((item) => item.isCompleted && !item.cancelled)

      const prescriptionResponses = await Promise.all(
        completedAppointments.map((item) =>
          axios.get(backendUrl + '/api/prescriptions/appointment/' + item._id, { headers: { dToken } })
        )
      )

      const nextMap = {}
      prescriptionResponses.forEach(({ data }, index) => {
        if (data.success && data.prescription) {
          nextMap[completedAppointments[index]._id] = data.prescription
        }
      })

      setPrescriptionMap(nextMap)
    } catch (error) {
      console.log(error)
    }
  }

  const openPrescriptionModal = async (appointment) => {
    setSelectedAppointment(appointment)
    setLoadingPrescription(true)
    setShowPrescriptionModal(true)

    try {
      const { data } = await axios.get(
        backendUrl + '/api/prescriptions/appointment/' + appointment._id,
        { headers: { dToken } }
      )

      if (data.success && data.prescription) {
        setSelectedPrescription(data.prescription)
        setDiagnosis(data.prescription.diagnosis || '')
        setMedicines(data.prescription.medicines?.length ? data.prescription.medicines : [{ ...emptyMedicine }])
        setNotes(data.prescription.notes || '')
      } else if (data.success) {
        setSelectedPrescription(null)
        setDiagnosis('')
        setMedicines([{ ...emptyMedicine }])
        setNotes('')
      } else {
        toast.error(data.message)
        setShowPrescriptionModal(false)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setShowPrescriptionModal(false)
    } finally {
      setLoadingPrescription(false)
    }
  }

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false)
    setSelectedAppointment(null)
    setSelectedPrescription(null)
    setDiagnosis('')
    setMedicines([{ ...emptyMedicine }])
    setNotes('')
  }

  const updateMedicine = (index, field, value) => {
    const nextMedicines = [...medicines]
    nextMedicines[index] = { ...nextMedicines[index], [field]: value }
    setMedicines(nextMedicines)
  }

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { ...emptyMedicine }])
  }

  const removeMedicine = (index) => {
    if (medicines.length === 1) {
      toast.error('At least one medicine is required')
      return
    }

    setMedicines((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const submitPrescription = async () => {
    if (!diagnosis.trim()) {
      toast.error('Diagnosis is required')
      return
    }

    const invalidMedicine = medicines.find(
      (medicine) => !medicine.medicineName.trim() || !medicine.dosage.trim() || !medicine.duration.trim()
    )

    if (invalidMedicine) {
      toast.error('Medicine name, dosage and duration are required')
      return
    }

    setSavingPrescription(true)

    try {
      const payload = {
        appointmentId: selectedAppointment._id,
        diagnosis,
        medicines,
        notes,
      }

      const { data } = selectedPrescription
        ? await axios.put(
          backendUrl + '/api/prescriptions/' + selectedPrescription._id,
          payload,
          { headers: { dToken } }
        )
        : await axios.post(
          backendUrl + '/api/prescriptions/create',
          payload,
          { headers: { dToken } }
        )

      if (data.success) {
        toast.success(data.message)
        setPrescriptionMap((prev) => ({
          ...prev,
          [selectedAppointment._id]: data.prescription,
        }))
        closePrescriptionModal()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setSavingPrescription(false)
    }
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  useEffect(() => {
    if (dToken && appointments.length) {
      loadAppointmentPrescriptions()
    }
  }, [dToken, appointments])

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.4fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.4fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <div>
              <p className='text-xs inline border border-primary px-2 rounded-full'>
                {item.payment ? 'Online' : 'CASH'}
              </p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
              : item.isCompleted
                ? <div className='flex flex-col items-start gap-2'>
                  <p className='text-green-500 text-xs font-medium'>Completed</p>
                  <button
                    onClick={() => openPrescriptionModal(item)}
                    className='px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all'
                  >
                    {prescriptionMap[item._id] ? 'View / Edit Prescription' : 'Write Prescription'}
                  </button>
                </div>
                : <div className='flex'>
                  <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
          </div>
        ))}
      </div>

      {showPrescriptionModal && (
        <div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4'>
          <div className='bg-white w-full max-w-4xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between gap-4'>
              <div>
                <p className='text-sm text-blue-600 font-medium'>Prescription</p>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {selectedPrescription ? 'View / Edit Prescription' : 'Write Prescription'}
                </h2>
                <p className='text-sm text-gray-500 mt-1'>
                  {selectedAppointment?.userData?.name} - {selectedAppointment ? slotDateFormat(selectedAppointment.slotDate) : ''}, {selectedAppointment?.slotTime}
                </p>
              </div>

              <button onClick={closePrescriptionModal} className='text-2xl leading-none text-gray-400 hover:text-gray-700'>
                x
              </button>
            </div>

            {loadingPrescription ? (
              <div className='p-8 text-center text-gray-500'>Loading prescription...</div>
            ) : (
              <div className='p-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Diagnosis</label>
                  <textarea
                    rows='3'
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none'
                    placeholder='Enter diagnosis'
                  />
                </div>

                <div className='mt-6'>
                  <div className='flex items-center justify-between gap-4 mb-3'>
                    <label className='block text-sm font-medium text-gray-700'>Medicines</label>
                    <button onClick={addMedicine} className='px-4 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100'>
                      Add Medicine
                    </button>
                  </div>

                  <div className='space-y-4'>
                    {medicines.map((medicine, index) => (
                      <div key={index} className='border border-gray-200 rounded-lg p-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <input
                            type='text'
                            value={medicine.medicineName}
                            onChange={(e) => updateMedicine(index, 'medicineName', e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500'
                            placeholder='Medicine name'
                          />
                          <input
                            type='text'
                            value={medicine.dosage}
                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500'
                            placeholder='Dosage'
                          />
                          <input
                            type='text'
                            value={medicine.duration}
                            onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500'
                            placeholder='Duration'
                          />
                          <input
                            type='text'
                            value={medicine.instructions}
                            onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                            className='border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500'
                            placeholder='Instructions'
                          />
                        </div>

                        <div className='flex justify-end mt-3'>
                          <button onClick={() => removeMedicine(index)} className='text-sm text-red-500 hover:text-red-600'>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-6'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Notes</label>
                  <textarea
                    rows='4'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className='w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none'
                    placeholder='Additional notes'
                  />
                </div>

                <div className='flex justify-end gap-3 mt-6'>
                  <button onClick={closePrescriptionModal} className='px-5 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50'>
                    Cancel
                  </button>
                  <button
                    onClick={submitPrescription}
                    disabled={savingPrescription}
                    className='px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60'
                  >
                    {savingPrescription ? 'Saving...' : selectedPrescription ? 'Update Prescription' : 'Create Prescription'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorAppointments
