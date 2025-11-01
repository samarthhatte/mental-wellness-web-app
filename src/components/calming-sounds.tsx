import { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  icon: string;
  description: string;
  url: string;
  isPlaying: boolean;
  volume: number;
}

export function CalmingSounds() {
  const [sounds, setSounds] = useState<Sound[]>([
    {
      id: 'rain',
      name: 'Rain',
      icon: '🌧️',
      description: 'Gentle rainfall sounds',
      url: '/sounds/rain.mp3', // These would be actual audio files in a real app
      isPlaying: false,
      volume: 50,
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      icon: '🌊',
      description: 'Peaceful ocean waves',
      url: '/sounds/ocean.mp3',
      isPlaying: false,
      volume: 50,
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: '🌲',
      description: 'Birds and nature sounds',
      url: '/sounds/forest.mp3',
      isPlaying: false,
      volume: 50,
    },
    {
      id: 'fireplace',
      name: 'Fireplace',
      icon: '🔥',
      description: 'Crackling fireplace',
      url: '/sounds/fireplace.mp3',
      isPlaying: false,
      volume: 50,
    },
    {
      id: 'whitenoise',
      name: 'White Noise',
      icon: '📻',
      description: 'Consistent white noise',
      url: '/sounds/whitenoise.mp3',
      isPlaying: false,
      volume: 50,
    },
    {
      id: 'cafe',
      name: 'Coffee Shop',
      icon: '☕',
      description: 'Ambient cafe sounds',
      url: '/sounds/cafe.mp3',
      isPlaying: false,
      volume: 50,
    },
  ]);

  const [masterVolume, setMasterVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Create audio elements
  useEffect(() => {
    sounds.forEach(sound => {
      if (!audioRefs.current[sound.id]) {
        // In a real app, these would be actual audio files
        // For demo purposes, we'll create silent audio elements
        const audio = new Audio();
        audio.loop = true;
        audio.volume = (sound.volume / 100) * (masterVolume / 100);
        audioRefs.current[sound.id] = audio;
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Update audio volumes when master volume or individual volumes change
  useEffect(() => {
    Object.entries(audioRefs.current).forEach(([soundId, audio]) => {
      const sound = sounds.find(s => s.id === soundId);
      if (sound) {
        audio.volume = isMuted ? 0 : (sound.volume / 100) * (masterVolume / 100);
      }
    });
  }, [sounds, masterVolume, isMuted]);

  const toggleSound = (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (!audio) return;

    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.id === soundId) {
          const newPlaying = !sound.isPlaying;
          
          if (newPlaying) {
            // In a real app, this would play the actual audio
            // For demo, we'll just simulate the play state
            console.log(`Playing ${sound.name} sound`);
            // audio.play().catch(console.error);
          } else {
            // audio.pause();
            console.log(`Pausing ${sound.name} sound`);
          }
          
          return { ...sound, isPlaying: newPlaying };
        }
        return sound;
      })
    );
  };

  const updateSoundVolume = (soundId: string, volume: number) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId ? { ...sound, volume } : sound
      )
    );
  };

  const stopAllSounds = () => {
    setSounds(prevSounds =>
      prevSounds.map(sound => {
        if (sound.isPlaying) {
          const audio = audioRefs.current[sound.id];
          if (audio) {
            audio.pause();
          }
        }
        return { ...sound, isPlaying: false };
      })
    );
  };

  const playingCount = sounds.filter(s => s.isPlaying).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Master Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2>Calming Sounds</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {playingCount} sound{playingCount !== 1 ? 's' : ''} playing
            </span>
            {playingCount > 0 && (
              <Button variant="outline" onClick={stopAllSounds}>
                Stop All
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-sm w-20">Master Volume</span>
              <Slider
                value={[masterVolume]}
                onValueChange={(value) => setMasterVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
                disabled={isMuted}
              />
              <span className="text-sm w-12 text-right">{masterVolume}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Sound Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sounds.map(sound => (
          <Card key={sound.id} className="p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{sound.icon}</div>
              <h3 className="mb-1">{sound.name}</h3>
              <p className="text-sm text-muted-foreground">{sound.description}</p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => toggleSound(sound.id)}
                className={`w-full ${sound.isPlaying ? 'bg-green-500 hover:bg-green-600' : ''}`}
                variant={sound.isPlaying ? 'default' : 'outline'}
              >
                {sound.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Playing
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume</span>
                  <span className="text-sm text-muted-foreground">{sound.volume}%</span>
                </div>
                <Slider
                  value={[sound.volume]}
                  onValueChange={(value) => updateSoundVolume(sound.id, value[0])}
                  max={100}
                  step={1}
                  disabled={!sound.isPlaying || isMuted}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Information Card */}
      <Card className="p-6">
        <h3 className="mb-4">About Calming Sounds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="mb-2">Benefits</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Reduces stress and anxiety</li>
              <li>• Improves focus and concentration</li>
              <li>• Helps with sleep and relaxation</li>
              <li>• Masks distracting noises</li>
              <li>• Creates a peaceful environment</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2">Tips for Use</h4>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Mix different sounds for variety</li>
              <li>• Adjust volumes to your preference</li>
              <li>• Use during meditation or work</li>
              <li>• Try different combinations</li>
              <li>• Use headphones for better experience</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Note:</strong> In this demo, actual audio playback is simulated. 
            In a full implementation, these would play real calming audio files.
          </p>
        </div>
      </Card>
    </div>
  );
}