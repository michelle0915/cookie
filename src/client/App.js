import React, { Component } from 'react'
import { format } from 'date-fns'
import axios from 'axios'

function parseTime(ms) {
  return format(new Date(ms), 'yyyy/MM/dd kk:mm:ss')
}

function ListItems(props) {
  const data = props.data
  const key = props.idx
  const clickHandler = props.onClick

  const list = data.map((d, idx) => 
    <li key={idx} onClick={() => clickHandler(d._id)}>
    <span>Query ID: {d.query_id}</span>
    <span>Time: {parseTime(d.update_time)}</span>
    <span>Status: {d.result ? 'Completed' : 'Querying'}</span>
    </li>
  )

  return (
    <ul id="list">{list}</ul>
  )

}

function Detail(props) {
  const data = props.data
  const id = props.id

  let result = null
  if (data.result) {
    result = data.result[0].substr(0, data.result[0].length) //trim \n
    result = result.split(',').map(num => Number(num).toFixed(2))
    result = <span>正常:{result[0]} / 異常:{result[1]}</span>
  } else {
    result = <span>処理待ち</span>
  }


  return (
    <div id="detail">
    <p>Query ID: {data.query_id}</p>
    <p>Update Time: {parseTime(data.update_time)}</p>
    <p>Status: {data.result ? 'Completed' : 'Querying'}</p>
    <img src={data.path} />
    <p>Result: {result}</p>
    </div>
  )

}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
//      alldata: [{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0},{"result":null,"_id":"5fd64ed3f9cdf85b6d3cf0d8","query_id":"S1i0R673w","path":"images/nvcamtest_23430_s00_00000.jpg","update_time":1607880403000,"__v":0},{"result":["0.65308833,0.22940926,0.11750249\n"],"_id":"5fd6516ae96ac3639b10082a","query_id":"B1zuZRQnw","path":"images/nvcamtest_25521_s00_00000.jpg","update_time":1607881212526,"__v":0}],
      alldata: [],
      selected: null
    }

    this.setSelected = this.setSelected.bind(this)
    this.fetchData = this.fetchData.bind(this)

    this.fetchData()

    setInterval(this.fetchData, 1000)
  }

  fetchData() {
    console.log('fetch data...')
    axios.get('/list/all')
      .then(res => this.setState({ alldata: res.data }))
      .catch(err => console.log(err))
  }

  setSelected(id) {
    this.setState({ selected: id })
  }

  showDetail(id) {
    if (id) {
      const data = this.state.alldata.find(data => data._id === id)
      return <Detail data={data} />
    } else {
      return null
    }
  }

  render() {
    return (
      <div>
        <h1>NeoPulse Anomaly Detection Demo</h1>
        <div id="container">
          <ListItems data={this.state.alldata} onClick={this.setSelected}/>
          {this.showDetail(this.state.selected)}
        </div>
      </div>
    );
  }
}

export default App
