import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function TransactionProgress({ transactionHash }) {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
      <div>
        Current transaction hash:{" "}
        <a href={"https://goerli.etherscan.io/tx/" + transactionHash}>
          {transactionHash}
        </a>
      </div>
    </Box>
  );
}
