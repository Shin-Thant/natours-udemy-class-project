const fun1 = () => {
	return "hello";
};

const fun2 = (condition) => {
	if (condition) {
		return fun1();
	}

	console.log("hello world");
	return fun1();
};

console.log(fun2(false));

function Test() {
	this.name = "shin thant";
	this.age = 20;

	return;
}
const user = new Test();
console.log({ user });
