import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } })

                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })

            if (data.success) {
                initPay(data.order)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })

            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const openReviewModal = (appointment) => {
        setSelectedAppointment(appointment)
        setRating(5)
        setTitle('')
        setComment('')
        setShowReviewModal(true)
    }

    const submitReview = async () => {
        if (!selectedAppointment) {
            toast.error('Appointment not selected')
            return
        }

        if (!title.trim()) {
            toast.error('Review title is required')
            return
        }

        if (!comment.trim()) {
            toast.error('Review comment is required')
            return
        }

        try {
            const { data } = await axios.post(
                backendUrl + '/api/reviews/create',
                {
                    doctorId: selectedAppointment.docId || selectedAppointment.docData?._id,
                    appointmentId: selectedAppointment._id,
                    rating,
                    title,
                    comment,
                },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message || 'Review submitted successfully')
                setShowReviewModal(false)
                setSelectedAppointment(null)
                setRating(5)
                setTitle('')
                setComment('')
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 border-b'>My appointments</p>

            <div>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>

                        <div className='flex-1 text-sm text-[#5E5E5E]'>
                            <p className='text-[#262626] text-base font-semibold'>{item.docData.name}</p>
                            <p>{item.docData.speciality}</p>
                            <p className='text-[#464646] font-medium mt-1'>Address:</p>
                            <p>{item.docData.address.line1}</p>
                            <p>{item.docData.address.line2}</p>
                            <p className='mt-1'>
                                <span className='text-sm text-[#3C3C3C] font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                            </p>
                        </div>

                        <div></div>

                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <button onClick={() => setPayment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                                    Pay Online
                                </button>
                            )}

                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    <img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" />
                                </button>
                            )}

                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <button onClick={() => appointmentRazorpay(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center'>
                                    <img className='max-w-20 max-h-5' src={assets.razorpay_logo} alt="" />
                                </button>
                            )}

                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF]'>
                                    Paid
                                </button>
                            )}

                            {item.isCompleted && (
                                <>
                                    <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>
                                        Completed
                                    </button>

                                    <button onClick={() => openReviewModal(item)} className='sm:min-w-48 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300'>
                                        Write Review
                                    </button>
                                </>
                            )}

                            {!item.cancelled && !item.isCompleted && (
                                <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                                    Cancel appointment
                                </button>
                            )}

                            {item.cancelled && !item.isCompleted && (
                                <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>
                                    Appointment cancelled
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showReviewModal && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4'>
                    <div className='bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6'>
                        <div className='flex items-start justify-between gap-4'>
                            <div>
                                <p className='text-sm text-blue-600 font-medium'>Doctor Review</p>
                                <h2 className='text-2xl font-bold text-gray-800 mt-1'>
                                    Share your experience
                                </h2>
                                <p className='text-sm text-gray-500 mt-1'>
                                    {selectedAppointment?.docData?.name}
                                </p>
                            </div>

                            <button onClick={() => setShowReviewModal(false)} className='text-gray-400 hover:text-gray-700 text-2xl leading-none'>
                                ×
                            </button>
                        </div>

                        <div className='mt-6'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Rating
                            </label>

                            <div className='flex gap-2'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='mt-5'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Review Title
                            </label>

                            <input
                                type='text'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Excellent doctor'
                                className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500'
                            />
                        </div>

                        <div className='mt-5'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Review Comment
                            </label>

                            <textarea
                                rows='4'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder='Write your review...'
                                className='w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-blue-500'
                            />
                        </div>

                        <div className='flex justify-end gap-3 mt-6'>
                            <button onClick={() => setShowReviewModal(false)} className='px-5 py-2.5 border rounded-xl text-gray-600 hover:bg-gray-50'>
                                Cancel
                            </button>

                            <button onClick={submitReview} className='px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700'>
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyAppointments