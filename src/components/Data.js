import { useEffect, useState } from "react";

const Data = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8090/video-streamer/videos");
		console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        // Transform the received data to match the format of Data.js
        const formattedData = jsonData.data.map(item => ({
		      id: item.id,	
          img: item.img,
          link: item.link,
          title: item.title,
          description: item.description,
          count_of_upvotes: item.count_of_upvotes,
          count_of_dislikes: item.count_of_dislikes
        }));
        setVideos(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return videos;
};

export default Data;
