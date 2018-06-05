const cheerio = require("cheerio");
const { URL } = require("url");
const fetch = require("isomorphic-fetch");
const isocodes = ["bg", "et", "en", "es", "eo", "it", "el", "la", "lv", "lt", "no", "pt", "pl", "fr", "sv", "de", "fi", "da", "cs", "tr", "hu", "ru", "nl", "ja"];
/**
 * Searches for a word on sanakirja.org
 * @param {String} word The word you are searching for
 * @param {Object} options Language options
 * @property {String} options.from Source language
 * @property {String} options.to Destination language
 */
module.exports = async function(word, options = {}){
	if(!word) throw new Error("No search term specified");
	let langFrom = "17";
	let langTo = "3";
	if(options.from && options.to){
		options.from = options.from.toLowerCase();
		options.to = options.to.toLowerCase();
		if(options.from == options.to) throw new Error("Source and destination languages are the same");
		if(isocodes.findIndex((v)=>v == options.from) !== -1){
			langFrom = isocodes.findIndex((v)=>v == options.from)+1;
		}
		else throw new Error("Unknown source language.");
		if(isocodes.findIndex((v)=>v == options.to) !== -1){
			langTo = isocodes.findIndex((v)=>v == options.to)+1;
		}
		else throw new Error("Unknown destination language.");
	} 
	const url = new URL("http://www.sanakirja.org/search.php");
	let params = url.searchParams;
	params.append("q", word);
	params.append("l", langFrom);
	params.append("l2", langTo);
	let res = fetch(url.toString()).then(r => r.text()).catch((err) =>{throw new Error(err);});
	const $ = cheerio.load(await res);
	let data = {
		spellings: [],
		translations: [],
		synonyms: [],
		pronunciation: []
	};
	if($("#translations").length > 0){
		let ctx = false;
		if($(".th_class").children().length === 3) ctx = true;
		$(".group_name").each(function(){
			let wordType = $(this).text();
			$(this).nextUntil(".group_name").each(function(){
				let word = {};
				word.meaning = $($(this).children()[1]).text();
				word.type = wordType;
				if(ctx) word.context = $($(this).children()[2]).text();
				data.translations.push(word);
			});
		});
	}
	else return data;
	if($(".multiple_spellings").length > 0){
		$($(".multiple_spellings")[0]).children().each(function(){
			data.spellings.push($(this).text());
		});
	}
	else data.spellings.push(word);
	if($(".synonyms").length > 0){
		$($(".synonyms")[0]).find("li").each(function(){
			let synonym = {};
			synonym.word = $(this).text();
			synonym.href = new URL(`http://sanakirja.org/${$(this).find("a")[0].attribs.href}`).toString();
			data.synonyms.push(synonym);
		});
	}
	if($("span.pronunciation").length > 0){
		$("span.pronunciation").each(function(){
			data.pronunciation.push($(this).text());
		});
	}
	return data;
};