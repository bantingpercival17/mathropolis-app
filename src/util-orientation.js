// utils/orientation.ts
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

export async function safeLockOrientation(type) {
    if (Capacitor.getPlatform() === 'web') {
        console.warn('Screen orientation lock not available in browser. Requested:', type);
        return;
    }
    try {
        await ScreenOrientation.lock({ type });
        await ScreenOrientation.unlock();
        console.log(`Screen orientation locked to ${type}`);
    } catch (e) {
        console.error('Failed to lock screen orientation:', e);
    }
}

export async function safeUnlockOrientation() {
    if (Capacitor.getPlatform() === 'web') return;
    try {
        await ScreenOrientation.unlock();
        console.log('Screen orientation unlocked');
    } catch (e) {
        console.error('Failed to unlock screen orientation:', e);
    }
}
