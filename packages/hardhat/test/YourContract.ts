import { expect } from "chai";
import { ethers } from "hardhat";
import { Voting } from "../typechain-types";

describe("Voting", function () {
  let voting: Voting;

  before(async () => {
    const VotingFactory = await ethers.getContractFactory("Voting");
    voting = (await VotingFactory.deploy()) as Voting;
    await voting.waitForDeployment();
  });

  it("Should allow creating an election", async function () {
    const options = ["Option 1", "Option 2"];
    await voting.createElection("Test Election", options, 3600);
    const election = await voting.elections(0);

    expect(election.name).to.equal("Test Election");
    expect(await voting.getOptions(0)).to.deep.equal(options);
  });

  it("Should allow creating multiple elections", async function () {
    // Создаём отдельные голосования
    const elections = [
      { name: "Favorite Color", options: ["Red", "Blue", "Green"] },
      { name: "Best Programming Language", options: ["JavaScript", "Python", "Rust"] },
      { name: "Preferred Drink", options: ["Coffee", "Tea", "Juice"] },
    ];

    // Проверяем каждое голосование
    for (const [index, election] of elections.entries()) {
      await voting.createElection(election.name, election.options, 3600); // Создаём новое голосование
      const createdElection = await voting.elections(index + 1); // Проверяем ID начиная с 1

      expect(createdElection.name).to.equal(election.name); // Проверяем название
      expect(await voting.getOptions(index + 1)).to.deep.equal(election.options); // Проверяем опции
    }
  });

  it("Should allow voting for an option", async function () {
    await voting.vote(0, 1);
    const results = await voting.getResults(0);

    expect(results[1]).to.equal(1);
  });

  it("Should prevent double voting", async function () {
    await expect(voting.vote(0, 1)).to.be.revertedWith("You have already voted");
  });

  it("Should prevent voting after the election ends", async function () {
    const currentTime = Math.floor(Date.now() / 1000);
    await ethers.provider.send("evm_setNextBlockTimestamp", [currentTime + 3601]);
    await ethers.provider.send("evm_mine", []);

    await expect(voting.vote(0, 0)).to.be.revertedWith("Voting has ended");
  });
});
