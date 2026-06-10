window.onload = () => {
  import("./style.css");

  const sombra = {
    name: "Sombra",
    nickname: "Little Sombrita",
    yellForFood: () => {
      console.log(
        "I'M HUNGRY, I HAVE NEVER SEEN FOOD IN MY LIFE.  WHAT DO YOU MEAN IT IS 4AM?",
      );
    },
  };

  // function doSomething(foo: string, bar: string) {
  //   console.log("This function has been called!");
  //   console.log("foo:", foo);
  //   console.log("bar:", bar);
  // }

  // doSomething("Sombra", "Grizelle");

  // const helloWorld = (name: string) => {
  //   console.log(`Hello, ${name}`);
  // };

  // const inlineHello = (name: string) => console.log(`Hello, ${name}`);

  // helloWorld("Sombra");
  // inlineHello("Grizelle");

  const fib = (n: number = 0): number => {
    let a = 1;
    let b = 0;
    let swap = 0;

    for (let iter = 0; iter < n; iter++) {
      swap = a + b;
      b = a;
      a = swap;
    }

    return a;
  };

  for (let i = 0; i < 10; i++) {
    console.log(`fib(${i}):`, fib(i));
  }
};
