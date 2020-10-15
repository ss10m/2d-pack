const API_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8080"
        : "https://ship.ssprojects.ca";

export { API_URL };
