
import React from 'react'
import { Grid } from 'semantic-ui-react'
import { ButtonGroup } from './ButtonGroup'
var Markdown = require('react-remarkable');
var SimpleMDE = require('react-simplemde-editor');


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
     					<h2>{this.props.name}</h2>
     				</Grid.Column>
     				<Grid.Column width={4}>
              <ButtonGroup {...this.props.buttonGroup} />
     				</Grid.Column>
            <Grid.Column width={16}>
              <p><b>{this.props.description}</b></p>
            </Grid.Column>
            <Grid.Column width={16}>
              <Markdown source={this.props.markdownContent} />
            </Grid.Column>
     			</Grid>
        );
    }
}
