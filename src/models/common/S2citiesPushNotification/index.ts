import { RawIntEnum } from "@/utils/types";
import { ExpoPushMessage } from "expo-server-sdk";

export enum NotificationType {
   HandSignalAlert = 1,
   GenericAlert = 2,
   EmergencyAlert = 3,
}

export type RawNotificationType = RawIntEnum<NotificationType>;

export type IS2citiesPushNotification = {
   type: NotificationType;
   data: object;
};

export class S2citiesPushNotification implements IS2citiesPushNotification {
   type: NotificationType;
   data: object;

   constructor(iNotification: IS2citiesPushNotification) {
      this.type = iNotification.type;
      this.data = iNotification.data;
   }

   toExpoPushNotification(receiversTokens: string[]): ExpoPushMessage {
      return {
         to: receiversTokens,
         sound: "default",
         title: this.notificationTitle(),
         body: this.notificationBody(),
         data: this.notificationData(),
      };
   }

   notificationTitle(): string {
      switch (this.type) {
         case NotificationType.HandSignalAlert:
            return "S2CITIES Alert";

         case NotificationType.GenericAlert:
            return "S2CITIES Alert";

         case NotificationType.EmergencyAlert:
            return "S2CITIES Alert";

         default:
            return "S2CITIES";
      }
   }

   notificationBody(): string {
      switch (this.type) {
         case NotificationType.HandSignalAlert:
            return "* A new Hand Signal Alert has been detected by S2CITIES *";

         case NotificationType.GenericAlert:
            return "* A new Generic Alert has been detected by S2CITIES *";

         case NotificationType.EmergencyAlert:
            return "* A new Emergency Alert has been detected by S2CITIES *";

         default:
            return "You received a new message from the S2CITIES app";
      }
   }

   notificationData(): { type: RawNotificationType; data: object } {
      return {
         type: this.type,
         data: this.data,
      };
   }
}
