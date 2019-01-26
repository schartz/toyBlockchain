pragma solidity ^0.5.0;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	//store candidates
	mapping(uint => Candidate) public candidates;

	//store the voters
	mapping(address => bool) public voters;

	//store candidate count
	uint public candidatesCount;


	event votedEvent(uint indexed _candidateId);

	// Constructor
	constructor() public {
		// state variable
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}

	function addCandidate(string memory _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote(uint _candidateId) public  {
		//require that voter has not voted before
		require(!voters[msg.sender]);

		// require a valid candidate
		require(_candidateId > 0 && _candidateId <= candidatesCount);

		//record that voter has voted
		voters[msg.sender] = true;

		//update candidate vote
		candidates[_candidateId].voteCount ++;

		// trigger the voted event
		emit votedEvent(_candidateId);
	}

}