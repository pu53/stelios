/* getData is a "generic" function for getting data from the server
  input params:
    url: an url on the form "topics/1/", url must always have an ending slash
        if you add "?fields!=somefield" do not add ending slash
    handleStatus: a function that will be called with the response message.
                  example handleStatus function/variable to send to this function:
                    var handleStatus = (res) => {
                      if (res.status === 404) {
                        this.setState({
                          message: "pekka not found",
                          negative: "yes"
                        })
                      }
                    }
    handleData: function that will be called after response is turned into json
                example function: as above but setState updates
                some field with res.somefield
    handleError: function that will be called if an error occurs in the javascript,
                for example: will not be called if response from server is 404
                but will be called if a connection cannot be established to server
                function defaults to an empty function
*/
export function getData(url, handleStatus, handleData, handleError) {
	//console.log("fetching data");
	//builds the link with respect to production/development
	var link = '';
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		link = 'http://localhost:8000/api/'+ url;
	} else {
		link = 'https://stelios.no/api/'+ url;
	}
	//generated request

	let token = localStorage.getItem("stelios_token");

	let request = ""

	console.log("Current user: " + token)
	console.log("Current user: " + typeof token)
	
	if(token !== null) {
		console.log("Authorized request")
		request = new Request(link, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Authorization': 'Token ' + token
		},
		});
	}
	else {
		console.log("Unauthorized request")
		request = new Request(link, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		},
		});
	}

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

/* sendData is a "generic" function to send data to the server
  a valid token (except if url is "signup/") is required because of authentication with the server
  input params:
    url: an url on the form "topics/1/", url must always have an ending slash
        if you add "?fields!=somefield" do not add ending slash
    method_: a http method to mark the request with.
      - "POST" for all request creating an object
      - "PUT" for all request updating an object
      - "DELETE" for all request deleting an object
    body: The data you should send with the request. It has to be a valid javascript dictionary and decodable into json
    handleStatus: a function that will be called after a response has been recived by the server, in other words after the server has
                  decided if the action you requested was succesfull
                  Example handleStatus function:
                    var handleStatus = (res) => {
                      if (res.status === 403) {
                        this.setState({
                          message: "pekka was not authorized",
                          negative: "no" //emneknag kapparino cappachino
                        })
                      }
                    }
    handleData: function that will be called after response is turned into json
                example function: as above but setState updates
                some field with res.somefield
                Normaly the res variable will contain the information you created/updated. For example when creating res will look exactly like the body function you sent in, but it also has an id field.
    handleError: function that will be called if an error occurs in the javascript,
                for example: will not be called if response from server is 404
                but will be called if a connection cannot be established to server
                function defaults to an empty function
*/
export function sendData(url, method_, body, handleStatus, handleData, handleError) {
  //checks if token is avalible, if not the function selfDestructs
  var token = localStorage.getItem('stelios_token');
  if (token === "null" && url !== "signup/") {
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

  //builds link based on enviroment, production/development
  var link = '';
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    link = 'http://localhost:8000/api/'+ url;
      // dev code
  } else {
      link = 'https://stelios.no/api/' + url;
      // production code
  }
  //if the url is signup, then the request is not built with Authorization token.
  if(url !== "signup/") {
    var request = new Request(link, {
      method: method_,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token
      },
      body: JSON.stringify(body)
    });
  } else {
    var request = new Request(link, {
      method: method_,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  }
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
//simple getData function, because of simplicity. Read documentation above for more info.
export function getDataSimple(url, handleData) {
    console.log("fetching data");
    //builds the link with respect to production/development
    var link = '';
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      link = 'http://localhost:8000/api/'+ url;
    } else {
      link = 'https://stelios.no/api/'+ url;
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
      return res.json();
    })
    .then((res) => {
        handleData(res)
    }).catch((e) => {
      console.log(e);
    });
}
