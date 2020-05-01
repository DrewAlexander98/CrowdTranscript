const mongoose = require('mongoose')
const Episode = mongoose.model('Episode')

const getAllEpisodes = async (req, res) => {
  const episodes = await Episode.find()
  return res.status(200).json({ episodes })
}

const createEpisode = async (req, res) => {
  const { number, name, src } = req.body
  const episode = new Episode()
  episode.number = number
  episode.name = name
  episode.src = src
  episode.completed = false

  try {
    const result = await episode.save()
    return res.status(200).json({ result })
  } catch (err) {
    res.status(400).json({ message: 'Error adding episode', error: err })
  }
}

const deleteEpisode = async (req, res) => {
  const { number } = req.body
  const episode = await Episode.findOne({ number })
  if (!episode) return res.status(404).json({ message: 'Episode not found' })
  const result = await episode.deleteOne()
  return result
    ? res.status(200).json({ message: 'Successfully deleted episode' })
    : res.status(400).json({ message: 'Failed to delete episode' })
}

module.exports = { getAllEpisodes, createEpisode, deleteEpisode }