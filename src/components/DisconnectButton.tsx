import Button from "react-bootstrap/Button";
import { useDisconnect } from "wagmi";

export default function DisconnectButton() {

  const { disconnect } = useDisconnect();

  return (
    <div className="row">

      <Button onClick={() => disconnect()}>Disconnect wallet</Button>

    </div>
  )
}