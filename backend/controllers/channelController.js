import Channel from '../models/Channel.js'

/**
 * GET /api/channels/:id
 * Returns one channel with its videos populated.
 */
export async function getChannelById(req, res) {
  try {
    const channel = await Channel.findById(req.params.id).populate(
      'videos',
      'title thumbnailUrl views createdAt'
    )

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' })
    }

    res.json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/channels/mine
 * Returns the channel owned by the logged-in user, if any.
 * Used by the frontend Header to decide: "Create Channel" vs "Your Channel".
 * Protected route - must come BEFORE /:id in routes file (see note there).
 */
export async function getMyChannel(req, res) {
  try {
    const channel = await Channel.findOne({ owner: req.user._id })
    res.json(channel) // null if user has no channel yet - frontend handles that
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/channels
 * Creates a channel for the logged-in user. Per assignment spec, only
 * reachable when signed in (protect middleware enforces that). This
 * project assumes one channel per user, so block creating a second one.
 */
export async function createChannel(req, res) {
  try {
    const { channelName, description, channelBanner } = req.body

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' })
    }

    const existing = await Channel.findOne({ owner: req.user._id })
    if (existing) {
      return res.status(400).json({ message: 'You already have a channel' })
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user._id,
    })

    res.status(201).json(channel)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}