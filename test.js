const arr = [1, 2, 3];

async function fun() {
	await Promise.all(
		arr.map(async (item) => {
			await new Promise((resolve) => resolve()).then(() =>
				console.log({ item })
			);
		})
	);
}

console.log("start");
fun();
console.log("end");
