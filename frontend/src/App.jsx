import { useState } from "react";
import axios from "axios"
import ReactMarkdown from "react-markdown"
import { useEffect, useRef } from "react";
function App() {

    const [search, setSearch] = useState("");
    const [chat, setChat] = useState([])
    const scrollEnd = useRef(null)
    const [loading, setLoading] = useState(false)
    function handleChange(evnet) {
        setSearch(event.target.value)
    }

    useEffect(() => {
        scrollEnd.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [chat])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setChat((prev) => { return [...prev, { user: search }] })
        setLoading(true)
        const response = await axios.post("http://localhost:3000/chat", { message: search })
        setLoading(false)
        setChat((prev) => { return [...prev, { ai: response.data.response }] })
        setSearch("")
        const res = await axios.post("http://localhost:3000/store", { question: search, answer: response.data.response })
        if (res.data.status) {
            console.log("ok")
        } else {
            console.log("not ok")
        }
    }

    return (
        <div className="flex justify-center items-center bg-black min-h-screen">
            <div className="bg-white h-[500px] w-[700px] rounded relative">
                <div className="bg-gray-800 text-white p-3">
                    <h2 className="text-center text-xl font-bold">Chatbot</h2>
                </div>
                <div className="p-3 h-100  bg-gray-300 overflow-y-auto">
                    
                    {chat.map((data, index) => (
                        data.user ?
                            <div key={index} className="flex justify-end">
                                <div className="p-3 shadow max-w-[80%] break-words bg-white rounded mb-2">
                                    <h1>{data.user}</h1>
                                </div>
                            </div>
                            :
                            <div key={index} className="flex">
                                <div className="p-3 shadow max-w-[80%] break-words bg-white rounded mb-2">
                                    <ReactMarkdown>
                                        {data.ai}
                                    </ReactMarkdown>
                                </div>
                            </div>
                    ))}
                    {loading &&
                        <div className="flex">
                            <div className="p-3 shadow max-w-[80%] break-words bg-white rounded mb-2">
                                <p>loading...</p>
                            </div>
                        </div>
                    }
                    <div ref={scrollEnd}></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-900 text-white">
                    <form className="relative">
                        <input type="text" value={search} onChange={handleChange} name="search" placeholder="Chat with Ai" className="px-2 py-1 outline-2 w-full rounded outline-blue-400" />
                        <button onClick={handleSubmit} className="px-2 py-1 bg-green-600 rounded-right absolute right-0 top-0 bottom-0">send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default App;