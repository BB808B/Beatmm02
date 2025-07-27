import { Track, User } from '@/types';

// 模拟的音轨数据
const mockTracks: Track[] = [
  { id: '1', title: 'Cybernetic Dreams', artist: 'Synthwave Rider', coverImage: 'https://images.unsplash.com/photo-1594623930335-94a4b634604c?w=800&auto=format&fit=crop', duration: 235 },
  { id: '2', title: 'Neon Pulse', artist: 'DJ Vector', coverImage: 'https://images.unsplash.com/photo-1519692933481-e14e246e46d4?w=800&auto=format&fit', duration: 210 },
  { id: '3', title: 'Midnight Drive', artist: 'Chrome Driver', coverImage: 'https://images.unsplash.com/photo-1574362846830-a3e1b7a2e06a?w=800&auto=format&fit=crop', duration: 180 },
  { id: '4', title: 'Metropolis Groove', artist: 'Android Funk', coverImage: 'https://images.unsplash.com/photo-1557764125-4c5a0a3a7f1a?w=800&auto=format&fit=crop', duration: 220 },
  { id: '5', title: 'Data Stream', artist: 'Binary Beats', coverImage: 'https://images.unsplash.com/photo-1581695293498-e79b8841364a?w=800&auto=format&fit=crop', duration: 190 },
];

// 模拟的用户数据
const mockUser: User = {
  id: '1',
  email: 'testuser@example.com',
  full_name: 'Test User',
  avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop',
};

// 假的 API 函数
export const fetchTracks = async (): Promise<Track[]> => {
  console.log('Fetching tracks from fake API...');
  await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
  return mockTracks;
};

export const fetchTrackById = async (id: string): Promise<Track | undefined> => {
  console.log(`Fetching track with id ${id} from fake API...`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTracks.find(track => track.id === id);
};

export const fetchUser = async (): Promise<User | null> => {
  console.log('Fetching user from fake API...');
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUser;
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  console.log(`Searching for tracks with query "${query}"...`);
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!query) return [];
  return mockTracks.filter(track =>
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  );
};
