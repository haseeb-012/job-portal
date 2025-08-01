import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useAuth, } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'


const Resume = () => {


  const { getToken } = useAuth()

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userData,  fetchUserData, } = useContext(AppContext)

  const updateResume = async () => {

    try {

      const formData = new FormData()
      formData.append('resume', resume)

      const token = await getToken()

      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

    setIsEdit(false)
    setResume(null)
  }
  return (
        <>
      <div className='container px-4  2xl:px-20 mx-auto my-5'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mt-3'>
          {
            isEdit || userData && userData.resume === ""
              ? <>
                <label className='flex items-center' htmlFor="resumeUpload">
                  <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>{resume ? resume.name : "Select Resume"}</p>
                  <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
                  <img src={assets.profile_upload_icon} alt="" />
                </label>
                <button onClick={updateResume} className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>Save</button>
              </>
              : <div className='flex gap-2'>
                <a target='_blank' href={userData.resume} className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>
                  Resume
                </a>
                <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                  Edit
                </button>
              </div>
          }
        </div>
       </div>
    </>
    )
}
export default Resume