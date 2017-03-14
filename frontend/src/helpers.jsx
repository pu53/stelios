/* getData is a "generic" function for getting data from the server
  input params:
    url: an url on the form "topics/1/", url must always have an ending slash
        if you add "?fields!=somefield" do not add ending slash
    handleStatus: a function that will be called with the response message.
                  example handleStatus function:
                    ((res) => {
                      if (res.status === 404) {
                        this.setState({
                          message: "pekka not found",
                          negative: "yes"
                        })
                      }
                    })
    handleData: function that will be called after response is turned into json
                example function: as above but setState updates
                some field with res.somefield
    handleError: function that will be called if an error occurs in the javascript,
                for example: will not be called if response from server is 404
                but will be called if a connection cannot be established to server
                function defaults to an empty function
*/
export function getData(url, handleStatus, handleData, handleError) {
  console.log("fetching data");
  //builds the link with respect to production/development
  var link = '';
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    link = 'http://localhost:8000/'+ url;
  } else {
    link = 'http://api.stelios.no/'+ url;
  }
  //generated request
  var request = new Request(link, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  //javascripts fetch method. after fetch is executed and respone is recived,
  //the first .then() is called, and after that the next .then()
  fetch(request).then((res) => {
    console.log(res.status)
    handleStatus(res)
    return res.json();
  })
  .then((res) => {
    handleData(res);
  }).catch((e) => {
    console.log(e);
    handleError(e);
  });
}

export function sendData(url, method_, body, handleStatus, handleData, handleError) {
  console.log(url, method_, body);
  var token = localStorage.getItem('stelios_token');
  if (token === "null") {
    this.setState({
      message: "You need to login first",
      neg: true,
      loading: false
    });
    setTimeout(() => {
      this.setState({ message: "" });
    }, 10000);
    return
  }

  var link = '';
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    link = 'http://localhost:8000/'+ url;
      // dev code
  } else {
      link = 'http://api.stelios.no/' + url;
      // production code
  }

  var request = new Request(link, {
    method: method_,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify(body)
  });
  fetch(request).then((res) => {
    console.log("statusFunc: ", res);
    handleStatus(res);
    if (res.status >= 200 && res.status <= 203) {
      return res.json();
    } else if (res.status === 204) {
      return true
    }
    return false
  })
  .then((res) => {
    console.log("status: ", res);
    if (res !== false) {
      handleData(res)
    }
  }).catch((e) => {
    console.log(e);
    handleError(e.toString());
  });
}




import React from 'react'
export function editWrapper(Edit) {
  return class EditWrapper extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: '',
        description: '',
        markdown_content: '',
      }
    }

    onNameChange = (e) => {
      this.setState({
        name: e.target.value
      })
    }

    onDescriptionChange = (e) => {
      this.setState({
        description: e.target.value
      })
    }


    render() {
      const newProps = {
        header: "Edit " + Edit.displayName,
        name: {
          value: this.state.name,
          onChange: this.onNameChange
        },
        description: {
          value: this.state.description,
          onChange: this.onDescriptionChange
        }
      }

      return <Edit {...this.props} {...newProps}/>
    }
  }
}
