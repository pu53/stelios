import React from 'react'
import { Topic } from './Topic'

export class WikiNav extends React.Component {

    constructor(props) {
      super();
    }

    render() {
        return (
          <div>
            {/* wikinav here */}
            <Topic topic={this.props.topics[0]} />
          </div>
        );
    }
}
