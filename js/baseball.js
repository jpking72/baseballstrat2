function Baseball() {

	this.inning = 1;
	this.side = 0;
	this.outs = 0;
	this.score = [0,0];
	this.inningScore = [new Array(9), new Array(9)];
	this.batter = [0,0];
	this.lineup = [new Array(9), new Array(9)];
	this.team =  [new Array(25), new Array(25)];
	this.bases = [0,0,0,0];
	infield = 0;

}

Baseball.prototype.Play = function (result) {

	switch (result) {

		case 'strikeout':
			this.nextBatter(false);
			break;
		case 'go-a':
			this.moveRunners('a');
			this.nextBatter(false);
			break;
		case 'go-b':
			this.moveRunners('b');
			this.nextBatter(false);
			break;
		case 'go-c':
			this.moveRunners('c');
			this.nextBatter(false);
			break;
		case 'fo-a':
			this.nextBatter(false);
			break;
		case 'fo-b':
			this.moveRunners('d');
			this.nextBatter(false);
			break;
		case 'fo-c':
			this.moveRunners('e');
			this.nextBatter(false);
			break;
		case 'single-a':
			this.moveRunners('f');
			this.nextBatter(true);
			break;
		case 'single-b':
			this.moveRunners('g');
			this.nextBatter(true);
			break;
		case 'single-c':
			this.moveRunners('h');
			this.nextBatter(true);
			break;
		case 'double-a':
			this.moveRunners('i');
			this.nextBatter(true);
			break;
		case 'double-b':
			this.moveRunners('j');
			this.nextBatter(true);
			break;
		case 'triple':
			this.moveRunners('k');
			this.nextBatter(true);
			break;
		case 'hr':
			this.moveRunners('hr');
			this.nextBatter(true);
			break;

	}

}

Baseball.prototype.moveRunners = function (type) {

	 switch (type) {

	 	//grounder, only play at first
	 	case 'a':
	 		bases = new Array(0, 0, bases[1], bases[2]);
	 		if (bases[3]) {
	 			this.RunnerOnThirdScores();
	 		}
	 		break;

	 	//grounder, possible double play
	 	case 'b': {
	 		if (bases[1] && bases[2] && bases[3]) {
	 			doubleplay = Turn2('loaded');
	 		} else if (bases[3] && bases[1] && !bases[2]) {
	 			throwhome = ThrowHome();
	 			if (!throwhome) {
	 				doubleplay = Turn2('regular');
	 			}
	 		} else if (bases[2] && bases[1]) {
	 			doubleplay = Turn2('third');
	 		} else if (bases[1]) {
	 			doubleplay = Turn2('regular');
	 		} else if (bases[2] && bases[3] && !bases[1]) {
	 			throwhome = ThrowHome();
	 			runhome = RunHome();
	 			if (throwhome && runhome) {
	 				plateplay = PlayAtPlate('gb', 0);
	 				bases = new Array(0, this.lineup[this.side][this.batter[this.side]], bases[1], bases[2]);
	 				if (plateplay) {
	 					this.RunnerOnThirdScores();
	 				}
	 			} else if (throwhome && !runhome) {
	 				bases = new Array(0, this.lineup[this.side][this.batter[this.side]], bases[2], bases[3]);
	 			} else if (runhome && !throwhome) {
	 				bases = new Array(0, 0, 0, bases[2]);
	 				this.RunnerOnThirdScores();
	 			} else {
	 				bases = new Array(0, 0, bases[2], bases[3]);
	 			}
	 		}
	 		else if (bases[2]) {
	 			throwthird = ThrowThird();
	 			runthird = RunThird();
	 			if (throwthird && runthird) {
	 				thirdplay = PlayAtThird('gb', 0);
	 				if (thirdplay) {
	 					bases = new Array(0, this.lineup[this.side][this.batter[this.side]], 0, bases[2]);
	 				}
	 			} else if (throwthird && !runthird) {
	 				bases = new Array(0, this.lineup[this.side][this.batter[this.side]], bases[2], 0);
	 			} else if (!throwthird && runthird) {
	 				bases = new Array(0, 0, 0, bases[2]);
	 			} else {
	 				bases = new Array(0, 0, bases[2], 0);
	 			}


	 		} else if (bases[3]) {
	 			throwhome = ThrowHome();
	 			runhome = RunHome();
	 			if (throwhome && runhome) {
	 				plateplay = PlayAtPlate('gb', 0);
	 				bases = new Array(0, this.lineup[this.side][this.batter[this.side]], bases[1], bases[2]);
	 				if (plateplay) {
	 					this.RunnerOnThirdScores();
	 				}
	 			} else if (throwhome && !runhome) {
	 				bases = new Array(0, this.lineup[this.side][this.batter[this.side]], bases[2], bases[3]);
	 			} else if (runhome && !throwhome) {
	 				bases = new Array(0, 0, 0, bases[2]);
	 				this.RunnerOnThirdScores();
	 			} else {
	 				bases = new Array(0, 0, bases[2], bases[3]);
	 			}
	 		}

	 		} break;

	 		case 'c': {

	 			if (bases[1] && bases[2] && bases[3]) {

	 				this.outs++;
	 				bases = new Array(0, 0, bases[1], bases[2]);

	 			} else if (bases[1] && !bases[2] && bases[3]) {
	 				this.outs++;
	 				bases = new Array(0, 0, 0, bases[3]);
	 			} else if (!bases[1] && bases[2] && bases[3]) {
	 				bases = new Array(0, 0, bases[2], bases[3]) 
	 			} else if (bases[1] && bases[2] && !bases[3]) {
	 				this.outs++;
	 				bases = new Array(0, 0, bases[1], 0); 
	 			} else if (bases[1] && !bases[2] && !bases[3]) {
	 				this.outs++;
	 				bases = new Array(0,0,0,0);
	 			}

	 		} break;


	 }
}

Baseball.prototype.Turn2 = function (type) {

}

Baseball.prototype.PlayAtThird = function (type) {


}

Baseball.prototype.PlayAtPlate = function (type) {


}

Baseball.prototype.RunnerOnThirdScores = function () {

	this.lineup[this.side][bases[3]].runs++;
	this.lineup[this.side][this.batter[this.side]].rbis++;
	this.score[this.side]++;
	this.inningScore[this.side][this.inning]++;

}