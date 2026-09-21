export const getTime = () => {
  let message = "";
  let hours = new Date().getHours();
  if (hours <= 9) {
    message = "早上好";
  } else if (hours <= 12) {
    message = "上午好";
  } else if (hours <= 18) {
    message = "下午好";
  } else if (hours <= 24) {
    message = "晚上好";
  }
  console.log(message);
  return message;
};

