const HOST =
  process.env.NODE_ENV === "production"
    ? "https://feuding-friends.herokuapp.com/"
    : "http://localhost:5000";
export default HOST;
