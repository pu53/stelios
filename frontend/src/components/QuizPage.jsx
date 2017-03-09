import React from 'react'

export class QuizList extends React.Component{
	// will list the quizes available to a specific topic
	constructor(props){
		super();

		this.state = ({
			// noe fornuftig
		});
	}

	dataLoad(url, prejson, dataFunc) {
			var link = '';
			if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
				link = 'http://localhost:8000/'+ url;
		    } else {
	    		link = 'http://api.stelios.no/'+ url;
			}
			var request = new Request(link, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
				},
			});
			fetch(request).then((res) => {
				prejson(res)
	      return res.json();
	    })
	    .then((res) => {
			dataFunc(res);
	    }).catch((e) => {console.log(e)});
	}

	fetchData(domain,elm) {
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+domain+'/'+elm
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+domain+'/'+elm
		    // production code
		}


		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});

		fetch(request).then((res) => {
      return res.json();
    })
    .then((res) => {

			if (res.detail === "Not found.") {
				console.log("rip recursive");
				this.fetchData(domain,"1");
			} else {
				var nam = res["name"];
				console.log(nam);
	      this.setState({
					result: res,
					id: res["id"],
					description: res["description"],
					topics: res["topics"],
					name: nam
				});
			}
    }).then(() => {
			console.log(this.state.topics[0].id)
			if (this.props.params.topicId !== undefined) {
				this.handleClick(this.props.params.topicId);
			} else {
				this.handleClick(this.state.topics[0].id);
			}
		}).catch((e) => {console.log(e)});

	}

}

