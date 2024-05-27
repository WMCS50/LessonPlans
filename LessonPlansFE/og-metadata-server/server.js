import express from 'express'
import cors from 'cors'
import ogs from 'open-graph-scraper'

const app = express()
const port = 3002

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
    res.status(500).json({ error: 'Failed to fetch metadata'})
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

