import { S2citiesPushNotification } from "@/models/common/S2citiesPushNotification";
import { User } from "@/models/server/User";
import { Expo, ExpoPushMessage } from "expo-server-sdk";

export async function sendPushNotificationTo(
   users: User[],
   notification: S2citiesPushNotification,
) {
   const tokensToDeleteByUser: {
      user: User;
      tokensToDelete: string[];
   }[] = [];

   const tokensToUse: string[] = [];

   // Create a new Expo SDK client
   // optionally providing an access token if you have enabled push security
   const expo = process.env.EXPO_ACCESS_TOKEN
      ? new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })
      : new Expo();

   // check tokens validity
   for (let user of users) {
      const expoTokens = user.expoTokens ?? [];

      for (let pushToken of expoTokens) {
         // Check that all your push tokens appear to be valid Expo push tokens
         if (!Expo.isExpoPushToken(pushToken)) {
            console.error(
               `Push token ${pushToken} is not a valid Expo push token`,
            );
            const tempUser = tokensToDeleteByUser.find(
               (x) => x.user._id.toHexString() === user._id.toHexString(),
            );

            if (tempUser) {
               tempUser.tokensToDelete.push(pushToken);
            } else {
               tokensToDeleteByUser.push({
                  user: user,
                  tokensToDelete: [pushToken],
               });
            }
         } else {
            tokensToUse.push(pushToken);
         }
      }
   }

   if (tokensToUse.length === 0) {
      // no valid tokens to use -> no push to send
      return;
   }

   // Create the messages that you want to send to clients
   // (see https://docs.expo.io/push-notifications/sending-notifications/)
   const message = notification.toExpoPushNotification(tokensToUse);

   try {
      // sent push notification to recipients
      const pushTicket = await expo.sendPushNotificationsAsync([message]);
      console.log(pushTicket);

      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
   } catch (error) {
      console.error(error);
   }

   // (ignore errors for the moment)
}
