import React from 'react';
import {shallow, mount} from 'enzyme';
import { Quiz, TestTest } from '../Quiz.jsx';

	var quizData = []
	const question1 = {
		text:"How and why the great badger of doom ended "+
			"the mayas has long been a hotly debated topic "+
			"in south american ancient history. What, however, "+
			"is today the most recognised theory?",
		alternatives:[
			{id:1, text:"It ate them"},
			{id:2, text:"It scared them to death"},
			{id:3, text:"The adverse effect the badger had on local fauna"}
			],
		subtopic:'badgers',
		correctID:1
		};
		
	const question2 = {
		text:"What is considered the most influential paper on tea and crackers?",
		alternatives:[
			{id:1, text:"Objectivity in a subjective science, on the importance of peer review when doing taste tests"},
			{id:2, text:"Air humidity and cracker elasticity"},
			{id:3, text:"An unhealthy orthodoxy-on how black tea has been displaced by fruit tea"}
			],
		subtopic:'foodstuffs',
		correctID:1
		};
		
	const question3 = {
		text:"Which data structure benefits greatly when implementations do so-called \"Robin Hooding\"?",
		alternatives:[
			{id:1, text:"Priority Stack"},
			{id:2, text:"Hash Map"},
			{id:3, text:"Priority Queue"},
			{id:5, text:"Red-Black Tree"}
			],
		subtopic:'Algorithms',
		correctID:2
		};
		var all_questions = [question1, question2, question3];
		var data = {
			questions:all_questions,
			title:"This is a quiz from data passed through props"
		};
	quizData={
		title:"This is a quiz used for unit test",
		questions:[question1, question2, question3]
	}

describe('<Quiz />', () => {
	it('Should render the title correctly', () => {
		const wrapper = mount(<Quiz data={quizData} />);
		expect(wrapper.find('.mainTitle').text()).toEqual(quizData.title);
	});
	
	it('Should render metainfo', () => {
		const wrapper = mount(<Quiz data={quizData} />);
		
		for(i = 0; i < quizData.lenght; i++) {
			expect(wrapper.find('.topInfo').text);
			expect(wrapper.find('.'))
			wrapper.find('.')
		}
	})
});

