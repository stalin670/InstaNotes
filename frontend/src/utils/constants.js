const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "";

export default BASE_URL;
