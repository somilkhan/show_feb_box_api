import express from 'express';
import cors from 'cors';
import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebBoxApi.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// IMPORTANT: Railway uses this PORT
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Manual CORS (extra safety)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

// APIs
const showboxAPI = new ShowboxAPI();
const febboxAPI = new FebboxAPI();

// Health check
app.get('/', (req, res) => {
    res.send('Showbox & Febbox API is running 🚀');
});

// Autocomplete
app.get('/api/autocomplete', async (req, res) => {
    try {
        const { keyword, pagelimit } = req.query;
        const results = await showboxAPI.getAutocomplete(keyword, pagelimit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search
app.get('/api/search', async (req, res) => {
    try {
        const { type = 'all', title, page = 1, pagelimit = 20 } = req.query;
        const results = await showboxAPI.search(title, type, page, pagelimit);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Movie details
app.get('/api/movie/:id', async (req, res) => {
    try {
        const results = await showboxAPI.getMovieDetails(req.params.id);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show details
app.get('/api/show/:id', async (req, res) => {
    try {
        const results = await showboxAPI.getShowDetails(req.params.id);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// FebBox ID
app.get('/api/febbox/id', async (req, res) => {
    try {
        const { id, type } = req.query;
        const febBoxId = await showboxAPI.getFebBoxId(id, type);
        res.json({ febBoxId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Files
app.get('/api/febbox/files', async (req, res) => {
    try {
        const { shareKey, parent_id = 0 } = req.query;
        const cookie = req.headers['x-auth-cookie'] || null;
        const files = await febboxAPI.getFileList(shareKey, parent_id, cookie);
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Links
app.get('/api/febbox/links', async (req, res) => {
    try {
        const { shareKey, fid } = req.query;
        const cookie = req.headers['x-auth-cookie'] || null;
        const links = await febboxAPI.getLinks(shareKey, fid, cookie);
        res.json(links);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// START SERVER (RAILWAY FIXED)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
