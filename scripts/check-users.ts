import "dotenv/config";
import { db } from "../src/server/db";

async function main() {
	const users = await db.user.findMany({
		include: { accounts: true, posts: true },
	});
	console.log("Users found:", users.length);
	users.forEach((u) => {
		console.log(`- ID: ${u.id}`);
		console.log(`  Name: ${u.name}`);
		console.log(`  Email: ${u.email}`);
		console.log(`  Email Verified: ${u.emailVerified}`);
		console.log(
			`  Password Hash: ${u.password ? u.password.substring(0, 10) + "..." : "NULL"}`,
		);
		console.log(`  Posts: ${u.posts.length}`);
		console.log(`  Accounts: ${u.accounts.length}`);
		u.accounts.forEach((a) => {
			console.log(`    - Provider: ${a.provider}`);
			console.log(`    - Provider Account ID: ${a.providerAccountId}`);
		});
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await db.$disconnect();
	});
