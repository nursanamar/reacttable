



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


function Alert(props){
  var classType;
  switch (props.type) {
    case 'error':
      classType = 'alert-danger'
      break;
    case 'succes':
      classType = 'alert-success'
      break;
    case 'info':
      classType = 'alert-info'
      break;
  }
  return <div className={"alert alert-dismissable "+classType}>
  <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={(e) => {
    props.onClick();
    e.preventDefault();
  }}>&times;</a>
  <strong>{props.type}</strong> {props.message}
</div>

}

function Row(props) {
  return (
    <tr>
      <td>{props.id}</td>
      <td>{props.nama}</td>
      <td>{props.addres}</td>
      <td>{props.phone}</td>
      <td><a onClick={(e) => {
        props.hapus(props.id);
        e.preventDefault();
      }} className="btn-danger btn-xs btn">Hapus</a> || <a onClick={(e) => {
        props.edit(props.id,props.nama,props.addres,props.phone);
        e.preventDefault();
      }} className="btn-danger btn-xs btn">Edit</a></td>
    </tr>
  );
}

const RowAdd = (props) => {
  return <tr>
    <td>#</td>
    <td><input type="text" value={props.name} onChange={props.actionName} /></td>
    <td><input type="text" value={props.address} onChange={props.actionAddress} /></td>
    <td><input type="text" value={props.phone} onChange={props.actionPhone} /></td>
    <td><a className="btn btn-xs btn-primary" onClick={props.addData} >Tambah</a> || <a className="btn btn-xs btn-default" onClick={props.cancel}>Cancel</a></td>
  </tr>
}

const RowEdit = (props) => {
  return <tr>
    <td>{props.id}</td>
    <td><input type="text" value={props.name} onChange={props.actionName} /></td>
    <td><input type="text" value={props.address} onChange={props.actionAddress} /></td>
    <td><input type="text" value={props.phone} onChange={props.actionPhone} /></td>
    <td><a className="btn btn-xs btn-primary" onClick={props.edit} >Edit</a> || <a className="btn btn-xs btn-default" onClick={props.cancel}>Cancel</a></td>
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
      addRow:"false",
      editRow:"false",
      id: "",
      alert:"",
      message:"",
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
  dismiss(){
    this.setState({
      alert:""
    })
  }
  addButton(){
    this.setState({
      addRow: "true"
    })
  }
  editButton(id,name,addres,phone){
    this.setState({
      editRow:"true",
      id: id,
      name:name,
      addres:addres,
      phone:phone,
    })
  }
  cancel(){
    this.setState({
      addRow:"false",
      editRow:"false",
      name:"",
      addres:"",
      phone:"",
    })
  }

  delete(id){
    this.setState({
      loading:"loading....",
      alert: "info",
      message:"Mohon tunggu"
    });
    console.log("proccess....");
    fetch(host+"Welcome/deleteData",{
      method: 'POST',
      headers: "Content-Type: application/json",
      body: JSON.stringify({
        id:id
      })
    }).then((res) => {

      this.componentDidMount();
      console.log("delete succes");
      this.setState({
        alert: "succes",
        message:"Data berhasil di hapus"
      });
    }).catch((err) => {
      this.setState({
        loading:"",
        alert: "error",
        message:err
      })
    })
  }
  editData(){
    this.setState({
      loading:"loading....",
      alert: "info",
      message:"Mohon tunggu"
    });
    console.log("editing...");
    fetch(host+"Welcome/editData",{
      method: 'POST',
      headers: "Content-Type: application/json",
      body: JSON.stringify({
        id: this.state.id,
        data: {
          name: this.state.name,
          addres: this.state.addres,
          phone: this.state.phone
        }
      })
    }).then((res) => {
      this.componentDidMount();
      this.cancel();
      console.log("edited");
      this.setState({
        alert: "succes",
        message:"Data berhasil di edit"
      });
    }).catch((err) => {
      this.setState({
        loading:"",
        alert: "error",
        message:err
      })
    })
  }
  addData(){
    this.setState({
      loading:"loading....",
      alert: "info",
      message:"Mohon tunggu"
    });
    fetch(host+"Welcome/addData",{
      method: 'POST',
      headers: "Content-Type: application/json",
      body: JSON.stringify({
        name:this.state.name,
        addres:this.state.addres,
        phone:this.state.phone
      })
    }).then((res) => {
      console.log('rquest succes', res);
      this.componentDidMount();
      this.setState({
        addRow:"false",
        alert: "succes",
        message:"Data berhasil di tambah"
      });
    }).catch((err) => {
      this.setState({
        loading:"",
        alert: "error",
        message:err
      })
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
      loading:"loading....",
      alert: "info",
      message:"Mohon tunggu"
    });
    console.log("Searchin data...");
    fetch(host+'Welcome/searchLike/'+filter+'/'+page).then((response) => {
      return response.json();
    }).then((json) => {
      this.setState({
        data: json,
        loading:"",
        alert: "succes",
        message:"Data berhasil di update"
      });
    }.bind(this)).catch((err) => {
      this.setState({
        loading:"",
        alert: "error",
        message:err
      })
    })
  }
  componentDidMount(page = 1) {
    this.setState({
      loading:"loading....",
      alert: "info",
      message:"Mohon tunggu"
    });
    console.log("fetching data...");
    fetch(host+"Welcome/getLimit/"+page).then(function(response) {
      return response.json();
    }).then(function(json){
      this.setState({
        data: json,
        loading:"",
        alert: "succes",
        message:"Data berhasil di update"
      });
      console.log("fetch succes...");
    }.bind(this)).catch((err) => {
      this.setState({
        loading:"",
        alert: "error",
        message:err
      })
    });

  }
  render() {
    var baris	 = [];
    var addRow = null;
    var editRow = null;
    var alert = null;
    this.state.data.forEach(data => {
      baris.push(<Row id={data.id} nama={data.name} addres={data.addres} phone={data.phone} hapus={this.delete.bind(this)} edit={this.editButton.bind(this)} />);
    });
    if (this.state.addRow === "true") {
      addRow = <RowAdd name={this.state.name} address={this.state.addres} phone={this.state.phone} actionName={this.actionName.bind(this)} actionAddress={this.actionAddress.bind(this)} actionPhone={this.actionPhone.bind(this)} addData={this.addData.bind(this)} cancel={this.cancel.bind(this)}  />
    }
    if (this.state.editRow === "true") {
      editRow = <RowEdit id={this.state.id} name={this.state.name} address={this.state.addres} phone={this.state.phone} actionName={this.actionName.bind(this)} actionAddress={this.actionAddress.bind(this)} actionPhone={this.actionPhone.bind(this)} edit={this.editData.bind(this)} cancel={this.cancel.bind(this)}  />

    }
    if (this.state.alert !== "") {
      alert = <Alert type={this.state.alert} message={this.state.message} onClick={this.dismiss.bind(this)} />
    }
    return (
      <div className='col-sm-8 col-sm-offset-2'>
      <h1>Tabel CRUD</h1>
        <Cari event={this.filterChange} value={this.state.filter} />
        {alert}
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
          {editRow}
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
