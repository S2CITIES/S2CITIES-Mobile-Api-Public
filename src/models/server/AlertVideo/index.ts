import { Filter, ObjectId, WithId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";

export type IAlertVideo = {
   _id?: ObjectId;
   created: Date;
   v: number;

   format: string; // it is the video extension, without the starting period (e.g. 'mp4', 'mov', etc.)
   key: string; // random key associated to the video
};

export class AlertVideo implements WithId<IAlertVideo> {
   _id: ObjectId;
   created: Date;
   v: number;

   format: string; // it is the video extension, without the starting period (e.g. 'mp4', 'mov', etc.)
   key: string; // random key associated to the video

   static get collectionName() {
      return "alert-videos";
   }

   constructor(iAlertVideo: IAlertVideo) {
      this.fromInterface(iAlertVideo);

      this.format = iAlertVideo.format;
      this.key = iAlertVideo.key;
   }

   videoResourceKey() {
      return `${this.key}/${this._id.toHexString()}_video.${this.format}`; // custom convention
   }

   static async create(alertVideo: IAlertVideo): Promise<AlertVideo | null> {
      const iAlertVideo = await mongoDao.insertOne<IAlertVideo>(
         AlertVideo.collectionName,
         alertVideo,
      );
      return iAlertVideo ? new AlertVideo(iAlertVideo) : null;
   }

   static async getById(_id: ObjectId): Promise<AlertVideo | null> {
      const iAlertVideo = await mongoDao.findOne<IAlertVideo>(
         AlertVideo.collectionName,
         {
            _id,
         },
      );
      return iAlertVideo ? new AlertVideo(iAlertVideo) : null;
   }

   async patch(fields: Partial<IAlertVideo>): Promise<void> {
      const result = await mongoDao.updateOne<IAlertVideo>(
         AlertVideo.collectionName,
         {
            _id: this._id,
         },
         {
            $set: fields,
         },
      );
      if (result.modifiedCount !== 1) {
         throw new Error("Patch op was not applied successfully");
      }
      await this.refresh();
   }

   static async delete(_id: ObjectId): Promise<void> {
      const result = await mongoDao.deleteOne<IAlertVideo>(
         AlertVideo.collectionName,
         {
            _id,
         },
      );
      if (result.deletedCount !== 1) {
         throw new Error("Delete op was not applied successfully");
      }
   }

   static async getList(
      filter: Filter<IAlertVideo> = {},
      {
         limit = 10,
         skip = 0,
         sort = [],
         projection = null,
      }: {
         limit?: number;
         skip?: number;
         sort?: {
            by: keyof IAlertVideo;
            asc: boolean;
         }[];
         projection?: Document;
      } = {
         limit: 10,
         skip: 0,
         sort: [],
         projection: null,
      },
   ): Promise<AlertVideo[]> {
      const iAlertVideos = await mongoDao.findMany<IAlertVideo>(
         AlertVideo.collectionName,
         filter,
         {
            limit,
            skip,
            sort: sort.length
               ? Object.fromEntries(
                    sort.map((pair) => [pair.by, pair.asc ? 1 : -1]),
                 )
               : undefined,
            projection,
         },
      );
      return iAlertVideos.map((iAlertVideo) => new AlertVideo(iAlertVideo));
   }

   /* Mostly for internal use */

   fromInterface(iAlertVideo: IAlertVideo) {
      if (!iAlertVideo._id) {
         throw new Error("Interface object doesn't have an _id");
      }
      this._id = iAlertVideo._id;
      this.created = iAlertVideo.created;
      this.v = iAlertVideo.v;
   }

   async refresh() {
      const iAlertVideo = await mongoDao.findOne<IAlertVideo>(
         AlertVideo.collectionName,
         {
            _id: this._id,
         },
      );
      if (iAlertVideo) {
         this.fromInterface(iAlertVideo);
      } else {
         throw new Error("Couldn't find document in DB");
      }
   }
}
