
import { pool } from "../database.js";
class HealthService {
  getStatus() {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }


  async getDBStatus() {
    try {
      await pool.query("SELECT 1");
      return {
        status: "OK",
        db: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      return {
        status: "DOWN",
        db: "error",
        error: err.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
  
}

export default new HealthService();