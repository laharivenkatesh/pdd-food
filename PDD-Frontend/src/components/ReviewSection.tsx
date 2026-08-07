import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { useState, useEffect } from "react";
import { Review } from "@/types/food";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from '@expo/vector-icons';

interface ReviewSectionProps {
  foodId: string;
  providerId: string;
  initial: Review[];
}

export default function ReviewSection({ foodId, providerId, initial }: ReviewSectionProps) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setReviews(initial);
  }, [initial]);

  const submit = async () => {
    if (!rating || !comment.trim()) return;
    if (!user || !profile) {
      Alert.alert("Login Required", "Please login to submit a review");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          food_id: foodId,
          user_id: user.id,
          user_name: profile.name || "Anonymous",
          rating,
          comment,
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        Alert.alert("Error", "Failed to submit review");
        return;
      }

      if (providerId && providerId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: providerId,
          food_id: foodId,
          title: "⭐ New Review Received!",
          message: `${profile.name || "A collector"} left a ${rating}-star review: "${comment}"`,
        });
      }

      setReviews([
        {
          id: data.id,
          user: profile.name || "You",
          rating,
          comment,
          date: "just now",
        },
        ...reviews,
      ]);

      setRating(0);
      setComment("");
      Alert.alert("Success", "✅ Feedback submitted");
    } catch (err) {
      console.error("Exception submitting review:", err);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews</Text>

      <View style={styles.formContainer}>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(i => (
            <TouchableOpacity key={i} onPress={() => setRating(i)}>
              <Ionicons 
                name={i <= rating ? "star" : "star-outline"} 
                size={28} 
                color={i <= rating ? "#F59E0B" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience…"
          multiline
          numberOfLines={3}
          style={styles.inputField}
        />
        <TouchableOpacity onPress={submit} style={styles.btnPrimary}>
          <Text style={styles.btnText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsList}>
        {reviews.length === 0 && (
          <Text style={styles.emptyText}>No reviews yet.</Text>
        )}
        {reviews.map(r => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.userName}>{r.user}</Text>
              <Text style={styles.dateText}>{r.date}</Text>
            </View>
            <View style={styles.starsRowSmall}>
              {[1, 2, 3, 4, 5].map(i => (
                <Ionicons 
                  key={i} 
                  name={i <= r.rating ? "star" : "star-outline"} 
                  size={16} 
                  color={i <= r.rating ? "#F59E0B" : "#D1D5DB"} 
                />
              ))}
            </View>
            <Text style={styles.commentText}>{r.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    fontWeight: '800',
    fontSize: 18,
    color: '#111827',
  },
  formContainer: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 80,
  },
  btnPrimary: {
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  reviewsList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1F2937',
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  starsRowSmall: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
  },
});
