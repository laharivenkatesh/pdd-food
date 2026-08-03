import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Review } from "@/types/food";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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
      toast.error("Please login to submit a review");
      return;
    }

    try {
      // 1. Insert review into Supabase
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
        toast.error("Failed to submit review");
        return;
      }

      // 2. Insert notification for provider (only if reviewer is not the provider themselves)
      if (providerId && providerId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: providerId,
          food_id: foodId,
          title: "⭐ New Review Received!",
          message: `${profile.name || "A collector"} left a ${rating}-star review: "${comment}"`,
        });
      }

      // 3. Update local state
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
      toast.success("✅ Feedback submitted");
    } catch (err) {
      console.error("Exception submitting review:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reviews</Text>

      <View style={styles.formContainer}>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
              <Ionicons
                name={i <= rating ? "star" : "star-outline"}
                size={28}
                color={i <= rating ? "#f59e0b" : "#5c7066"}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience…"
          placeholderTextColor="rgba(30, 56, 43, 0.6)"
          multiline={true}
          numberOfLines={3}
          style={styles.inputField}
        />
        <TouchableOpacity onPress={submit} style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitBtnText}>Submit Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {reviews.length === 0 && (
          <Text style={styles.emptyText}>No reviews yet.</Text>
        )}
        {reviews.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.userName}>{r.user}</Text>
              <Text style={styles.reviewDate}>{r.date}</Text>
            </View>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= r.rating ? "star" : "star-outline"}
                  size={16}
                  color={i <= r.rating ? "#f59e0b" : "#5c7066"}
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
    fontSize: 18,
    fontWeight: '800',
    color: '#1e382b',
  },
  formContainer: {
    backgroundColor: 'rgba(246, 244, 236, 0.5)',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inputField: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#ededeb',
    borderWidth: 1,
    borderColor: '#e8e6df',
    fontSize: 14,
    color: '#1e382b',
    textAlignVertical: 'top',
  },
  submitBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#309267',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#5c7066',
    textAlign: 'center',
    paddingVertical: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1e382b',
  },
  reviewDate: {
    fontSize: 12,
    color: '#5c7066',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginVertical: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#1e382b',
  },
});

