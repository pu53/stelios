import React from 'react'

export class WikiNav extends React.Component {

    constructor(props) {
      super();
      this.state = {
        result: []
      };
      this.fetchData = this.fetchData.bind(this);
    }

    fetchData(event) {
      event.preventDefault();
      var link = '';
      if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        link = 'http://localhost:8000/subject.json'
      // dev code
      } else {
        link = 'http://api.stelios.no/subject.json'
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
        this.setState({ result: res });
      }).catch((e) => {console.log(e)});
      console.log(this.state.result)
    }

    render() {
        return (
          <div>

          </div>
        );
    }
}
