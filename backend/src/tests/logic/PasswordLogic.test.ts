import { PasswordLogic } from "../../logic/PasswordLogic";

test("Password Creator", () => {
	const pl = new PasswordLogic();
    const pe = pl.computeHash("Welcome1234");
    
    console.log("Hash: " + pe.hash);
    console.log("Salt: " + pe.salt);
    console.log("Iterations: " + pe.iterations);

    expect(pe).toBeTruthy();
});