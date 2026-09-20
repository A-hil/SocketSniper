import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const db = new PrismaClient({ adapter });

export interface GiftData {
  id: string;
  giftTypeId: string;
  buyPrice: number;
  buyTxHash: string;
  lt: bigint | number;
}

export async function EventByCollection(eventData: GiftData){
  try {
    const newGift = await db.giftItem.create({
        data: {
        id: eventData.id,
        giftTypeId: eventData.giftTypeId,
        buyPrice: eventData.buyPrice,
        buyTxHash: eventData.buyTxHash,
        lt: BigInt(eventData.lt),
    },
  });

  console.log(`Подарок ${eventData.id} добавлен в базу данных`)
} catch (error) {
    console.error("Ошибка при вставке данных в базу данных:", error);
  }
}