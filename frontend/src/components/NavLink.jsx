import React from 'react'
import { Link } from 'react-router'

export class NavLink extends React.Component {
    render() {
      //return <Link {...this.props} activeClassName="active"/>
      return <Link {...this.props} activeStyle={{color: 'red'}}/>
    }
}
