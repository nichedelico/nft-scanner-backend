const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const NFTGO_API_KEY = process.env.NFTGO_API_KEY;
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;

const NFTGO_BASE = "https://data-api.nftgo.io/eth/v1";
const OPENSEA_BASE = "https://api.opensea.io/api/v2";

// ─── NFTGo: top collections by volume ───────────────────────────────────────
app.get("/api/collections/trending", async (req, res) => {
  try {
    const { data } = await axios.get(`${NFTGO_BASE}/market/rank/collection/1h`, {
      headers: { "X-API-KEY": NFTGO_API_KEY, accept: "application/json" },
      params: { limit: 10, offset: 0, asc: false },
    });
    res.json(data);
  } catch (err) {
    console.error("NFTGo trending error:", err.response?.data || err.message);
    res.status(500).json({ error: "NFTGo API error", details: err.response?.data });
  }
});

// ─── NFTGo: collection metrics ───────────────────────────────────────────────
app.get("/api/collections/:contract/metrics", async (req, res) => {
  try {
    const { contract } = req.params;
    const { data } = await axios.get(`${NFTGO_BASE}/collection/${contract}/metrics`, {
      headers: { "X-API-KEY": NFTGO_API_KEY, accept: "application/json" },
    });
    res.json(data);
  } catch (err) {
    console.error("NFTGo metrics error:", err.response?.data || err.message);
    res.status(500).json({ error: "NFTGo API error", details: err.response?.data });
  }
});

// ─── NFTGo: whale transactions ───────────────────────────────────────────────
app.get("/api/collections/:contract/whale-activity", async (req, res) => {
  try {
    const { contract } = req.params;
    const { data } = await axios.get(`${NFTGO_BASE}/collection/${contract}/trades`, {
      headers: { "X-API-KEY": NFTGO_API_KEY, accept: "application/json" },
      params: { limit: 20, is_whale: true },
    });
    res.json(data);
  } catch (err) {
    console.error("NFTGo whale error:", err.response?.data || err.message);
    res.status(500).json({ error: "NFTGo API error", details: err.response?.data });
  }
});

// ─── OpenSea: collection stats ───────────────────────────────────────────────
app.get("/api/opensea/:slug/stats", async (req, res) => {
  try {
    const { slug } = req.params;
    const { data } = await axios.get(`${OPENSEA_BASE}/collections/${slug}/stats`, {
      headers: { "X-API-KEY": OPENSEA_API_KEY, accept: "application/json" },
    });
    res.json(data);
  } catch (err) {
    console.error("OpenSea stats error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenSea API error", details: err.response?.data });
  }
});

// ─── OpenSea: collection info ─────────────────────────────────────────────────
app.get("/api/opensea/:slug/info", async (req, res) => {
  try {
    const { slug } = req.params;
    const { data } = await axios.get(`${OPENSEA_BASE}/collections/${slug}`, {
      headers: { "X-API-KEY": OPENSEA_API_KEY, accept: "application/json" },
    });
    res.json(data);
  } catch (err) {
    console.error("OpenSea info error:", err.response?.data || err.message);
    res.status(500).json({ error: "OpenSea API error", details: err.response?.data });
  }
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`NFT Proxy Server running on port ${PORT}`));
