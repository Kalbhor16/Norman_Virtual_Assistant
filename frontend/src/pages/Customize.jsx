import { useContext, useRef } from 'react'
import Card from '../components/Card'
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import { RiImageAddLine } from "react-icons/ri"
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

function Customize() {
  const{serverUrl,userData,setUserData,backendImage,setBackendImage,frontendImage,setFrontendImage,selectedImage,setSelectedImage}=useContext(userDataContext)
  const inputImage=useRef()
  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  const navigate=useNavigate()
  return (
    <div className='w-[80px] h-[160px] w-full h-screen bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px]'>
        <IoArrowBack  className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer' onClick={()=>navigate("/")}/>
        <h1 className='text-white text-[30px] text-center mb-[40px]'>Select your <span className='text-blue-200'>Assistant Image</span></h1>
        <div className='w-full max-w-[900] flex justify-center items-center flex-wrap gap-[15px] mb-[20px]'>
           <Card image={image1}/>
           <Card image={image2}/>
           <Card image={image3}/>
           <Card image={image4}/>
           <Card image={image5}/>
        </div>
     <div  className={`lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex justify-center items-center ${selectedImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`}onClick={()=>{
      inputImage.current.click()
      setSelectedImage("input")
      }} >
       {!frontendImage &&  <RiImageAddLine className='text-white w-[25px] h-[25px]'/>}
       {frontendImage && <img src={frontendImage}
       className='h-full object-cover'/>}   
     <input type="file" accept='image/*' ref={inputImage} hidden onChange={handleImage} />
    </div>
    {selectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibolt bg-white rounded-full text-[19px] cursor-pointer'onClick={()=>navigate("/customize2")}>Next</button>}
    </div>
  )
}

export default Customize