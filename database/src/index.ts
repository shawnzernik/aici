import { Manager } from "./tre/Manager";

let manager = new Manager();
manager.execute(process.argv)
    .then(() => {
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error(err);
        process.exit(-1);
    });
