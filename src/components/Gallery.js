import { useState, useEffect, useRef } from "react";
import Data from "./Data";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ReactPlayer from "react-player";

export default function Gallery() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const videos = Data();
    const videoRefs = useRef([]);

    const handleThumbsUp = async (videoId) => {
        setLoading(true); // Set loading to true
        try {
            const response = await fetch('http://localhost:8090/video-streamer/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    video_id: videoId,
                    voting_action: true,
                    user_id: 50003483
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit vote');
            }
            // Retrieve the updated counts from the response
            const data = await response.json();
            const updatedVideo = videos.find(video => video.id === data.data.video_id);
            if (updatedVideo) {
                updatedVideo.count_of_upvotes = data.data.count_of_upvotes;
                updatedVideo.count_of_dislikes = data.data.count_of_dislikes;
            }
        } catch (error) {
            console.error('Error submitting vote:', error.message);
        } finally {
            setLoading(false); // Reset loading
        }
    };

    const handleThumbsDown = async (videoId) => {
        setLoading(true); // Set loading to true
        try {
            const response = await fetch('http://localhost:8090/video-streamer/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    video_id: videoId,
                    voting_action: false,
                    user_id: 50003483
                })
            });
            if (!response.ok) {
                throw new Error('Failed to submit vote');
            }
            // Retrieve the updated counts from the response
            const data = await response.json();
            const updatedVideo = videos.find(video => video.id === data.data.video_id);
            if (updatedVideo) {
                updatedVideo.count_of_upvotes = data.data.count_of_upvotes;
                updatedVideo.count_of_dislikes = data.data.count_of_dislikes;
            }
        } catch (error) {
            console.error('Error submitting vote:', error.message);
        } finally {
            setLoading(false); // Reset loading
        }
    };

    // Function to play next video based on videoId
    const playNextVideo = () => {
        const nextIndex = (activeIndex + 1) % videos.length;
        setActiveIndex(nextIndex);
        // Scroll to the next video iframe
        videoRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    // Listen for changes in activeIndex and play next video
    useEffect(() => {
        const intervalId = setInterval(() => playNextVideo(videos[activeIndex].id), 20000); // Play next video every 5 seconds
        return () => clearInterval(intervalId); // Cleanup interval
    }, [activeIndex, videos]);

    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="max-w-screen-xl overflow-hidden">
                <div className="lg:flex lg:flex-row justify-center">
                    <div className=" mt-4 hover: p-4 border-2 rounded-xl shadow-xl shadow">
                        <h3 className="text-2xl p-2 font-semibold">Shorts</h3>
                        {videos.map((video, index) => {
                            return (
                                <div key={index} ref={el => (videoRefs.current[index] = el)} className={`mt-4 ml-4 hover:bg-gray-300 p-4 border-2 rounded-xl shadow-xl shadow-gray-300 ${activeIndex === index ? 'bg-gray-300' : ''}`}>
                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                        <ReactPlayer
                                            className="w-full"
                                            url={video.link}
                                            controls
                                            width="315px"
                                            height="564px"
                                            playing={index === activeIndex} // Autoplay current video
                                            onEnded={playNextVideo} // Play next video when the current one ends
                                        />
                                        <div className="text-center mt-40 ml-4">
                                            <div>
                                                <div className="rounded-full bg-blue-500 p-3 shadow-lg center">
                                                    <FaThumbsUp size={50} color="white" onClick={() => handleThumbsUp(video.id)} />
                                                </div>
                                                <span>{video.count_of_upvotes}</span>
                                            </div>
                                            <div>
                                                <div className="rounded-full bg-red-500 p-3 shadow-lg center mt-4">
                                                    <FaThumbsDown size={50} color="white" onClick={() => handleThumbsDown(video.id)} />
                                                </div>
                                                <span>{video.count_of_dislikes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mt-2">
                                        <p className="px-4">{video.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
