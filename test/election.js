var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	it("initializes with two candidates", function(){
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 2)
		})
	});


	it("initializes the candidates with the correct values", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.candidates(1)
		}).then(function(candidate){
			assert.equal(candidate.id, 1, "contains the correct id")
			assert.equal(candidate.name, "Candidate 1", "contains the correct name")
			assert.equal(candidate.voteCount, 0, "contains the correct voteCount")
			return electionInstance.candidates(2)
		}).then(function(candidate){
			assert.equal(candidate.id, 2, "contains the correct id")
			assert.equal(candidate.name, "Candidate 2", "contains the correct name")
			assert.equal(candidate.voteCount, 0, "contains the correct voteCount")
		})
	});

	it("allows a voter to cast a vote", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(candidateId, {from: accounts[0]});
		}).then(function(receipt){
			return electionInstance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted, "the voter was marked voted");
			return electionInstance.candidates(candidateId)
		}).then(function(candidate){
			var voteCount = candidate.voteCount;
			assert.equal(voteCount, 1, "increments the cndidate's vote count");
		})
	});

	it("throws an exception for an invalid candidate", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			return electionInstance.vote(99, {from: accounts[1]})
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
			return electionInstance.candidates(1)
		}).then(function(candidate1){
			var voteCount = candidate1.voteCount;
			assert.equal(voteCount, 1, "candidate 1 did not recieve any votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2){
			var voteCount = candidate2.voteCount;
			assert.equal(voteCount, 0, "candidate 2 did not recieve any votes");
		})
	});

	it("throws an exception for double voting", function(){
		return Election.deployed().then(function(instance){
			electionInstance = instance;
			candidateId = 2;
			electionInstance.vote(candidateId, {from: accounts[1]});
			return electionInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate.voteCount;
			assert.equal(voteCount, 1, "accepts first vote");

			// Try voting again
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message musr contain revert word");
			return electionInstance.candidates(1);			
		}).then(function(candidate1){
			assert.equal(candidate1.voteCount, 1, "candidate 1 did not recieve any vote");
			return electionInstance.candidates(2);
		}).then(function(candidate2){
			var voteCount = candidate2.voteCount;
			assert.equal(voteCount, 1, "candidate 1 did not recieve any vote");			
		})
	});

});