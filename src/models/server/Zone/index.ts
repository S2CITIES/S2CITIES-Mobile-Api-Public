import { Filter, ObjectId, WithId } from "mongodb";
import mongoDao from "@/lib/mongodb/mongo-dao";
import { IZoneFe } from "@/models/client/ZoneFe";

export type IZone = {
   _id?: ObjectId;
   created: Date;
   v: number;

   // custom props
   name: string;
   address: string;
   latitude: string;
   longitude: string;
   users: ObjectId[];
};

export class Zone implements WithId<IZone> {
   _id: ObjectId;
   created: Date;
   v: number;

   // custom props
   name: string;
   address: string;
   latitude: string;
   longitude: string;
   users: ObjectId[];

   static get collectionName() {
      return "zones";
   }

   constructor(iZone: IZone) {
      this.fromInterface(iZone);

      this.name = iZone.name;
      this.address = iZone.address;
      this.latitude = iZone.latitude;
      this.longitude = iZone.longitude;
      this.users = iZone.users;
   }

   toClientVersion(
      formattedUsers: { id: string; first_name: string; last_name: string }[],
   ): IZoneFe {
      let result = {
         _id: this._id?.toHexString() ?? "",
         name: this.name,
         address: this.address,
         latitude: this.latitude,
         longitude: this.longitude,
         users: formattedUsers,
      };

      return result;
   }

   static async create(
      name: string,
      address: string,
      latitude: string,
      longitude: string,
      users: ObjectId[] = [],
   ): Promise<Zone | null> {
      const iZone = await mongoDao.insertOne<IZone>(Zone.collectionName, {
         created: new Date(),
         v: 1,

         name,
         address,
         latitude,
         longitude,
         users,
      });
      return iZone ? new Zone(iZone) : null;
   }

   static async getById(_id: ObjectId): Promise<Zone | null> {
      const iZone = await mongoDao.findOne<IZone>(Zone.collectionName, {
         _id,
      });
      return iZone ? new Zone(iZone) : null;
   }

   async patch(fields: Partial<IZone>): Promise<void> {
      const result = await mongoDao.updateOne<IZone>(
         Zone.collectionName,
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
      const result = await mongoDao.deleteOne<IZone>(Zone.collectionName, {
         _id,
      });
      if (result.deletedCount !== 1) {
         throw new Error("Delete op was not applied successfully");
      }
   }

   static async getList(
      filter: Filter<IZone> = {},
      {
         limit = 10,
         skip = 0,
         sort = [],
         projection = null,
      }: {
         limit?: number;
         skip?: number;
         sort?: {
            by: keyof IZone;
            asc: boolean;
         }[];
         projection?: Document;
      } = {
         limit: 10,
         skip: 0,
         sort: [],
         projection: null,
      },
   ): Promise<Zone[]> {
      const iZones = await mongoDao.findMany<IZone>(
         Zone.collectionName,
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
      return iZones.map((iZone) => new Zone(iZone));
   }

   /* Mostly for internal use */

   fromInterface(iZone: IZone) {
      if (!iZone._id) {
         throw new Error("Interface object doesn't have an _id");
      }
      this._id = iZone._id;
      this.created = iZone.created;
      this.v = iZone.v;
   }

   async refresh() {
      const iZone = await mongoDao.findOne<IZone>(Zone.collectionName, {
         _id: this._id,
      });
      if (iZone) {
         this.fromInterface(iZone);
      } else {
         throw new Error("Couldn't find document in DB");
      }
   }
}
