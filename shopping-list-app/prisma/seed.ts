import prisma from "../lib/prisma"

async function main() {
    await prisma.units.createMany({
        data: [
            {
                name: "kilograms",
                abriviation: "kg"
            },
            {
                name: "unit",
                abriviation: ""
            },
            {
                name: "grams",
                abriviation: "g"
            },
            {
                name: "liters",
                abriviation: "l"
            },
            {
                name: "mili-liters",
                abriviation: "ml"
            }
        ]

    })

    await prisma.items.createMany({
        data: [
            {
                id: 1,
                name: "Prvni item",
                count: 2,
                //unit Units
                unitId: 1,
                done: false,
            },
            {
                id: 1,
                name: "Druhy item",
                count: 2,
                //unit Units
                unitId: 1,
                done: false,
            }
        ]
    })
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});