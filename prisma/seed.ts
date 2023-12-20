import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.item.create({
    data: {
        name: "Mléko",
        count: 3,
        unit: "ks",
        done: false
    },
  });
}
/*
model Item {
  id Int @id @default(autoincrement())
  name String  
  count  Float
  createdAt DateTime @default(now())
  unit String
  done Boolean
}
*/

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });