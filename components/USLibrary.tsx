import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useUSElectionContract from "../hooks/useUSElectionContract";
import TransactionProgress from "./CircularProgress";

type USContract = {
  contractAddress: string;
};

export enum Leader {
  UNKNOWN,
  BIDEN,
  TRUMP,
}

const USLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const usElectionContract = useUSElectionContract(contractAddress);
  const [currentLeader, setCurrentLeader] = useState<string>("Unknown");
  const [name, setName] = useState<string | undefined>();
  const [votesBiden, setVotesBiden] = useState<number | undefined>();
  const [votesTrump, setVotesTrump] = useState<number | undefined>();
  const [stateSeats, setStateSeats] = useState<number | undefined>();
  const [inProgressState, setInProgressState] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [trumpSeats, setTrumpSeats] = useState<number>();
  const [bidenSeats, setBidenSeats] = useState<number>();

  useEffect(() => {
    getCurrentLeader();
    getCurrentSeats();
  }, []);

  const getCurrentLeader = async () => {
    const currentLeader = await usElectionContract.currentLeader();
    setCurrentLeader(
      currentLeader == Leader.UNKNOWN
        ? "Unknown"
        : currentLeader == Leader.BIDEN
        ? "Biden"
        : "Trump"
    );
  };

  const getCurrentSeats = async () => {
    const currentBidenSeats = await usElectionContract.seats(1);
    const currentTrumpSeats = await usElectionContract.seats(2);
    setBidenSeats(currentBidenSeats);
    setTrumpSeats(currentTrumpSeats);
  };

  const stateInput = (input) => {
    setName(input.target.value);
  };

  const bideVotesInput = (input) => {
    setVotesBiden(input.target.value);
  };

  const trumpVotesInput = (input) => {
    setVotesTrump(input.target.value);
  };

  const seatsInput = (input) => {
    setStateSeats(input.target.value);
  };

  const submitStateResults = async () => {
    setInProgressState(true);
    const result: any = [name, votesBiden, votesTrump, stateSeats];
    const tx = await usElectionContract.submitStateResult(result);
    setTransactionHash(tx.hash);
    await tx.wait();
    setInProgressState(false);
    setTransactionHash("");
    resetForm();
  };

  const resetForm = async () => {
    setName("");
    setVotesBiden(0);
    setVotesTrump(0);
    setStateSeats(0);
  };

  usElectionContract.on("LogStateResult", (winner, stateSeats, state, tx) => {
    winner === 1
      ? setBidenSeats(bidenSeats + stateSeats)
      : setTrumpSeats(trumpSeats + stateSeats);
    trumpSeats > bidenSeats
      ? setCurrentLeader("Trump")
      : setCurrentLeader("Biden");
    alert(
      `${
        winner === 1 ? `Biden` : `Trump`
      } won the ${state} with ${stateSeats} seats`
    );
  });

  return (
    <div className="results-form">
      <p>Current Leader is: {currentLeader}</p>
      <p>Biden seats count: {bidenSeats}</p>
      <p>Trump seats count: {trumpSeats}</p>
      <form>
        <label>
          State:
          <input onChange={stateInput} value={name} type="text" name="state" />
        </label>
        <label>
          BIDEN Votes:
          <input
            onChange={bideVotesInput}
            value={votesBiden}
            disabled={inProgressState}
            type="number"
            name="biden_votes"
          />
        </label>
        <label>
          TRUMP Votes:
          <input
            onChange={trumpVotesInput}
            value={votesTrump}
            disabled={inProgressState}
            type="number"
            name="trump_votes"
          />
        </label>
        <label>
          Seats:
          <input
            onChange={seatsInput}
            value={stateSeats}
            disabled={inProgressState}
            type="number"
            name="seats"
          />
        </label>
        {/* <input type="submit" value="Submit" /> */}
      </form>
      <div className="button-wrapper">
        <button onClick={submitStateResults} disabled={inProgressState}>
          Submit Results
        </button>
      </div>
      <div className="submit-progress">
        {inProgressState ? (
          <TransactionProgress transactionHash={transactionHash} />
        ) : (
          resetForm
        )}
      </div>
      <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }

        .submit-progress {
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default USLibrary;
