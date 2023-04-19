export const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100);
};

export const isLarger = (num: number, componsation = 0) => {
  return generateRandomNumber() - componsation > num;
};
