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
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});