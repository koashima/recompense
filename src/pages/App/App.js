import React, { Component } from 'react';
import './App.css';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import SignupPage from '../SignupPage/SignupPage';
import LoginPage from '../LoginPage/LoginPage';
import NavBar from '../../components/NavBar/NavBar';
import Home from "../../pages/Home/Home.js";
import ServiceFloor from '../ServiceFloor/ServiceFloor';
import ServiceDetailPage from '../ServiceDetailPage/ServiceDetailPage'
import EditServicePage from '../EditServicePage/EditServicePage'
import userService from '../../utils/userService';
import DirectAidLinks from '../DirectAidLinks/DirectAidLinks';
import * as servicesAPI from '../../services/services-api'
import AddServicePage from '../AddServicePage/AddServicePage'
import AddLink from '../../components/AddLink/AddLink';


class App extends Component {
  state = {
    user: userService.getUser(),
    services: [],
    choices: [],
  }

  handleLogout = () => {
    userService.logout()
    this.setState({ user: null })
  }

  handleSignupOrLogin = () => {
    this.setState({ user: userService.getUser() })
  }

  handleAddService = async newServiceData => {
    const newService = await servicesAPI.create(newServiceData)
    this.setState(state => ({
      services: [...state.services, newService]
    }),
      () => this.props.history.push('/servicesfloor'))
  }

  handleUpdateService = async updatedServiceData => {
    const updatedService = await servicesAPI.update(updatedServiceData)
    const newServicesArray = this.state.services.map(e =>
      e._id === updatedService._id ? updatedService : e
    )
    this.setState(
      { services: newServicesArray },
      () => this.props.history.push('/servicesfloor')
    )
  }

  handleDeleteService = async id => {
    await servicesAPI.deleteOne(id)
    this.setState(state => ({
      services: state.services.filter(service => service._id !== id)
    }), () => this.props.history.push('/servicesfloor'))
  }

  async componentDidMount() {
    const services = await servicesAPI.getAll()
    this.setState({ services })
  }

  render() {
    return (
      <div className="App">
        <header>
          <Link to='' className='title'>:: recompense ::</Link>
          <NavBar
            user={this.state.user}
            handleLogout={this.handleLogout}
          />
        </header>
        <div className="body">
          <Switch>
            <Route
              exact path="/"
              render={(props) => (
                <Home
                  {...props}
                />
              )}
            />
            <Route exact path='/signup' render={({ history }) =>
              <SignupPage
                history={history}
                handleSignupOrLogin={this.handleSignupOrLogin}
              />
            } />
            <Route exact path='/login' render={(({ history }) =>
              <LoginPage
                history={history}
                handleSignupOrLogin={this.handleSignupOrLogin}
              />
            )} />
            <Route
              exact path="/servicesfloor"
              render={() => (
                <ServiceFloor
                  services={this.state.services}
                />
              )}
            />
            <Route
              exact path="/servicedetail"
              render={({ location }) =>
                <ServiceDetailPage 
                  location={location}
                  handleDeleteService={this.handleDeleteService}
                  user={this.state.user}
                />
              }
            />
            <Route
              exact path="/addservice"
              render={() => 
                userService.getUser() ?
                  <AddServicePage 
                    handleAddService={this.handleAddService} 
                    city={this.state.user.city}
                />
                :
                <Redirect to='/login' />
              }
            />
            <Route
              exact path="/editservice"
              render={({ location }) => 
                userService.getUser() ?
                  <EditServicePage 
                    handleUpdateService={this.handleUpdateService} 
                    location={location}
                    user={this.state.user}
                />
                :
                <Redirect to='/login' />
              }
            />
            <Route
              exact path="/directaidlinks"
              render={(props) => (
                <DirectAidLinks
                  {...props}
                />
              )}
            />
            <Route
              exact path="/addlink"
              render={(props) => (
                <AddLink
                  {...props}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    );
  }

}

export default App;
