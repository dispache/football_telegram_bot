const cheerio = require('cheerio');
const axios = require('axios');

async function parserTable(url) {
	let { data } = await axios.get(url);
	let $ = cheerio.load(data);
	const teams = [];
	let result = '';
	let statistics = '';
	$('table.grouptable tbody tr td.team').each((idx,item) => {
		teams.push(`${idx+1}. ${$(item).text()}`);
	});

	let count = 0;

	let gamesIdx = 2;

	$('table.grouptable tbody tr td').each((idx,item) => {
		if ( gamesIdx === idx ) {
			teams[count] += `  (И:${$(item).text()}`;
			gamesIdx += 10;
			count++;
		}
	});

	count = 0;

	$('table.grouptable tbody tr td.win').each((idx,item) => {
		teams[count] += ` В:${$(item).text()}`;
		count++;
	});

	count = 0;

	$('table.grouptable tbody tr td.draw').each((idx,item) => {
		teams[count] += ` Н:${$(item).text()}`;
		count++;
	});

	count = 0;

	$('table.grouptable tbody tr td.lose').each((idx,item) => {
		teams[count] += ` П:${$(item).text()})`;
		count++;
	});

	count = 0;

	$('table.grouptable tbody tr td strong').each((idx, item) => {
		teams[count] += `      Очки : ${$(item).text()}`;
		count++;
	});
	teams.forEach( el => result += el + '\n');
	if ( result === '' ) {
		return 'Технические неполадки :) Попробуй позже.';
	}
	return result
}

async function parserStrikers(url) {
	let { data } = await axios.get(url);
	let $ = cheerio.load(data);
	const strikers = [];
	let result = '';
	
	let countrySet = new Set(['england','spain', 'france', 'italy', 'ukraine', 'germany', 'russia']);

	let teamIdx = 2;
	let nameIdx = 1;
	let goalIdx = 3;
	let arrCount = 0;
	let position = 1;

	let checkCountry = url.split('/')[4];

	$('table.colored td').slice(0,49).each((idx,item) => {
		if ( idx === teamIdx ) {
			let team = $(item).text().trim();
			strikers[arrCount] += `   (${team})`;
			countrySet.has(checkCountry) ? teamIdx += 7 : teamIdx +=5;
		}
		if ( idx === nameIdx ) {
			let name = `${position}. ${$(item).text().trim()}`;
			position++;
			strikers.push(name);
			countrySet.has(checkCountry) ? nameIdx += 7 : nameIdx += 5;
		}
		if ( idx === goalIdx ) {
			let goal = $(item).text().trim();
			strikers[arrCount] += `   Голы : ${goal}`;
			countrySet.has(checkCountry) ? goalIdx += 7 : goalIdx += 5;
			arrCount++;
		}
	});
	strikers.forEach( el => result += el + '\n');
	if ( result === '' ) {
		return 'Технические неполадки :) Попробуй позже.';
	}
	return result;
};

async function parserNews(url) {
	let { data } = await axios.get('https://terrikon.com/');
	let $ = cheerio.load(data);
	let news = [];
	let result = '';

	$('div.news dl dd').slice(0,7).each((idx,item) => {
	 	news.push($(item).text());
	});
	
	let newsIdx = 0;
	$('div.news dl dd').slice(0,7).each((idx,item) => {
		let regexp = /\/posts\/[a-z0-9а-я]+/gi;
		let link = 'https://terrikon.com/' + $(item).html().match(regexp)[0];
		news[newsIdx] += '\n' + link + '\n';
		newsIdx++;
	});

	news.forEach( el => result += el + '\n');
	if ( result === '' ) {
		return 'Технические неполадки :) Попробуй позже.';
	}
	return result;
};

async function parserMatches(url) {
	let { data } = await axios.get(url);
	let $ = cheerio.load(data);
	let matches = [];
	let result = '';
	let lastIdx = 5;
	let count = 0;
	matches[count] = [];
	$('div#champs-actual-games table.gameresult tbody tr td').each((idx,item) => {
		if ( idx <= lastIdx ) {
			matches[count].push(`${$(item).text()}`);
		}
		if ( idx === lastIdx + 1 ) {
			count++;
			lastIdx += 6;
			matches[count] = [];
		}
	});

	matches.forEach( el => {
		el = el.join('   ');
		result += el + '\n'
	});

	if ( result === '' ) {
		return 'Технические неполадки :) Попробуй позже.';
	}

	return result
}
 
module.exports = {
	parserTable,
	parserStrikers,
	parserNews,
	parserMatches
};










