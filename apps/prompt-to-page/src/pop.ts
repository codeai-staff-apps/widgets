/**
 * The soft "pop" that goes with the spark. Synthesized with Web Audio — a short
 * sine blip whose pitch drops quickly under a fast-decaying gain envelope — so
 * there is no audio file and no network request. The AudioContext is created
 * lazily on the first call, which always comes from a click (a user gesture).
 */
let context: AudioContext | undefined;

export function playPop(): void {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) {
      return;
    }
    context ??= new Ctor();
    if (context.state === 'suspended') {
      void context.resume();
    }
    const start = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(720, start);
    oscillator.frequency.exponentialRampToValueAtTime(240, start + 0.09);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.1, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.14);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.15);
  } catch {
    // Audio is a nicety; never let it break the interaction.
  }
}
