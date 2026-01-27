# Penguin Intro Animation

A delightful 10-second canvas-based intro animation featuring 10 penguins sliding through a busy winter street scene, displayed before the main website loads.

## Features

✨ **Canvas-Based Animation**
- Smooth 60 FPS animation using requestAnimationFrame
- 10 individually animated penguins with varied speeds and sizes
- Realistic sliding motion with rotation and wobble effects

🏙️ **Busy Street Scene**
- Urban winter environment with buildings
- Falling snow particles (250+ snowflakes)
- Parked cars and pedestrian silhouettes
- Street lamps with glowing effects
- Snowy road surface with road markings

🔊 **Audio Support** (Optional)
- Ambient city sounds (looping)
- Penguin slide sound effects
- Muted by default with unmute button
- Graceful fallback if audio files missing

📊 **Visual Feedback**
- Animated progress bar (0-100%)
- Smooth fade transitions
- Loading indicator

♿ **Accessibility**
- Skip button for immediate access
- Keyboard controls (Space/Enter/Escape to skip)
- Respects `prefers-reduced-motion` (auto-skips)
- ARIA labels for screen readers
- High contrast mode support
- Minimum touch targets (44px+)

📱 **Responsive Design**
- Scales to any viewport size
- Mobile-optimized controls
- Touch-friendly interface
- Handles orientation changes

## File Structure

```
components/
├── PenguinIntro.tsx           # Main animation component
├── IntroWrapper.tsx            # Wrapper with fade logic
└── penguin-animation/
    ├── Penguin.ts              # Penguin class (individual penguin logic)
    ├── Scene.ts                # Scene renderer (background, snow, etc.)
    └── AudioManager.ts         # Audio handling (optional)

public/sounds/
├── README.md                   # Instructions for adding sounds
├── slide1.mp3                  # Penguin slide sound (add manually)
├── slide2.mp3                  # Alt slide sound (add manually)
└── ambient.mp3                 # Background city sounds (add manually)

app/
├── layout.tsx                  # Updated with IntroWrapper
└── globals.css                 # Updated with intro styles
```

## How It Works

### Animation Timeline (10 seconds)

- **0-2s**: Scene fades in, first penguins enter from sides
- **2-7s**: Main penguin parade (all 10 sliding across screen)
- **7-9s**: Final penguins exit, snow continues falling
- **9-10s**: Fade to website, progress bar completes

### Display Logic

The intro plays **every time** someone visits the site, with these exceptions:

1. **Reduced Motion**: Auto-skipped for users with `prefers-reduced-motion: reduce`
2. **Skip Button**: User can skip anytime with button or keyboard
3. **Mobile Friendly**: Optimized for touch devices

### Penguin Animation

Each penguin has:
- Random size (30-50px)
- Varied speed (3-7 units/frame)
- Staggered entrance (0.8s delay between penguins)
- Slight rotation for sliding effect
- Vertical wobble for natural movement
- Direction (alternating left/right)
- Detailed rendering (body, belly, head, eyes, beak, flippers, feet)

### Scene Elements

**Background Layers:**
- Gradient sky (winter atmosphere)
- 6 buildings with lit windows
- 5 street lamps with glowing lights
- 4 parked cars (random colors)
- 3 walking pedestrians
- Snowy road surface

**Particles:**
- 250 falling snowflakes
- Varied sizes, speeds, and opacities
- Realistic drift motion

## Adding Sound Effects

Audio is **optional** and the animation works perfectly without it.

### To Add Sounds:

1. Download free sounds from:
   - [Freesound.org](https://freesound.org) - Search "slide", "whoosh", "city ambience"
   - [Zapsplat.com](https://zapsplat.com) - Professional quality sounds
   - [Mixkit.co](https://mixkit.co) - Royalty-free sounds

2. Rename files to:
   - `slide1.mp3` - Penguin sliding sound (0.5-2s)
   - `slide2.mp3` - Alternative slide sound (0.5-2s)
   - `ambient.mp3` - Background city sounds (10-30s, will loop)

3. Place in `/public/sounds/` directory

4. File specs:
   - Format: MP3
   - Size: < 100KB each
   - Bitrate: 128kbps

### Sound Behavior:

- Muted by default
- User can unmute with button
- Graceful fallback if files missing
- Uses Web Audio API
- Cleanup on component unmount

## User Controls

### Desktop
- **Skip Button**: Bottom-right corner
- **Mute Button**: Toggle audio (if sounds present)
- **Keyboard**: Space/Enter/Escape to skip

### Mobile
- **Touch Skip Button**: Bottom-right
- **Touch Mute Button**: Toggle audio
- Controls stack vertically on small screens

## Customization

### Adjust Animation Duration

In `PenguinIntro.tsx`, line 45:

```typescript
const duration = 10; // Change to desired seconds
```

### Change Number of Penguins

In `PenguinIntro.tsx`, line 32:

```typescript
penguinsRef.current = Array.from({ length: 10 }, (_, i) => {
  // Change 10 to desired number
```

### Modify Scene Colors

Edit `Scene.ts` to change:
- Sky gradient (line 128)
- Building colors (line 85)
- Snow colors (line 272)
- Road surface (line 223)

### Disable for Specific Routes

In `IntroWrapper.tsx`, add route checking:

```typescript
const pathname = usePathname();
if (pathname === '/admin') {
  return <>{children}</>;
}
```

## Performance

- **60 FPS** smooth animation on modern devices
- **Hardware accelerated** canvas rendering
- **Optimized** for mobile devices
- **Lazy loaded** component (no SSR)
- **Clean memory** management with proper cleanup

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS, Android)
- ⚠️ IE11 not supported (uses modern Canvas API)

## Testing

### Test the Animation

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Watch the penguin parade! 🐧

### Test Accessibility

1. Press Tab to focus skip button
2. Press Space/Enter to skip
3. Test with screen reader
4. Enable reduced motion in OS settings (should auto-skip)

### Test Mobile

1. Open Chrome DevTools
2. Toggle device toolbar (Cmd+Shift+M)
3. Test various viewport sizes
4. Test touch interactions

## Troubleshooting

### Animation not showing
- Check browser console for errors
- Verify files exist in `components/penguin-animation/`
- Clear browser cache

### Audio not working
- Check if sound files exist in `/public/sounds/`
- Click unmute button
- Check browser console for audio errors
- Some browsers require user interaction before playing audio

### Performance issues
- Reduce number of snow particles in `Scene.ts` (line 50)
- Reduce number of penguins (line 32 in `PenguinIntro.tsx`)
- Check browser GPU acceleration settings

### Skip button not working
- Check browser console for React errors
- Verify keyboard event handlers
- Test with different browsers

## Future Enhancements

Potential improvements:

- [ ] Add more penguin animations (jumping, waving)
- [ ] Interactive elements (click penguins for effects)
- [ ] Seasonal variations (summer, fall, spring themes)
- [ ] Particle effects (sparkles, confetti)
- [ ] Multiple scene options
- [ ] Save "don't show again" preference
- [ ] Add celebration effects on skip
- [ ] Easter eggs (click sequence unlocks bonus)

## Credits

Built with:
- React 18
- TypeScript
- HTML5 Canvas API
- Web Audio API (optional)
- Next.js 14

---

Made with ❤️ for Therma

🐧 Enjoy the penguin parade! 🐧
