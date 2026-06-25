import { useParams } from "react-router-dom";

/**
 * Channel Page
 * -------------
 * Route: "/channel/:channelId"
 * Full create/edit/delete videos UI built in a later step.
 */
function ChannelPage() {
  const { channelId } = useParams()

  return <p>Channel page for: {channelId}</p>
}

export default ChannelPage