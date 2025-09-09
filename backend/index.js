import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
dotenv.config();






const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


// URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: { type: Number, default: 0 }
});
const Url = mongoose.model('Url', urlSchema);

// Routes

app.post('/api/short', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortUrl = nanoid(8);
    const newUrl = new Url({ originalUrl, shortUrl });
    const myurl = `https://url-shorter-n424.onrender.com/${shortUrl}`;
    const qrCodeimg = await QRCode.toDataURL(myurl);
    await newUrl.save();

    // Return the full saved document
    return res.status(200).json({
      message: "URL Generated",
      shortUrl: myurl,
      qrCodeimg
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const urlEntry = await Url.findOne({ shortUrl });
        if (urlEntry) {
            urlEntry.clicks += 1;
            await urlEntry.save();
            return res.redirect(urlEntry.originalUrl);
        }
        else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});


