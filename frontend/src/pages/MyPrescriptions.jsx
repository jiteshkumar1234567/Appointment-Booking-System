import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const MyPrescriptions = () => {
  const { backendUrl, token } = useContext(AppContext)

  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState('')

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return ''
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
  }

  const getMyPrescriptions = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/prescriptions/my', { headers: { token } })

      if (data.success) {
        setPrescriptions(data.prescriptions)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadPrescription = async (prescription) => {
    try {
      setDownloadingId(prescription._id)

      const response = await axios.get(
        backendUrl + '/api/prescriptions/download/' + prescription._id,
        {
          headers: { token },
          responseType: 'blob',
        }
      )

      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = fileUrl
      link.setAttribute('download', `prescription-${prescription._id}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(fileUrl)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setDownloadingId('')
    }
  }

  useEffect(() => {
    if (token) {
      getMyPrescriptions()
    } else {
      setLoading(false)
    }
  }, [token])

  return (
    <div className='py-10'>
      <div className='border-b pb-4'>
        <p className='text-2xl font-semibold text-gray-800'>My Prescriptions</p>
        <p className='text-sm text-gray-500 mt-1'>View and download prescriptions from completed appointments.</p>
      </div>

      {loading ? (
        <div className='py-16 text-center text-gray-500'>Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className='py-16 text-center'>
          <div className='max-w-md mx-auto border rounded-xl p-8 bg-white'>
            <p className='text-lg font-medium text-gray-700'>No prescriptions found</p>
            <p className='text-sm text-gray-500 mt-2'>
              Prescriptions will appear here after your doctor completes an appointment and writes one.
            </p>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6'>
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className='border rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition-all'>
              <div className='flex gap-4'>
                <img
                  src={prescription.doctorId?.image}
                  alt=''
                  className='w-20 h-20 rounded-lg object-cover bg-[#EAEFFF]'
                />

                <div className='flex-1 min-w-0'>
                  <p className='text-lg font-semibold text-gray-800 truncate'>
                    Dr. {prescription.doctorId?.name}
                  </p>
                  <p className='text-sm text-gray-500'>{prescription.doctorId?.speciality}</p>
                  <p className='text-sm text-gray-600 mt-2'>
                    {slotDateFormat(prescription.appointmentId?.slotDate)} | {prescription.appointmentId?.slotTime}
                  </p>
                </div>
              </div>

              <div className='mt-5 space-y-3 text-sm'>
                <div>
                  <p className='text-gray-500'>Diagnosis</p>
                  <p className='text-gray-800 font-medium line-clamp-2'>{prescription.diagnosis}</p>
                </div>

                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-gray-500'>Medicines</p>
                    <p className='text-gray-800 font-medium'>{prescription.medicines?.length || 0} prescribed</p>
                  </div>

                  <button
                    onClick={() => downloadPrescription(prescription)}
                    disabled={downloadingId === prescription._id}
                    className='px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60'
                  >
                    {downloadingId === prescription._id ? 'Downloading...' : 'Download PDF'}
                  </button>
                </div>

                {prescription.notes && (
                  <div>
                    <p className='text-gray-500'>Notes</p>
                    <p className='text-gray-700 line-clamp-2'>{prescription.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyPrescriptions
