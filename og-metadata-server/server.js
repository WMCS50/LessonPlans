import express from 'express'
import cors from 'cors'
import ogs from 'open-graph-scraper'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(cors())

app.get('/og-metadata', async(req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const { result } = await ogs({ url })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' })
  }
})

const PORT = process.env.VITE_METADATA_SERVER_URL || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})