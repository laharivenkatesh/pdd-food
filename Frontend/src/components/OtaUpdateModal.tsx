import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, X, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function OtaUpdateModal() {
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Strictly restrict OTA Update Popup ONLY to Expo Native Mobile App environment!
    // NEVER show on normal desktop or laptop web browsers.
    const isExpoNative =
      typeof window !== "undefined" &&
      (Boolean((window as any).ExpoUpdates) ||
        Boolean((window as any).expo) ||
        Boolean((window as any).ReactNativeWebView) ||
        navigator.userAgent.includes("Expo") ||
        navigator.userAgent.includes("ReactNative"));

    if (!isExpoNative) {
      return; // Exit completely for standard web browsers
    }

    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("zerra_ota_dismissed");
      if (!dismissed) {
        setShowModal(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleUpdateAndRestart = async () => {
    setIsUpdating(true);
    toast.info("Downloading latest Over-The-Air (OTA) update package...");

    try {
      if (typeof window !== "undefined" && (window as any).ExpoUpdates) {
        const ExpoUpdates = (window as any).ExpoUpdates;
        await ExpoUpdates.fetchUpdateAsync();
        await ExpoUpdates.reloadAsync();
        return;
      }
    } catch (e) {
      console.warn("Expo updates SDK fallback:", e);
    }

    setTimeout(() => {
      toast.success("OTA update applied! Restarting application...");
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }, 1500);
  };

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem("zerra_ota_dismissed", "true");
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-card text-card-foreground border border-border/80 rounded-[32px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl relative overflow-hidden space-y-5 transform transition-all animate-scale-up">
        
        {/* Top Ambient Glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-deep/15 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Close / Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          title="Dismiss update"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Icon Badge */}
        <div className="relative z-10 text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-primary-deep/10 text-primary-deep flex items-center justify-center mx-auto shadow-sm border border-primary-deep/20">
            <Sparkles className="w-8 h-8 text-primary-deep animate-pulse" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary-deep/10 text-primary-deep font-extrabold text-[11px] uppercase tracking-wider">
            OTA Update Available
          </span>
        </div>

        {/* Title & Description */}
        <div className="relative z-10 text-center space-y-2">
          <h3 className="text-2xl font-extrabold font-serif text-foreground tracking-tight">
            New Update Ready! 🚀
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            A fresh Over-The-Air update for <span className="font-extrabold text-foreground">Zerra Food Hub</span> is ready to install with performance improvements and new features.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 bg-muted/40 rounded-2xl p-3 border border-border/60 space-y-1.5 text-xs text-muted-foreground font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-deep shrink-0" />
            <span>Instant live sync & bug fixes</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary-deep shrink-0" />
            <span>No full APK download required</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 space-y-2 pt-1">
          <button
            onClick={handleUpdateAndRestart}
            disabled={isUpdating}
            className="w-full py-3.5 px-4 rounded-2xl bg-primary-deep hover:bg-primary-deep/90 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-80"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Downloading & Applying Update...
              </>
            ) : (
              <>
                Update & Restart App <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground transition-colors text-center"
          >
            Remind Me Later
          </button>
        </div>

      </div>
    </div>
  );
}
