import healthService from "../Services/health.services.js";

class HealthController {
  getHealth(req, res) {
    const health = healthService.getStatus();
    res.status(200).json(health);
  }
  async getDBhealth(req, res) {
    try {
      const health = await healthService.getDBStatus();
      res.status(200).json(health);
    } catch (err) {
      res.status(500).json({ status: "ERROR", error: err.message });
    }
  }
}



export default new HealthController();