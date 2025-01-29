import { useState, useEffect, useRef } from "react";
import Data from "./Data";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import ReactPlayer from "react-player";

const VideoPlayer = ({ video, isActive, onEnded }) => {
    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent default right-click context menu
    };
  
    return (
      <ReactPlayer
        className="w-full"
        url={video.link}
        controls
        width="315px"
        height="564px"
        playing={isActive}
        onEnded={onEnded}
        onContextMenu={handleContextMenu} // Disable right-click context menu
        config={{
          youtube: {
            playerVars: { 
              rel: 0, // Disable related videos
              modestbranding: 1, // Hide YouTube logo
              fs: 1, // Disable fullscreen option
            },
          },
        }}
      />
    );
  };
  
  
  
  const VoteButtons = ({ onThumbsUp, onThumbsDown, upvotes, downvotes }) => {
    return (
      <div className="text-center mt-40 ml-4 mr-4">
        <div>
          <div className="rounded-full bg-blue-500 p-3 shadow-lg center">
            <FaThumbsUp size={50} color="white" onClick={onThumbsUp} />
          </div>
          <span>{upvotes}</span>
        </div>
        <div>
          <div className="rounded-full bg-red-500 p-3 shadow-lg center mt-4">
            <FaThumbsDown size={50} color="white" onClick={onThumbsDown} />
          </div>
          <span>{downvotes}</span>
        </div>
      </div>
    );
  };
  
  
  const VideoInfo = ({ description }) => {
    return (
      <div className="flex justify-center mt-2">
        <p className="px-4">{description}</p>
      </div>
    );
  };
  
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
    const intervalId = setInterval(() => {
        // Check if the videoRefs and the corresponding player exist
        if (videoRefs.current[activeIndex] && videoRefs.current[activeIndex].getInternalPlayer) {
            const player = videoRefs.current[activeIndex].getInternalPlayer();
            if (player) {
                const currentTime = player.getCurrentTime();
                const duration = player.getDuration();
                // Check if the current video has reached its end
                if (currentTime && duration && currentTime >= duration) {
                    playNextVideo();
                }
            }
        }
    }, 1000); // Check video completion every second
    return () => clearInterval(intervalId); // Cleanup interval
}, [activeIndex]);



    return (
        <div className="flex justify-center items-center h-full w-full">
          <div className="max-w-screen-xl overflow-hidden">
            <div className="lg:flex lg:flex-row justify-center">
              <div className=" mt-4 hover: p-4 border-2 rounded-xl shadow-xl shadow">
                <h3 className="text-2xl p-2 font-semibold">Shorts</h3>
                {videos.map((video, index) => (
                  <div key={index} ref={el => (videoRefs.current[index] = el)} className={`mt-4 mr-4 ml-4 hover:bg-gray-300 p-4 border-2 rounded-xl shadow-xl shadow-gray-300 ${activeIndex === index ? 'bg-gray-300' : ''}`}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <VideoPlayer video={video} isActive={index === activeIndex} onEnded={playNextVideo} />
                      <VoteButtons
                        onThumbsUp={() => handleThumbsUp(video.id)}
                        onThumbsDown={() => handleThumbsDown(video.id)}
                        upvotes={video.count_of_upvotes}
                        downvotes={video.count_of_dislikes}
                      />
                    </div>
                    <VideoInfo description={video.description} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }