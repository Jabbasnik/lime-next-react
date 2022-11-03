import * as React from "react";
import CircularIndeterminate from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularProgress({ transactionHash }) {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CircularIndeterminate />
        <div>
          Current transaction hash:{" "}
          <a href={"https://goerli.etherscan.io/tx/" + transactionHash}>
            {transactionHash}
          </a>
        </div>
      </Box>
    </>
  );
}
