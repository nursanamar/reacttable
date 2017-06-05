



class Cari extends React.Component {
  constructor(props) {
    super(props);
    this.ubah = this.ubah.bind(this);
  }
  ubah(e) {
    this.props.event(e.target.value);
  }
  render() {
    return <input className='form-control cari' type="text" placeholder='search....' value={this.props.value} onChange={this.ubah} />;
  }
}




function Row(props) {
  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.nama}</td>
      <td>{props.addres}</td>
      <td>{props.phone}</td>
      <td><a onClick={props.hapus} className="btn-danger btn-small btn">Hapus</a> || <a onClick={props.edit} className="btn-danger btn-small btn">Edit</a></td>
    </tr>
  );
}

const RowAdd = (props) => {
  return <tr>
    <td>#</td>
    <td><input type="text" value={props.name} onChange={props.actionName(e)} /></td>
    <td><input type="text" value={props.address} onChange={props.actionAddress(e)} /></td>
    <td><input type="text" value={props.phone} onChange={props.actionPhone(e)} /></td>
  </tr>
}


class Tambah extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      kelas:"",
      nama:""
    };
    this.nama = this.nama.bind(this);
    this.kelas = this.kelas.bind(this);
    this.suhmit = this.submit.bind(this);
  }
  nama(e) {
    this.setState({
      nama: e.target.value
    });
  }
  kelas(e) {
    this.setState({
      kelas: e.target.value
    });
  }
  submit() {
    this.props.event(this.state.nama,this.state.kelas);
  }
  render() {
    return (
      <form>
        <input className="form-control tambah" type="text" placeholder="name" value={this.state.nama} onChange={this.nama} />
        <input className="form-control tambah" type="text" placeholder="address" value={this.state.kelas} onChange={this.kelas} />
        <input className="btn btn-primary tambah" type="submit" value="phone" onClick={this.submit} />
      </form>
    );
  }
}





class Crud extends React.Component {
  constructor(props) {
    super(props);
    this.filterChange = this.filterChange.bind(this);
    this.addButton = this.addButton.bind(this);
    this.state = {
      filter:"",
      data:[],
      status:"",
      page:1,
      loading:"loading.......",
      name:"",
      addres:"",
      phone:"",
      addRow:FALSE,
    };
  }
  filterChange(filter) {
    console.log(filter);
    this.setState({
      filter:filter
    });

    if (filter === "") {
      this.componentDidMount();
    }else {
      this.searchOnDb(filter);
    }

  }

  addButton(){
    this.setState({
      addRow: TRUE
    })
  }
  actionName(e){
    this.setState({
      name: e.target.value
    });
  }
  actionPhone(e){
    this.setState({
      phone: e.target.value
    });
  }
  actionAddress(e){
    this.setState({
      addres: e.target.value
    })
  }
  nextPage() {
    var next = this.state.page + 1;
    this.setState({
      page: this.state.page + 1,
      loading:"loading......"
    });
    if (this.state.filter === "") {
      this.componentDidMount(next);
    }else{
      this.searchOnDb(this.state.filter,next)
    }
  }
  prevPage() {
    var page = (this.state.page > 1) ? this.state.page - 1: 1;
    this.setState({
      page: (this.state.page > 1) ? this.state.page - 1: 1,
      loading: "loading......."
    });
    if (this.state.filter === "") {
      this.componentDidMount(page);
    } else {
      this.searchOnDb(this.state.filter,page)
    }
  }
  searchOnDb(filter,page = 1){
    this.setState({
      loading:"mencari di database"
    });
    console.log("Searchin data...");
    fetch('https://nursanamar.herokuapp.com/Welcome/searchLike/'+filter+'/'+page).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({
        data: json,
        loading:""
      });
    }.bind(this))
  }
  componentDidMount(page = 1) {
    this.setState({
      loading:"loading...."
    });
    console.log("fetching data...");
    fetch("https://nursanamar.herokuapp.com/Welcome/getLimit/"+page).then(function(response) {
      return response.json();
    }).then(function(json){
      this.setState({
        data: json,
        loading:""
      });
    }.bind(this));
    console.log(this.state.page);
    console.log((this.state.page > 1));
  }
  render() {
    var baris	 = [];
    var addRow = null;
    this.state.data.forEach(data => {
      baris.push(<Row id={data.id} nama={data.name} addres={data.addres} phone={data.phone} />);
    });
    if (this.state.addRow) {
      addRow = <RowAdd name={this.state.name} address={this.state.addres} phone={this.state.phone} actionName={this.actionName} actionAddress={this.actionAddress} actionPhone={this.actionPhone} />
    }
    return (
      <div className='col-sm-8 col-sm-offset-2'>
      <h1>Tabel CRUD</h1>
        <Cari event={this.filterChange} value={this.state.filter} />
        <a onClick={this.prevPage.bind(this)} className="btn btn-default">Prev</a><a onClick={this.nextPage.bind(this)} className="btn btn-default">next</a>
        <span>{this.state.loading}</span>
        <a onClick={this.addButton} className="btn btn-primary" >Tambah</a>
        <table className='table table-striped table-responsive'>
        <thead>
          <td>Id</td>
          <td>Nama</td>
          <td>Alamat</td>
          <td>Phone</td>
          <td>action</td>
        </thead>
        <tbody>
          {baris}
          {addRow}
          </tbody>
        </table>

      </div>
    );
  }
}
//	var data = [{"nama":"nsma","kelas":"ndat "},{"nama":"nursan","kelas":"XII TKJ 2"},{"nama":"ina","kelas":"XII TKJ "},{"nama":"rahmat","kelas":"XII TKJ 1"}];



ReactDOM.render(
  <Crud />,
  document.getElementById("container")
);
