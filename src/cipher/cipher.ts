import bcrypt from "bcrypt";

const saltRounds = 10;

export const cipher = async (password: string): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        resolve(hash);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const compare = async (password: string, hash: string) => {
  return new Promise(async (resolve) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        resolve(false);
      } else {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
};
