// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Vote {
        address voter;
        uint256 choice;
    }

    struct Election {
        string name;
        string[] options;
        uint256 endTime;
        mapping(address => bool) hasVoted;
        mapping(uint256 => uint256) votes;
    }

    Election[] public elections;

    function createElection(string memory _name, string[] memory _options, uint256 _duration) public {
        Election storage newElection = elections.push();
        newElection.name = _name;
        newElection.options = _options;
        newElection.endTime = block.timestamp + _duration;
    }

    function getAllElections() public view returns (
    string[] memory names,
    uint256[] memory endTimes,
    string[][] memory options
) {
    uint256 electionsCount = elections.length;
    names = new string[](electionsCount);
    endTimes = new uint256[](electionsCount);
    options = new string[][](electionsCount);

    for (uint256 i = 0; i < electionsCount; i++) {
        names[i] = elections[i].name;
        endTimes[i] = elections[i].endTime;
        options[i] = elections[i].options;
    }
}


    function vote(uint256 _electionId, uint256 _choice) public {
        Election storage election = elections[_electionId];

        require(block.timestamp < election.endTime, "Voting has ended");
        require(!election.hasVoted[msg.sender], "You have already voted");

        election.hasVoted[msg.sender] = true;
        election.votes[_choice]++;
    }

    function getResults(uint256 _electionId) public view returns (uint256[] memory) {
        Election storage election = elections[_electionId];
        uint256[] memory results = new uint256[](election.options.length);

        for (uint256 i = 0; i < election.options.length; i++) {
            results[i] = election.votes[i];
        }
        return results;
    }

    function getOptions(uint256 _electionId) public view returns (string[] memory) {
    Election storage election = elections[_electionId];
    return election.options;
    }

}
