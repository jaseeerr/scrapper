import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import io from 'socket.io-client';
import song1 from "../../assets/song1.mp3"
import song2 from "../../assets/song2.mp3"
import song3 from "../../assets/song3.mp3"
import { SOCKET_URL } from '../../config/url';

// Connect to the Socket.IO server
const socket = io(`${SOCKET_URL}`);

const MusicPlayer = () => {
  const tracks = [
    { title: "Song One", src: "https://res.cloudinary.com/dfhcxw70v/video/upload/v1713953154/song1_wzifb4.mp3" },
    { title: "Song Two", src: "https://res.cloudinary.com/dfhcxw70v/video/upload/v1713953149/song2_elqkjg.mp3" },
    { title: "Song Three", src: "https://res.cloudinary.com/dfhcxw70v/video/upload/v1713953149/song3_zmyuet.mp3" }
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);  // Create a ref for the audio player

  useEffect(() => {
    socket.on('track', (index) => {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      changePlaying()
    //   document.getElementById('playBtn').click()
    });

    return () => socket.off('track');
  }, []);

  useEffect(() => {
    socket.on('pause', () => {
      setIsPlaying(false);
    //   document.getElementById('playBtn').click()
    });

    return () => socket.off('pause');
  }, []);

  useEffect(() => {
    socket.on('play', () => {
      setIsPlaying(true);
    //   document.getElementById('playBtn').click()
    });

    return () => socket.off('play');
  }, []);

  useEffect(() => {
    
    if (audioRef.current) {
      isPlaying ? audioRef.current.audioEl.current.play() : audioRef.current.audioEl.current.pause();

    }
  }, [isPlaying, currentTrackIndex]); // React on isPlaying and track change



  const changeTrack = (index) => {
    socket.emit('changeTrack', index);
  };

  const nextTrack = () => {
    changeTrack((currentTrackIndex + 1) % tracks.length);
  };

  const prevTrack = () => {
    changeTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-3">Now Playing</h2>
      <div className="text-lg mb-2">{tracks[currentTrackIndex].title}</div>
      <ReactAudioPlayer
        src={tracks[currentTrackIndex].src}
        ref={audioRef}
        controls
        className="mb-4"
      />
      <div className="flex gap-4">
        <button onClick={prevTrack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Previous
        </button>
        <button id='playBtn' onClick={()=>{
            isPlaying ?   socket.emit('pause') : socket.emit('play') 
            setIsPlaying(!isPlaying)

        }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextTrack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
