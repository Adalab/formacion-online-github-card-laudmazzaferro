import React from 'react';
import Select from './Components/Select';
import Card from './Components/Card';
import { fetchMembers } from './services/fetchMembers';
import { fetchMember }  from './services/fetchMember';
import './App.css';
import moment, { months } from 'moment';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      selectMember: '',
      member:{},
      currentDay:'',
      months:''
    }
    this.getMembers = this.getMembers.bind(this);
    this.getSelectMember = this.getSelectMember.bind(this);
    this.getMemberInfo = this.getMemberInfo.bind(this);
    this.getCurrentDate = this.getCurrentDate.bind(this);
  }
  componentDidMount() {
    this.getMembers();
    this.getCurrentDate();
  };
  getMembers() {
    fetchMembers()
      .then(data => {
        this.setState({
          members: data
        }, () => { console.log(this.state.members) })
      });
  };
  
  getSelectMember(value) {
    this.setState({
      selectMember: value
    },()=>{this.getMemberInfo()});
  };

  getMemberInfo(){
    const ENDPOINT = `https://api.github.com/users/${this.state.selectMember}`
    fetchMember(ENDPOINT)
    .then(data => {
      this.setState({
        member: data
      }, () => { this.getMoms()})
    });
  }

  getCurrentDate(){
    const date = new Date();
    this.setState({
      currentDay:date
    })
  }

  getMoms(){
    const endDate = new moment(this.state.currentDay);
    const startDate = new moment(this.state.member.created_at);
    const years=moment.duration(endDate.diff(startDate)).years();
    const months = moment.duration(endDate.diff(startDate)).months();
    const  duration = years*12 +months;
    this.setState({
      months:parseInt(duration)
    })
  
  }


  render() {
    const { members , member , months} = this.state;
    return (
      <div className="App">
        <main>
          <Select members={members} getSelectMember={this.getSelectMember} ></Select>
          <Card member={member} selectMember={this.state.selectMember} months={months}></Card>
        </main>
      </div>
    )
  }
}

export default App;
