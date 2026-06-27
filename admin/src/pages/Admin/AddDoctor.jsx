import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData()

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            const { data } = await axios.post(
                backendUrl + '/api/admin/add-doctor',
                formData,
                { headers: { aToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setEmail('')
                setPassword('')
                setExperience('1 Year')
                setFees('')
                setAbout('')
                setSpeciality('General physician')
                setDegree('')
                setAddress1('')
                setAddress2('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Add Doctor</h1>
                <p className="text-gray-500 text-sm">Create a new doctor profile</p>
            </div>

            <form
                onSubmit={onSubmitHandler}
                className="max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm p-4 md:p-8"
            >

                {/* Upload Section */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <img
                            className="w-20 h-20 object-cover rounded-full border shadow-sm hover:scale-105 transition"
                            src={
                                docImg
                                    ? URL.createObjectURL(docImg)
                                    : assets.upload_area
                            }
                            alt=""
                        />
                        <input
                            onChange={(e) => setDocImg(e.target.files[0])}
                            type="file"
                            id="doc-img"
                            hidden
                        />
                    </label>

                    <div>
                        <p className="font-medium text-gray-700">Upload Doctor Image</p>
                        <p className="text-xs text-gray-500">
                            JPG, PNG supported. Recommended square image.
                        </p>
                    </div>
                </div>

                {/* Grid Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Input label="Doctor Name" value={name} setValue={setName} />
                    <Input label="Email" value={email} setValue={setEmail} type="email" />
                    <Input label="Password" value={password} setValue={setPassword} type="password" />

                    <div>
                        <label className="text-sm text-gray-600">Experience</label>
                        <select
                            value={experience}
                            onChange={e => setExperience(e.target.value)}
                            className="w-full mt-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option>1 Year</option>
                            <option>2 Years</option>
                            <option>3 Years</option>
                            <option>5 Years</option>
                            <option>10 Years</option>
                        </select>
                    </div>

                    <Input label="Fees" value={fees} setValue={setFees} type="number" />

                    <div>
                        <label className="text-sm text-gray-600">Speciality</label>
                        <select
                            value={speciality}
                            onChange={e => setSpeciality(e.target.value)}
                            className="w-full mt-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option>General physician</option>
                            <option>Gynecologist</option>
                            <option>Dermatologist</option>
                            <option>Pediatricians</option>
                            <option>Neurologist</option>
                            <option>Gastroenterologist</option>
                        </select>
                    </div>

                    <Input label="Degree" value={degree} setValue={setDegree} />

                    <Input label="Address Line 1" value={address1} setValue={setAddress1} />
                    <Input label="Address Line 2" value={address2} setValue={setAddress2} />
                </div>

                {/* About */}
                <div className="mt-6">
                    <label className="text-sm text-gray-600">About Doctor</label>
                    <textarea
                        value={about}
                        onChange={e => setAbout(e.target.value)}
                        rows={5}
                        className="w-full mt-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Write about doctor..."
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full md:w-auto mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-10 py-3 rounded-xl font-medium shadow-md hover:scale-[1.02] transition"
                >
                    Add Doctor
                </button>

            </form>
        </div>
    )
}

/* Reusable Input Component */
const Input = ({ label, value, setValue, type = "text" }) => (
    <div>
        <label className="text-sm text-gray-600">{label}</label>
        <input
            value={value}
            type={type}
            onChange={e => setValue(e.target.value)}
            className="w-full mt-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
            placeholder={label}
        />
    </div>
)

Input.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setValue: PropTypes.func.isRequired,
    type: PropTypes.string,
}

export default AddDoctor