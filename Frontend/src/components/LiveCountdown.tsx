import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Platform } from 'react-native';
import { useState, useEffect } from "react";

export default function LiveCountdown({ postedAt, expiryHours, urgent }: { postedAt: string; expiryHours: number, urgent?: boolean }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // If postedAt is not valid, fallback to current time
    const postedTime = new Date(postedAt).getTime();
    const validPostedTime = isNaN(postedTime) ? Date.now() : postedTime;
    
    const expiryTime = validPostedTime + expiryHours * 60 * 60 * 1000;
    
    const update = () => {
      const now = Date.now();
      const diff = expiryTime - now;
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      const pad = (num: number) => num.toString().padStart(2, "0");
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [postedAt, expiryHours]);

  return (
    <Text style={styles.text}>
      {urgent ? `🔥 Urgent · ${timeLeft} left` : `⏳ Expires in ${timeLeft}`}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
});

