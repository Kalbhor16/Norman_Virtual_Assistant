import { useContext, useEffect, useRef, useState } from "react"
import UserContext, { userDataContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function Home() {
    const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
    const navigate = useNavigate()

    const [listening, setListening] = useState(false)

    const recognitionRef = useRef(null)
    const isSpeakingRef = useRef(false)

    const synth = window.speechSynthesis

    // LOGOUT 
    const handleLogOut = async () => {
        await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
        setUserData(null)
        navigate("/signin")
    }

    //SPEAK
    const speak = (text) => {
        if (!text) return
       
        synth.cancel() // stop previous speech

        const utter = new SpeechSynthesisUtterance(text)
        utter.lang='hi-IN'
        const voices=window.speechSynthesis.getVoices()
        const hindiVoice=voices.find(v=>v.lang==='hi-IN');
        if(hindiVoice){
            utter.voice=hindiVoice;
        }
        isSpeakingRef.current = true
        setListening(false)

        utter.onend = () => {
            isSpeakingRef.current = false
            startRecognition() // restart listening after speak
        }

        synth.speak(utter)
    }

    //START MIC
    const startRecognition = () => {
        if (!recognitionRef.current || isSpeakingRef.current) return

        try {
            recognitionRef.current.start()
        } catch {}
    }

    //STOP MIC
    const stopRecognition = () => {
        recognitionRef.current?.stop()
        setListening(false)
    }

    // COMMANDS
    const handleCommand = (data) => {
        const { type, userInput, response } = data

        speak(response)

        const query = encodeURIComponent(userInput)

        if (type === "google_search")
            window.open(`https://www.google.com/search?q=${query}`, "_blank")

        if (type === "calculator_open")
            window.open(`https://www.google.com/search?q=calculator`, "_blank")

        if (type === "instagram_open")
            window.open(`https://www.instagram.com/`, "_blank")

        if (type === "facebook_open")
            window.open(`https://www.facebook.com/`, "_blank")

        if (type === "weather_show")
            window.open(`https://www.google.com/search?q=weather`, "_blank")

        if (type === "youtube_search" || type === "youtube_play")
            window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank")
    }

    // SETUP RECOGNITION 
    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition

        const recognition = new SpeechRecognition()

        recognition.continuous = true
        recognition.lang = "en-US"

        recognitionRef.current = recognition

        recognition.onstart = () => {
            setListening(true)
            console.log("Listening...")
        }

        recognition.onend = () => {
            setListening(false)
            console.log("Stopped")
        }

        recognition.onerror = () => {
            setListening(false)
        }

        recognition.onresult = async (e) => {
            const transcript =
                e.results[e.results.length - 1][0].transcript.trim()

            console.log("heard:", transcript)

            if (
                transcript
                    .toLowerCase()
                    .includes(userData.assistantName.toLowerCase())
            ) {
                stopRecognition()

                const data = await getGeminiResponse(transcript)

                handleCommand(data)
            }
        }

        return () => recognition.stop()
    }, [])

    
    return (
        <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col justify-center items-center gap-6">

           <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibolt bg-white rounded-full text-[19px] cursor-pointer absolute top-[20px] right-[20px]' onClick={handleLogOut}>Log Out</button>
            <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibolt bg-white rounded-full absolute top-[100px] right-[20px] px-[20px] py-[2px] text-[19px] cursor-pointer' onClick={() => navigate("/customize")}>Customize your Assistant</button>

            <img
                src={userData?.assistantImage}
                className="w-72 h-96 object-cover rounded-3xl shadow-lg"
                alt=""
            />

            <h1 className="text-white text-xl font-semibold">
                I'm {userData?.assistantName}
            </h1>

            
            <button
                onClick={startRecognition}
                className={`px-8 py-3 rounded-full font-semibold transition 
                ${listening
                        ? "bg-red-500 animate-pulse text-white"
                        : "bg-green-500 text-white"}`}
            >
                {listening ? "Listening..." : "Start Assistant"}
            </button>
            
        </div>
    )
}

export default Home
