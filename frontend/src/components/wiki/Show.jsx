
import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ButtonGroup } from './ButtonGroup'
var Markdown = require('react-remarkable');
/*var SimpleMDE = require('react-simplemde-editor');*/


/* Show is a dumb component that displays name, description, (content), and buttongroup*/
export class Show extends React.Component {

//   toShowOrNotToShowMarkdown = () => {
//     if (this.props.markdownContent !== undefined) {
//       return (
//         <Grid.Column>
//         </Grid.Column>
//       )
//     } else {
//       return null
//     }
//   }

    render() {
      console.log("in show ", this.props.markdownContent);
        return (
     			<Grid>
     				<Grid.Column width={12}>
              {this.props.header === "subjects" ?
     					<h1 style={{"font-family":"'Josefin Slab', serif", "font-size":"36px"}}>{this.props.name}</h1>
              :
              null
              }
              {this.props.header === "topics" ?
                <h1 style={{"font-family":"'Josefin Slab', serif", "font-size":"36px"}}>{"Topic: " + this.props.name}</h1>
                :
                null
              }
              {this.props.header === "subtopics" ?
                <h2 style={{"font-family":"'Josefin Slab', serif", "font-size":"30px"}}>{this.props.name}</h2>
                :
                null
              }

     				</Grid.Column>
     				<Grid.Column width={4}>
              <ButtonGroup {...this.props} {...this.props.buttonGroup} />
     				</Grid.Column>
            <Grid.Column width={16}>
              <p style={{"font-size":"18px"}}>{this.props.description}</p>
            </Grid.Column>
            <Grid.Column width={16}>
              <Markdown source={this.props.markdownContent} />
            </Grid.Column>
     			</Grid>
        );
    }
}
