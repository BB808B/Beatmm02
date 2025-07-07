'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  FaPlay, 
  FaPause, 
  FaStepForward, 
  FaStepBackward, 
  FaVolumeUp, 
  FaRandom, 
  FaRedo,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import Image from 'next/image';
import { MusicPlayerProps } from '@/types';

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />
      
      <Container fluid>
        <Row className="align-items-center py-2">
          {/* 歌曲信息 */}
          <Col md={3} className="d-flex align-items-center">
            <Image
              src={currentTrack.cover}
              alt={currentTrack.title}
              width={50}
              height={50}
              className="rounded me-3"
              style={{ objectFit: 'cover' }}
            />
            <div>
              <div className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>
                {currentTrack.title}
              </div>
              <div className="text-muted small text-truncate" style={{ maxWidth: '150px' }}>
                {currentTrack.artist}
              </div>
            </div>
            <Button
              variant="link"
              className="text-light ms-2"
              onClick={() => setIsLiked(!isLiked)}
            >
              {isLiked ? <FaHeart style={{ color: 'var(--primary-color)' }} /> : <FaRegHeart />}
            </Button>
          </Col>

          {/* 播放控制 */}
          <Col md={6}>
            <div className="d-flex justify-content-center align-items-center mb-2">
              <Button
                variant="link"
                className="text-light me-3"
                onClick={() => setIsShuffled(!isShuffled)}
                style={{ opacity: isShuffled ? 1 : 0.6 }}
              >
                <FaRandom />
              </Button>
              
              <Button variant="link" className="text-light me-2" onClick={onPrevious}>
                <FaStepBackward />
              </Button>
              
              <Button
                variant="primary"
                className="btn-primary-custom rounded-circle me-2"
                onClick={isPlaying ? onPause : onPlay}
                style={{ width: '50px', height: '50px' }}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </Button>
              
              <Button variant="link" className="text-light me-3" onClick={onNext}>
                <FaStepForward />
              </Button>
              
              <Button
                variant="link"
                className="text-light"
                onClick={() => setIsRepeated(!isRepeated)}
                style={{ opacity: isRepeated ? 1 : 0.6 }}
              >
                <FaRedo />
              </Button>
            </div>

            {/* 进度条 */}
            <div className="d-flex align-items-center">
              <span className="small me-2">{formatTime(currentTime)}</span>
              <input
                type="range"
                className="form-range flex-grow-1"
                min="0"
                max={currentTrack.duration}
                value={currentTime}
                onChange={handleSeek}
                style={{ accentColor: 'var(--primary-color)' }}
              />
              <span className="small ms-2">{formatTime(currentTrack.duration)}</span>
            </div>
          </Col>

          {/* 音量控制 */}
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <FaVolumeUp className="me-2" />
            <input
              type="range"
              className="form-range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              style={{ width: '100px', accentColor: 'var(--primary-color)' }}
            />
            <span className="small ms-2">{volume}%</span>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MusicPlayer;

