import express from 'express';
import cors from 'cors';
import ShowboxAPI from './ShowboxAPI.js';
import FebboxAPI from './FebBoxApi.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// ✅ IMPORTANT: Railway uses PORT env
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// APIs init
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search
app.get('/api/search', async (req, res) => {
    try {
        const { type = 'all', title, page = 1, pagelimit = 20 } = req.query;
        const results = await showboxAPI.search(title, type, page, pagelimit);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Movie
app.get('/api/movie/:id', async (req, res) => {
    try {
        const data = await showboxAPI.getMovieDetails(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Show
app.get('/api/show/:id', async (req, res) => {
    try {
        const data = await showboxAPI.getShowDetails(req.params.id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Febbox ID
app.get('/api/febbox/id', async (req, res) => {
    try {
        const { id, type } = req.query;
        const result = await showboxAPI.getFebBoxId(id, type);
        res.json({ febBoxId: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Febbox files
app.get('/api/febbox/files', async (req, res) => {
    try {
        const { shareKey, parent_id = 0 } = req.query;
        const cookie = req.headers['x-auth-cookie'] || null;
        const files = await febboxAPI.getFileList(shareKey, parent_id, cookie);
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Febbox links
app.get('/api/febbox/links', async (req, res) => {
    try {
        const { shareKey, fid } = req.query;
        const cookie = req.headers['x-auth-cookie'] || null;
        const links = await febboxAPI.getLinks(shareKey, fid, cookie);
        res.json(links);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server (IMPORTANT FIX)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
