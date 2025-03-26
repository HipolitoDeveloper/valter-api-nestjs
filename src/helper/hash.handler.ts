import * as bcrypt from 'bcrypt';

export const hash = (password: string) => {
  const saltOrRounds = 10;
  return bcrypt.hash(password, saltOrRounds);
};

export const isMatchHash = async (hash: string, storedHash: string) => {
  return bcrypt.compareSync(hash, storedHash);
};
