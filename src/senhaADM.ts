import { cipher } from "./cipher/cipher";

async function senhaADM(senha:string) {
  console.log(await cipher(senha));
}

senhaADM("leirad123");
