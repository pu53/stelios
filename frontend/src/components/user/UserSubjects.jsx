import React from 'react'
import { getDataSimple} from '../../helpers'

export class UserSubjects extends React.Component {
    constructor(props) {
		super(props);
		this.state = ({
			data: {},
			value: '',
            data2: {}
			});
	}

    componentWillUpdate() {

    }

    fetchData(){
        var link = '';
        var url = 'users/1/';
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          link = 'http://localhost:8000/'+ url;
        } else {
          link = 'http://api.stelios.no/'+ url;
        }
        //generated request
        console.log(link)
        var request = new Request(link, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        fetch(request).then((res) => {
          console.log(res.status)
          return res.json();
        })
        .then((res) => {
          this.setState({data:res})
          handleData = (subjects) => {
              this.setState({
                  data2: subjects
              })
              var newList = []
              res.profile.subjects.map((subject) => {
                  if (subjects.)
              })
          }

          getDataSimple("subjects/?fields=id,name", handleData)
          console.log(res)
        }).catch((e) => {
          console.log(e);
        });

    }

    componentWillMount(){
        this.fetchData();


    }


    /*
    getSubjectNames(n) {
        console.log("getSubjectNames")
        try {
          let response = fetch('localhost:8000/subjects/' + n);
          let responseJson = response.json();
          return responseJson.name;
        } catch(error) {
          console.error(error);
        }

        handleStatus = (res) => {
            console.log("hei");
        }
        getData(handleStatus)
    }
    */


    render() {
        console.log("data: ", this.state.data)
        if(Object.keys(this.state.data).length > 0){
            return (
                <div class="ui vertical menu">
                <ul>
                   {this.state.data.profile.subjects.map(function(subject, index){

                       {/*return <li key={ index }>{subject}</li>;*/}
                       {/*return <a href="#" class="item">{ index }</a>;*/}
                       return <a href="#" class="item">{ getDataSimple("subjects/" + subject, ) }</a>;
                     })}
               </ul>
                </div>

            );
        } else {
            return(
                <div>hei</div>
            )
        }
    }
}
