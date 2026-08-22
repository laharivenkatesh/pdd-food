import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert, Platform } from 'react-native';
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setReviews(initial);
  }, [initial]);

  const submit = async () => {
    if (!user) {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert("Please login to submit a review");
      } else {
        Alert.alert("Login Required", "Please login to submit a review");
      }
      return;
    }

    if (!rating) {
      const msg = "Please select a star rating (1 to 5 stars) before submitting!";
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert("Rating Required", msg);
      }
      return;
    }

    if (!comment.trim()) {
      const msg = "Please type a short comment/experience before submitting!";
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert("Comment Required", msg);
      }
      return;
    }

    setSubmitting(true);
    try {
      // Verify eligibility: User must have claimed/collected this food item (or be the owner/collector)
      const { data: userTxs } = await supabase
        .from("transactions")
        .select("id")
        .eq("food_id", foodId)
        .eq("collector_id", user.id);

      const hasClaimed = userTxs && userTxs.length > 0;
      const isOwner = user.id === providerId;

      if (!hasClaimed && !isOwner) {
        const notEligibleMsg = "Only community members who have booked or collected this food post can leave a rating & review!";
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
          window.alert(notEligibleMsg);
        } else {
          Alert.alert("Review Eligibility", notEligibleMsg);
        }
        setSubmitting(false);
        return;
      }

      const userName = profile?.name || user.email?.split("@")[0] || "Community Member";

      const { data, error } = await supabase
        .from("reviews")
        .insert({
          food_id: foodId,
          user_id: user.id,
          user_name: userName,
          rating,
          comment: comment.trim(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error);
        const errMsg = error.message || "Failed to submit review. Please try again.";
        if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
          window.alert(`Review Error: ${errMsg}`);
        } else {
          Alert.alert("Review Failed", errMsg);
        }
        return;
      }

      // Recalculate provider's overall trust score and review count across all their foods.
      // Uses only valid ratings (integer 1–5). Never defaults a missing rating to 5.
      if (providerId) {
        try {
          const { data: providerFoods } = await supabase
            .from("foods")
            .select("id")
            .eq("user_id", providerId);

          if (providerFoods && providerFoods.length > 0) {
            const foodIds = providerFoods.map((f: any) => f.id);
            const { data: allProviderReviews } = await supabase
              .from("reviews")
              .select("rating")
              .in("food_id", foodIds);

            // Only count reviews with a valid rating in [1, 5]
            const validReviews = (allProviderReviews || []).filter(
              (r: any) => typeof r.rating === "number" && r.rating >= 1 && r.rating <= 5
            );

            if (validReviews.length > 0) {
              const totalRating = validReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
              const avgScore = Number((totalRating / validReviews.length).toFixed(1));
              await supabase
                .from("profiles")
                .update({
                  trust_score: avgScore,
                  review_count: validReviews.length,
                })
                .eq("id", providerId);
            } else {
              // No valid reviews → clear the score so the UI shows "No ratings yet"
              await supabase
                .from("profiles")
                .update({ trust_score: null, review_count: 0 })
                .eq("id", providerId);
            }
          }
        } catch (updateErr) {
          console.warn("Provider rating calculation notice:", updateErr);
        }
      }

      // Notify donor if reviewer is another user
      if (providerId && providerId !== user.id) {
        await supabase.from("notifications").insert({
          user_id: providerId,
          food_id: foodId,
          title: "⭐ New Review Received!",
          message: `${userName} left a ${rating}-star review: "${comment.trim()}"`,
        });
      }

      setReviews((prev) => [
        {
          id: data.id,
          user: userName,
          rating,
          comment: comment.trim(),
          date: "just now",
        },
        ...prev,
      ]);

      setRating(0);
      setComment("");
      const successMsg = "Thank you! Your review has been saved and provider overall ratings updated.";
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(`⭐ Review Submitted!\n${successMsg}`);
      } else {
        Alert.alert("⭐ Review Submitted!", successMsg);
      }
    } catch (err: any) {
      console.error("Exception submitting review:", err);
      const msg = err.message || "An error occurred. Please try again.";
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.alert) {
        window.alert(msg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setSubmitting(false);
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
        <TouchableOpacity onPress={submit} disabled={submitting} style={[styles.btnPrimary, submitting && { opacity: 0.6 }]}>
          <Text style={styles.btnText}>{submitting ? "Submitting..." : "Submit Review"}</Text>
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
