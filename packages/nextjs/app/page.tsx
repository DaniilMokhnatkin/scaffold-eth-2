"use client";

import { useEffect, useState } from "react";
import deployedContracts from "../contracts/deployedContracts";
import { ethers } from "ethers";

export default function Home() {
  const [elections, setElections] = useState<any[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null);
  const [choice, setChoice] = useState<number>(0);
  const [results, setResults] = useState<number[]>([]);
  const [electionName, setElectionName] = useState("");
  const [options, setOptions] = useState("");

  const contractAddress = deployedContracts[31337].Voting.address;
  const contractABI = deployedContracts[31337].Voting.abi;

  const getContract = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  };

  // Загрузить все голосования
  const fetchElections = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const [names, endTimes, options] = await contract.getAllElections();
      setElections(
        names.map((name: string, index: number) => ({
          id: index,
          name,
          endTime: new Date(endTimes[index].toNumber() * 1000).toLocaleString(),
          options: options[index],
        })),
      );
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  // Создание голосования
  const handleCreateElection = async () => {
    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.createElection(electionName, options.split(","), 3600);
      await tx.wait();
      alert("Election created successfully!");
      fetchElections(); // Обновить список голосований
    } catch (error) {
      console.error("Error creating election:", error);
    }
  };

  // Голосование
  const handleVote = async () => {
    if (selectedElectionId === null) {
      alert("Please select an election to vote on!");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const tx = await contract.vote(selectedElectionId, choice);
      await tx.wait();
      alert("Vote submitted successfully!");
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Получение результатов
  const handleFetchResults = async () => {
    if (selectedElectionId === null) {
      alert("Please select an election to fetch results!");
      return;
    }

    const contract = await getContract();
    if (!contract) return;

    try {
      const data = await contract.getResults(selectedElectionId);
      setResults(data.map((res: ethers.BigNumber) => res.toNumber()));
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-500 text-gray-800 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Decentralized Voting</h1>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Форма создания голосования */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Create Election</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Election Name"
              value={electionName}
              onChange={e => setElectionName(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Options (comma-separated)"
              value={options}
              onChange={e => setOptions(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleCreateElection}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Create Election
            </button>
          </div>
        </div>

        {/* Секция голосования */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Vote</h2>
          <div className="space-y-4">
            <select onChange={e => setSelectedElectionId(Number(e.target.value))} className="w-full p-2 border rounded">
              <option value="" disabled selected>
                Select an election
              </option>
              {elections.map(election => (
                <option key={election.id} value={election.id}>
                  {election.name}
                </option>
              ))}
            </select>
            {selectedElectionId !== null && (
              <div>
                <p className="text-lg font-semibold">Options:</p>
                <ul className="list-disc list-inside">
                  {elections[selectedElectionId]?.options.map((option: string, index: number) => (
                    <li key={index}>
                      {index}: {option}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600">End Time: {elections[selectedElectionId]?.endTime}</p>
              </div>
            )}
            <input
              type="number"
              placeholder="Option ID"
              value={choice}
              onChange={e => setChoice(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <button onClick={handleVote} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
              Vote
            </button>
          </div>
        </div>

        {/* Секция результатов */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Results</h2>
          <div className="space-y-4">
            {selectedElectionId !== null && (
              <div>
                <p className="text-lg font-semibold">Results for {elections[selectedElectionId]?.name}:</p>
                <ul className="list-disc list-inside">
                  {results.map((result, index) => (
                    <li key={index}>
                      Option {index}: {result} votes
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleFetchResults}
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              Fetch Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
