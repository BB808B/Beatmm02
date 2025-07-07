'use client';

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlay, FaPause, FaHeart, FaRegHeart, FaShare } from 'react-icons/fa';
import Image from 'next/image';
import { MusicCardProps } from '@/types';

const MusicCard: React.FC<MusicCardProps> = ({
  track,
  isPlaying,
  isCurrentTrack,
  onPlay,
  onPause,
  onLike,
  translations
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <Card className="card-custom h-100">
      <div className="position-relative">
        <Image
          src={track.cover}
          alt={track.title}
          width={300}
          height={200}
          className="card-img-top"
          style={{ objectFit: 'cover' }}
        />
        
        {/* 播放按钮覆盖层 */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            background: 'rgba(0,0,0,0.5)', 
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
        >
          <Button
            variant="primary"
            className="btn-primary-custom rounded-circle"
            style={{ width: '60px', height: '60px' }}
            onClick={() => {
              if (isCurrentTrack && isPlaying) {
                onPause();
              } else {
                onPlay(track);
              }
            }}
          >
            {isCurrentTrack && isPlaying ? <FaPause /> : <FaPlay />}
          </Button>
        </div>

        {/* 播放状态指示器 */}
        {isCurrentTrack && (
          <div 
            className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded"
            style={{ background: 'var(--primary-color)', fontSize: '0.8rem' }}
          >
            {isPlaying ? '正在播放' : '已暂停'}
          </div>
        )}
      </div>

      <Card.Body>
        <Card.Title className="text-truncate" style={{ fontSize: '1.1rem' }}>
          {track.title}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted text-truncate">
          {track.artist}
        </Card.Subtitle>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            {formatPlays(track.plays)} 播放
          </small>
          <small className="text-muted">
            {formatDuration(track.duration)}
          </small>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-2">
            <Button
              variant="link"
              className="text-light p-1"
              onClick={() => onLike(track.id)}
            >
              {track.isLiked ? 
                <FaHeart style={{ color: 'var(--primary-color)' }} /> : 
                <FaRegHeart />
              }
              <span className="ms-1 small">{track.likes}</span>
            </Button>
            
            <Button variant="link" className="text-light p-1">
              <FaShare />
            </Button>
          </div>

          <Button
            variant="outline-primary"
            size="sm"
            className="d-flex align-items-center"
            onClick={() => {
              if (isCurrentTrack && isPlaying) {
                onPause();
              } else {
                onPlay(track);
              }
            }}
          >
            {isCurrentTrack && isPlaying ? <FaPause className="me-1" /> : <FaPlay className="me-1" />}
            {isCurrentTrack && isPlaying ? translations.player.pause : translations.player.play}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MusicCard;

