import { useState, useEffect } from "react";
import Modal from "react-modal";
const axios = require("axios");

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "50px",
  },
};
// https://www.npmjs.com/package/react-modal

function Table() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([])
  const [inputTarefa, setInputTarefa] = useState();
  const [error, setError] = useState(false);
  const [inputStatus, setInputStatus] = useState();
  const [modalIsOpenInput, setIsOpenInput] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [selectedToEdit, setSelectedToEdit] = useState();
  const [erro, setErro] = useState(false);

  const dadosToSave = {
    tarefa: inputTarefa,
    status: inputStatus,
  };

  const getData = async () => {
    const res = await axios.get("http://localhost:9000/list");
    const dados = await res.data;

    setData(dados);
    setFilteredData(dados);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (!inputTarefa || !inputStatus) {
      setErro(true);
    } else {
    setErro(false)};
  }, [inputStatus, inputTarefa]);

  const editar = async (item) => {
    if (!item) {
      setSelectedToEdit("");
      setIsOpenInput(true);
      setInputTarefa("");
      setInputStatus("");
      setIsNew(true);
    } else {
      setIsNew(false);
      setSelectedToEdit(item);
      setIsOpenInput(true);
      setInputTarefa(item.tarefa);
      setInputStatus(item.status);
    }
  };

  const salvar = async () => {
    if (isNew) {
      await axios.post(`http://localhost:9000/list/`, dadosToSave);
      getData();
      setIsOpenInput(false);
    } else {
      axios
        .put(
          `http://localhost:9000/list/${selectedToEdit.id}`,

          dadosToSave
        )
        .then(() => {
          getData();
          setIsOpenInput(false);
        });
    }
  };

  const excluir = (item) => {
    const arr = [...data];
    axios
      .delete(`http://localhost:9000/list/${item.id}`)
      .then(() => {
        arr.splice(arr.indexOf(item), 1);
        setFilteredData(arr)
        setData(arr);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const filterByType = (type) => {
    const arr = [...filteredData]
    if(type === "task"){
      arr.sort((a,b) => (a.tarefa > b.tarefa) ? 1 : ((b.tarefa > a.tarefa) ? -1 : 0))
    }else if(type === "status"){
      arr.sort((a,b) => (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0))
    }else if(type === "date"){
      arr.sort((a,b) => (a.data_cadastro > b.data_cadastro) ? 1 : ((b.data_cadastro > a.data_cadastro) ? -1 : 0))
    }
    
    setFilteredData(arr)

    //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  }

  return (
    <div className="main">
      <Modal
        isOpen={modalIsOpenInput}
        onRequestClose={() => setIsOpenInput(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h2>Novos dados: </h2>
          <input
            placeholder="tarefa"
            value={inputTarefa}
            onChange={(e) => setInputTarefa(e.target.value)}
          ></input>
          <input
            type="radio"
            value="Pendente"
            name="check"
            onChange={(e) => setInputStatus(e.target.value)}
          />
          Pendente
          <input
            type="radio"
            value="Em andamento"
            name="check"
            onChange={(e) => setInputStatus(e.target.value)}
          />
          Em andamento
          <input
            type="radio"
            value="Pronto"
            name="check"
            onChange={(e) => setInputStatus(e.target.value)}
          />
          Pronto
          <div style={{ display: "flex", flexDirection: "column" }}>
            {erro && (
              <div style={{ fontSize: "12px", color: "red" }}>
                {" "}
                <p>Insira dados válidos:</p>
                <p>'Tarefa' e 'status' não podem estar vazios</p>
              </div>
            )}
          </div>
          <button
            style={{ color: erro ? "#dddddd" : "" }}
            onClick={() => (erro ? "" : salvar())}
          >
            Salvar
          </button>
        </div>
      </Modal>
      {filteredData.length !== 0 ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => filterByType('task')}>Tarefa</th>
              <th onClick={() => filterByType('status')}>Status</th>
              <th onClick={() => filterByType('date')}>Data de criação</th>
            </tr>
          </thead>

          <tbody>
            {filteredData &&
              filteredData.map((item, key) => (
                <tr key={key}>
                  <td>{item.tarefa}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.data_cadastro.split("-")[2].slice(0, 2)}/
                    {item.data_cadastro.split("-")[1]}/
                    {item.data_cadastro.split("-")[0]}
                  </td>
                  <td>
                    <button onClick={() => editar(item)}>Editar</button>
                  </td>
                  <td>
                    <button onClick={() => excluir(item)}>Deletar</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>Crie sua primeira tarefa!</p>
      )}
      <div>
        <button onClick={() => editar(false)}>Cadastrar nova tarefa</button>
      </div>
    </div>
  );
}

export default Table;
