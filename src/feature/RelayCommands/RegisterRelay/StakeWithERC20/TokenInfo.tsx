import { useContext } from "react";
import { useBalance } from "wagmi";
import { TokenContext } from "./StakeWithERC20";

export default function TokenInfo() {
    const { token, account } = useContext(TokenContext);
    const { data: bal } = useBalance({ addressOrName: account, token: token, staleTime: 5000, watch: true });

    return (
        <div>Available: {bal?.formatted} {bal?.symbol}</div>
    );
}
