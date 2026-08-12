import { View, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from "react";
import { useLanguage } from '@/context/LanguageContext';

export default function LiveCountdown({ postedAt, expiryHours, urgent }: { postedAt: string; expiryHours: number, urgent?: boolean }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const postedTime = new Date(postedAt).getTime();
    const validPostedTime = isNaN(postedTime) ? Date.now() : postedTime;
    
    const expiryTime = validPostedTime + expiryHours * 60 * 60 * 1000;
    
    const update = () => {
      const now = Date.now();
      const diff = expiryTime - now;
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("");
        return;
      }
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      const pad = (num: number) => num.toString().padStart(2, "0");
      setIsExpired(false);
      setTimeLeft(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [postedAt, expiryHours]);

  if (isExpired) {
    return <Text style={[styles.text, styles.urgentText]}>{t('expiredText')}</Text>;
  }

  return (
    <Text style={[styles.text, urgent ? styles.urgentText : styles.normalText]}>
      {urgent ? t('urgentLeft', { time: timeLeft }) : t('expiresInPrefix', { time: timeLeft })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
    letterSpacing: -0.5,
  },
  urgentText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  normalText: {
    color: '#4B5563',
  },
});
