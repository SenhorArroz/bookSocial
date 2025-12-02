import "dotenv/config";
import { db } from "../src/server/db";

async function main() {
	const email = "luizrob.guimaraes@gmail.com";
	const user = await db.user.findUnique({ where: { email } });

	if (!user) {
		console.log("User not found.");
		return;
	}

	console.log(`Deleting user: ${user.name} (${user.email})`);
	await db.user.delete({ where: { email } });
	console.log("User deleted.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
