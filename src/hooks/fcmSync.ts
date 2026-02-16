import { useMutation } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { getMessaging, onMessage } from "firebase/messaging";
import { requestForToken } from "../config/firebase";
import { graphqlRequest } from "../utils/axios";
import { useAuth } from "../utils/authContext";
import {
  RegisterFcmTokenDocument,
  type RegisterFcmTokenMutation,
  type RegisterFcmTokenMutationVariables,
} from "../graphql/fcmToken.generated";

export const useFcmSync = (onMessageReceived?: (payload: any) => void) => {
  const { token: userToken } = useAuth();
  const isAuthenticated = Boolean(userToken);

  // 1. Mutation with descriptive variable naming
  const { mutate: syncTokenWithBackend } = useMutation<
    RegisterFcmTokenMutation,
    Error,
    RegisterFcmTokenMutationVariables
  >({
    mutationFn: (variables) =>
      graphqlRequest(RegisterFcmTokenDocument, variables),
    onSuccess: (data) => {
      console.log("✅ FCM Token synced");
      localStorage.setItem(
        "last_synced_fcm_token",
        data.registerFcmToken.token,
      );
    },
  });

  // 2. Extracted logic to keep useEffect clean
  const handleTokenSync = useCallback(async () => {
    try {
      const fcmToken = await requestForToken();
      if (!fcmToken) return;

      const lastSynced = localStorage.getItem("last_synced_fcm_token");
      if (fcmToken !== lastSynced) {
        syncTokenWithBackend({
          registerFcmTokenInput: { token: fcmToken, deviceType: "web" },
        });
      }
    } catch (err) {
      console.error("FCM Token Retrieval Failed:", err);
    }
  }, [syncTokenWithBackend]);

 useEffect(() => {
    if (!isAuthenticated) return;

    handleTokenSync();

    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("🔔 Foreground Message:", payload);
      
      // CALL THE CALLBACK DIRECTLY
      if (onMessageReceived) {
        onMessageReceived(payload);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, handleTokenSync, onMessageReceived]);
};
