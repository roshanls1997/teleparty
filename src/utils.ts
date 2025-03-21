const stringInput = "abcdefghijklmnopqrstuvwxyz01234567890";

export const generateNickname = (length: number = 10) => {
  const inputLength = stringInput.length;
  let nickname = "";
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * 100) % inputLength;
    nickname += stringInput[index];
  }
  return nickname;
};
