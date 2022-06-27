import { useContractEvent } from "wagmi"
import { useAppSelector, useAppDispatch, useStakeManagerAddress } from "../../../hooks"
import { fetchRelayData } from "../../Relay/relaySlice"

import StakeManagerAbi from "../../../contracts/stakeManager.json"

export default function HubAuthorizedListener() {
  const relay = useAppSelector((state) => state.relay.relay)
  const relayUrl = useAppSelector((state) => state.relay.relayUrl)

  const dispatch = useAppDispatch();

  const { data: stakeManagerAddressData } = useStakeManagerAddress(relay.relayHubAddress)
  const stakeManagerAddress = stakeManagerAddressData as unknown as string

  useContractEvent(
    {
      addressOrName: stakeManagerAddress,
      contractInterface: StakeManagerAbi,
    },
    "HubAuthorized",
    () => {
      dispatch(fetchRelayData(relayUrl));
    },
  )

  return <span>Listening for HubAuthorized</span>
}